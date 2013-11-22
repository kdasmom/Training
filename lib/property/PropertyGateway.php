<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Update;
use NP\core\db\Delete;
use NP\core\db\Where;

/**
 * Gateway for the PROPERTY table
 *
 * @author Thomas Messier
 */
class PropertyGateway  extends AbstractGateway {
	protected $tableAlias = 'pr';
	
	/**
	 * Retrieve a property by Id
	 */
	public function findById($id, $cols=null) {
		$joins = array(
			new sql\join\PropertyAddressJoin(),
			new sql\join\PropertyPhoneJoin(),
			new sql\join\PropertyFaxJoin(),
			new sql\join\PropertyBillToShipToJoin('bill'),
			new sql\join\PropertyBillToShipToJoin('ship')
		);

		$res = $this->find(
			array('pr.property_id'=>'?'),
			array($id),
			null,
			$cols,
			null,
			null,
			$joins
		);

		return $res[0];
	}

	/**
	 * Find properties for a given user
	 *
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @return array                               Array of property records
	 */
	public function findByUser($userprofile_id, $delegation_to_userprofile_id, $cols=null) {
		$select = new Select();
		$select->from(array('pr'=>'property'))
				->columns($cols)
				->order("pr.property_name");
		if ($userprofile_id == $delegation_to_userprofile_id) {
			$select->join(array('pu'=>'propertyuserprofile'),
							"pr.property_id = pu.property_id",
							array())
					->where("
						pu.userprofile_id = ?
						AND pr.property_status <> 0
					");
			$params = array($userprofile_id);
		} else {
			$select->join(array('dp'=>'delegationprop'),
							"pr.property_id = dp.property_id",
							array())
					->join(array('d'=>'delegation'),
							"dp.delegation_id = d.delegation_id",
							array())
					->where('
						d.userprofile_id = ?
						AND d.delegation_to_userprofile_id = ?
						AND d.delegation_status = 1
						AND d.delegation_startdate <= getDate()
						AND d.delegation_stopdate > getDate()
					');
			$params = array($userprofile_id, $delegation_to_userprofile_id);
		}

		return $this->adapter->query($select, $params);
	}

	/**
	 * Find coding access only properties for a given user
	 *
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @return array                               Array of property records
	 */
	public function findCodingByUser($userprofile_id, $cols=null) {
		$select = new Select();
		$select->from(array('pr'=>'property'))
				->columns($cols)
				->join(array('pu'=>'propertyusercoding'),
						"pr.property_id = pu.property_id",
						array())
				->whereEquals('pu.userprofile_id', '?')
				->whereNotEquals('pr.property_status', '0')
				->order("pr.property_name");
		
		return $this->adapter->query($select, array($userprofile_id));
	}
	
	public function getBillToShipToProperties($type, $property_id) {
		$type = strtolower($type);

		$validTypes = array('bill','ship');
		if (!in_array($type, $validTypes)) {
			throw new \NP\core\Exception('Invalid $type argument. Valid options for $type are ' . implode(' and ', $validTypes));
		}
		$type = ucfirst($type);

		$select = new Select();
		$select->columns(array(
					'property_id',
					'property_id_alt',
					'property_name'
				))
				->from('property')
				->whereOr()
				->whereEquals('property_id', '?')
				->whereNest()
				->whereIn('property_status', '?,?')
				->whereNest('OR')
				->whereEquals("property_option{$type}Address", 1)
				->whereIsNull("property_option{$type}Address")
				->order('property_name');

		return $this->adapter->query($select, array($property_id, 1,-1));
	}

	/**
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string $property_keyword            A keyword
	 * @return array                               Array of property records
	 */
	public function findForInvoiceItemComboBox($userprofile_id, $delegation_to_userprofile_id, $property_keyword) {
		$select = new Select();
		$select->from(array('p'=>'property'))
				->where('
					EXISTS (
						SELECT *
						FROM propertyuserprofile pu
						WHERE pu.property_id = pr.property_id
							AND pu.userprofile_id = ?
					)
					AND (
						property_name LIKE ?
						OR property_id_alt LIKE ?
					)
				')
				->order('pr.property_name');
		
		$property_keyword = $property_keyword . '%';
		
		return $this->adapter->query($select, array($userprofile_id,$property_keyword,$property_keyword));
	}

	/**
	 * Updates the status of several properties
	 *
	 * @param  int      $property_status  The status to set the properties to
	 * @param  string[] $property_id_list The IDs for the properties to perform the operation on
	 * @param  int      $userprofile_id   The user performing the operation
	 * @return boolean                    Whether or not the operation was successful
	 */
	public function updatePropertiesStatus($property_status, $property_id_list, $userprofile_id) {
		$now = \NP\util\Util::formatDateForDB();
		$update = new Update();
		
		// Create an placeholders for the IN clause
		$propertyPlaceHolders = $this->createPlaceholders($property_id_list);

		// Create the update statement
		$update->table('property')
				->values(array(
					'property_status'     => '?',
					'last_updated_by'     => '?',
					'last_updated_datetm' => "'{$now}'"
				))
				->whereIn('property_id', $propertyPlaceHolders);

		// Prepend the userprofile_id parameter to the list of property IDs since it comes first in the query
		array_unshift($property_id_list, $property_status, $userprofile_id);

		return $this->adapter->query($update, $property_id_list);
	}

    /**
     * Get user property list if userprofile_id = delegation_to_userprofile_id.
     * 
     * Analog: USER_PROPERTY_LISTING combined with UDF_USER_PROPERTY_LISTING
     * 
     * @param int $userprofile_id User profile id.
     * @param int $asp_client_id Client id.
     * @param int $vendor_id use passed vendor is for calculations.
     * @param string $orderby Field which will be used for result ordering.
     * 
     * @return [] List of available properties.
     */
    public function getUserPropertyListingForUser($userprofile_id, $asp_client_id, $vendor_id = null, $orderby = null, $integration_package = null, $property_status = 1) {
        $orderby = !empty($orderby) ? $orderby : 'property_name';

        $select01 = new Select();
        $select01
            ->columns([
                'fiscalcalmonth_id'
            ])
            ->from('FISCALCALMONTH')
                ->join('FISCALCAL', 'FISCALCALMONTH.fiscalcal_id = FISCALCAL.fiscalcal_id', [], Select::JOIN_INNER)
                ->join(['p' => 'PROPERTY'], 'FISCALCAL.property_id = p.property_id', ['property_id', 'property_no_units', 'property_name', 'property_id_alt', 'property_status', 'integration_package_id'], Select::JOIN_RIGHT)
                ->join(['ip' => 'INTEGRATIONPACKAGE'], 'p.integration_package_id=ip.integration_package_id AND ip.asp_client_id='.$asp_client_id, [], Select::JOIN_INNER)
            ->order($orderby)
        ;
        $where01 = new Where();
        $where01
            ->equals('FISCALCALMONTH.fiscalcalmonth_num', 'Month(getdate())')
            ->equals('FISCALCAL.fiscalcal_year', 'Year(getdate())')
            ->nest('OR')
                ->in(
                    'p.property_id',
                    Select::get()
                        ->distinct()
                            ->column('property_id')
                        ->from(['bu' => 'PROPERTYUSERPROFILE'])
                        ->where(
                            Where::get()
                                ->equals('bu.userprofile_id', $userprofile_id)
                        )
                )
                ->equals($userprofile_id, 0)
            ->unnest()
            ->equals('p.property_status', $property_status)
        ;
        if (!empty($vendor_id)) {
            $where01
                ->equals(
                    'p.integration_package_id',
                    Select::get()
                        ->column('integration_package_id')
                        ->from('vendor')
                        ->where(
                            Where::get()
                                ->equals('vendor_id', $vendor_id)
                                ->equals('approval_tracking_id', 'vendor_id')
                        )
                )
            ;
        }
        if (!empty($integration_package)) {
            $where01->equals('p.integration_package_id', $integration_package);
        }
        $select01->where($where01);

        $select02 = new Select();
        $select02
            ->columns([
                'property_id',
                'property_no_units',
                'property_name',
                'property_id_alt',
                'property_status',
                'integration_package_id'
            ])
            ->from('Property')
                ->join(['ip' => 'INTEGRATIONPACKAGE'], 'Property.integration_package_id=ip.integration_package_id AND ip.asp_client_id='.$asp_client_id, [], Select::JOIN_INNER)
            ->order($orderby)
        ;
        $where02 = new Where();
        $where02
            ->nest('OR')
                ->in(
                    'property_id',
                    Select::get()
                        ->distinct()
                            ->column('property_id')
                        ->from(['bu' => 'PROPERTYUSERPROFILE'])
                        ->where(
                            Where::get()
                                ->equals('bu.userprofile_id', $userprofile_id)
                        )
                )
                ->equals($userprofile_id, 0)
            ->unnest()
            ->notIn(
                'property_id',
                Select::get()
                    ->columns([])
                    ->from('FISCALCALMONTH')
                        ->join('FISCALCAL', 'FISCALCALMONTH.fiscalcal_id = FISCALCAL.fiscalcal_id ', [], Select::JOIN_INNER)
                        ->join(['p' => 'PROPERTY'], 'FISCALCAL.property_id = p.property_id', ['property_id'], Select::JOIN_RIGHT)
                    ->where(
                        Where::get()
                            ->equals('FISCALCALMONTH.fiscalcalmonth_num', 'Month(getdate())')
                            ->equals('FISCALCAL.fiscalcal_year', 'Year(getdate())')
                    )
            )
            ->equals('property_status', $property_status)
        ;
        if (!empty($vendor_id)) {
            $where02
                ->equals(
                    'Property.integration_package_id',
                    Select::get()
                        ->column('integration_package_id')
                        ->from('vendor')
                        ->where(
                            Where::get()
                                ->equals('vendor_id', $vendor_id)
                                ->equals('approval_tracking_id', 'vendor_id')
                        )
                        ->limit(1)
                )
            ;
        }
        if (!empty($integration_package)) {
            $where02->equals('Property.integration_package_id', $integration_package);
        }
        $select02->where($where02);

        $result01 = $this->adapter->query($select01);
        $result02 = $this->adapter->query($select02);

        $result = $result01;
        foreach ($result02 as $values) {
            $values['Fiscalcalmonth_id'] = null;
            $result[] = $values;
        }

        return $result;
    }

    /**
     * Get user property list if userprofile_id <> delegation_to_userprofile_id.
     * 
     * @param int $userprofile_id User profile id.
     * @param int $delegation_to_userprofile_id Delegate profile id.
     * @param int $asp_client_id Client id.
     * @param boolean $includeCodingOnly
     * @param string $orderby Field which will be used for result ordering.
     * 
     * @return [] List of available properties.
     */
    public function getUserPropertyListingForDelegate($userprofile_id, $delegation_to_userprofile_id, $asp_client_id, $includeCodingOnly = false, $orderby = null, $integration_package = null, $property_status = 1) {
        $orderby = !empty($orderby) ? $orderby : 'property_name';

        $select01 = new Select();
        $select01
            ->distinct()
            ->columns([])
            ->from(['d' => 'delegation'])
                ->join(['dp' => 'delegationprop'], 'd.delegation_id = dp.delegation_id', [], Select::JOIN_INNER)
                ->join(['p' => 'PROPERTY'], 'dp.property_id = p.property_id', ['property_id', 'property_no_units', 'property_name', 'property_id_alt', 'property_status', 'integration_package_id'], Select::JOIN_INNER)
                ->join(['f' => 'fiscalcal'], 'f.property_id = p.property_id', [], Select::JOIN_INNER)
                ->join(['fm' => 'fiscalcalmonth'], 'f.fiscalcal_id = fm.fiscalcal_id', ['fiscalcalmonth_id'], Select::JOIN_INNER)
            ->order($orderby)
        ;
        $where01 = new Where();
        $where01
            ->equals('d.userprofile_id', $userprofile_id)
            ->equals('d.delegation_to_userprofile_id', $delegation_to_userprofile_id)
            ->equals('d.delegation_status', 1)
            ->lessThanOrEqual('d.delegation_startdate', 'getDate()')
            ->greaterThan('d.delegation_stopdate', 'getDate()')
            ->equals('fm.fiscalcalmonth_num', 'Month(getdate())')
            ->equals('f.fiscalcal_year', 'Year(getdate())')
            ->equals('p.property_status', $property_status)
        ;
        if (!empty($integration_package)) {
            $where01->equals('p.integration_package_id', $integration_package);
        }
        $select01->where($where01);

        $result = $this->adapter->query($select01);
        for ($i = 0; $i < count($result); $i++) {
            $result[$i]['is_coding_only'] = 0;
        }

        if ($includeCodingOnly) {
            $select02 = new Select();
            $select02
                ->distinct()
                ->columns([])
                ->from(['pu' => 'propertyusercoding'])
                    ->join(['p' => 'PROPERTY'], 'pu.property_id = p.property_id', ['property_id', 'property_no_units', 'property_name', 'property_id_alt', 'property_status', 'integration_package_id'], Select::JOIN_INNER)
                    ->join(['f' => 'fiscalcal'], 'f.property_id = p.property_id', [], Select::JOIN_INNER)
                    ->join(['fm' => 'fiscalcalmonth'], 'f.fiscalcal_id = fm.fiscalcal_id', ['fiscalcalmonth_id'], Select::JOIN_INNER)
                ->order($orderby)
            ;
            $where02 = new Where();
            $where02
                ->equals('pu.userprofile_id', $userprofile_id)
                ->equals('fm.fiscalcalmonth_num', 'Month(getdate())')
                ->equals('f.fiscalcal_year', 'Year(getdate())')
                ->equals('p.property_status', $property_status)
            ;
            if (!empty($integration_package)) {
                $where02->equals('p.integration_package_id', $integration_package);
            }
            $select02->where($where02);

            $result02 = $this->adapter->query($select02);
            foreach ($result02 as $values) {
                $values['is_coding_only'] = 1;
                $result[] = $values;
            }
        }
        return $result;
    }

    /**
     * Get property address.
     * 
     * @param int $id Property identifier.
     * @param string $address_type Address type.
     */
    public function getPropertyAddress($id, $address_type) {
        $select = new Select();
        $select
            ->columns([
                'address_line1',
                'address_line2',
                'address_line3',
                'address_city',
                'address_state',
                'address_zip',
                'address_zipext'
            ])
            ->from(['a' => 'address'])
                ->join(['adt' => 'ADDRESSTYPE'], 'adt.addresstype_id=a.addresstype_id AND adt.addresstype_name=\''.$address_type.'\'', [], Select::JOIN_INNER)
                ->join(['p' => 'PROPERTY'], 'p.property_id = a.tablekey_id AND a.table_name=\'property\'', ['entity_name' => 'property_name', 'entity_code' => 'property_id_alt'], Select::JOIN_INNER)
            ->where(
                Where::get()
                    ->equals('p.property_id', $id)
            )
        ;
        $result = $this->adapter->query($select);
        if (!empty($result) && !empty($result[0])) {
            $result = $result[0];
            $result['zip'] = $result['address_zip'] + '' + $result['address_zipext'];
        }

        return $result;
    }
}