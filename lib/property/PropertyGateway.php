<?php

namespace NP\property;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Update;
use NP\core\db\Delete;

/**
 * Gateway for the PROPERTY table
 *
 * @author Thomas Messier
 */
class PropertyGateway  extends AbstractGateway {

    public function findByAltIdAndIntegrationPackage($altId, $integrationPackageId)
    {
        $select = new Select();
        $select ->from('property')
            ->columns(array('id' => 'property_id'))
            ->where("property_id_alt = ? AND integration_package_id = ?");

        $res = $this->adapter->query($select, array($altId, $integrationPackageId));

        return $res[0];
    }
	
	/**
	 * Retrieve a property by Id
	 */
	public function findById($id, $cols=null) {
		$select = new sql\PropertySelect();
		$select->columns($cols)
				->joinAddress()
				->joinPhone()
				->joinFax()
				->joinBillOrShipToProperty('bill')
				->joinBillOrShipToProperty('ship')
				->whereEquals('p.property_id', '?');

		$res = $this->adapter->query($select, array($id));

		return $res[0];
	}

	/**
	 * Find properties by a given status
	 *
	 * @param  int    $property_status The status of the property; can be 1 (active), 0 (inactive), or -1 (on hold)
	 * @param  int    $pageSize        The number of records per page; if null, all records are returned
	 * @param  int    $page            The page for which to return records
	 * @param  string $sort            Field(s) by which to sort the result; defaults to property_name
	 * @return array                   Array of property records
	 */
	public function findByStatus($property_status, $pageSize=null, $page=null, $sort="property_name") {
		$select = new sql\PropertySelect();

		$select->joinIntegrationPackage(array('integration_package_name'))
				->joinRegion(array('region_name'))
				->joinCreatedByUser(array('created_by_userprofile_id'=>'userprofile_id', 'created_by_userprofile_username'=>'userprofile_username'))
				->joinCreatedByPerson(array(
					'created_by_person_firstname' =>'person_firstname',
					'created_by_person_lastname'  =>'person_lastname'
				))
				->joinUpdatedByUser(array('last_updated_by_userprofile_id'=>'userprofile_id', 'last_updated_by_userprofile_username'=>'userprofile_username'))
				->joinUpdatedByPerson(array(
					'last_updated_by_person_firstname' =>'person_firstname',
					'last_updated_by_person_lastname'  =>'person_lastname'
				))
				->whereEquals('p.property_status', '?')
				->order($sort);

		$params = array($property_status);

		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
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
		$select->from(array('p'=>'property'))
				->columns($cols)
				->order("p.property_name");
		if ($userprofile_id == $delegation_to_userprofile_id) {
			$select->join(array('pu'=>'propertyuserprofile'),
							"p.property_id = pu.property_id",
							array())
					->where("
						pu.userprofile_id = ?
						AND p.property_status <> 0
					");
			$params = array($userprofile_id);
		} else {
			$select->join(array('dp'=>'delegationprop'),
							"p.property_id = dp.property_id",
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
		$select->from(array('p'=>'property'))
				->columns($cols)
				->join(array('pu'=>'propertyusercoding'),
						"p.property_id = pu.property_id",
						array())
				->whereEquals('pu.userprofile_id', '?')
				->whereNotEquals('p.property_status', '0')
				->order("p.property_name");
		
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
						WHERE pu.property_id = p.property_id
							AND pu.userprofile_id = ?
					)
					AND (
						property_name LIKE ?
						OR property_id_alt LIKE ?
					)
				')
				->order('p.property_name');
		
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
}

?>
