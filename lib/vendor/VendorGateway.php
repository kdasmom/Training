<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\system\ConfigService;
use NP\property\PropertyService;
use NP\vendor\VendorSelect;

use NP\core\db\Adapter;

/**
 * Gateway for the VENDOR table
 *
 * @author Thomas Messier
 */
class VendorGateway extends AbstractGateway {
	protected $tableAlias = 'v';
	/**
	 * Override getSelect() to get the vendorsite_id by default
	 */
	public function getSelect() {
		return Select::get()->from(array('v'=>'vendor'))
							->join(array('vs'=>'vendorsite'),
									'v.vendor_id = vs.vendor_id AND v.vendor_status = vs.vendorsite_status',
									array('vendorsite_id'));
	}

	/**
	 * Setter function required by DI to set the config service via setter injection
	 * @param \NP\system\ConfigService $configService
	 */
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}
	
	/**
	 * Retrieves a vendor record looking it up by vendorsite ID
	 *
	 * @param  int $vendorsite_id
	 * @return array
	 */
	public function findByVendorsite($vendorsite_id) {
		$res = $this->find('vendorsite_id = ?', array($vendorsite_id));
		
		return $res[0];
	}
	
	/**
	 * Retrieves vendor records based on some criteria. This function is used by autocomplete combos
	 *
	 * @param  string $keyword Keyword to use to search for a vendor
	 * @return array           Array of vendor records
	 */
	public function getForCatalogDropDown($keyword) {
		// Add wildcard character for vendor name to search for vendors beginning with
		$keyword .= '%';
		
		$params = array($keyword);
		
		$select = new sql\VendorSelect();
		$select->populateForDropdown();
		
		return $this->adapter->query($select, $params);
	}
	
	public function findVendorsToApprove($countOnly, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = new sql\VendorSelect();

		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs')
					->column('vendor_id');
		} else {
			if ( substr($sort, 0, 7) == 'vendor_' ) {
				$sort = "v.{$sort}";
			}

			$select->columns(array(
						'vendor_id',
						'vendor_id_alt',
						'vendor_name',
						'vendor_fedid',
						'integration_package_id'
					))
					->columnSentForApprovalDate()
					->columnSentForApprovalBy()
					->order($sort);
		}

		$select->join(new sql\join\VendorIntPkgJoin())
				->join(new sql\join\VendorApprovalJoin())
				->whereEquals('v.vendor_status', "'forapproval'");

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'vendor_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

        public function getVendors() {
            $select = $this->getSelect();
            $select
                ->columns([
                    'vendor_id',
                    'vendor_name',
                    'vendor_id_alt',
                    'vendor_status'
                ])
                ->where(
                    Where::get()
                        ->nest('OR')
                            ->equals('v.vendor_status', '\'active\'')
                            ->equals('v.vendor_status', '\'inactive\'')
                        ->unnest()
                )
                ->order('v.vendor_name')
            ;

            return $this->adapter->query($select);
        }

    public function getVendorAddress($id, $address_type) {
        $select01 = new Select();
        $select01
            ->column('phonetype_id')
            ->from(['pht' => 'PHONETYPE'])
            ->where(
                Where::get()
                    ->equals('phonetype_name', '\'main\'')
            )
            ->limit(1)
        ;

        $select02 = new Select();
        $select02
            ->column('phonetype_id')
            ->from(['pht2' => 'PHONETYPE'])
            ->where(
                Where::get()
                    ->equals('phonetype_name', '\'fax\'')
            )
            ->limit(1)
        ;

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
                ->join(['vs' => 'VENDORSITE'], 'vs.vendorsite_id=a.tablekey_id AND a.table_name=\'vendorsite\'', [], Select::JOIN_INNER)
                ->join(['v' => 'VENDOR'], 'v.vendor_id=vs.vendor_id', ['entity_name' => 'vendor_name', 'entity_code' => 'vendor_id_alt'], Select::JOIN_INNER)
                ->join(['ph' => 'PHONE'], 'ph.tablekey_id=vs.vendorsite_id AND ph.table_name=\'vendorsite\' AND ph.phonetype_id=('.$select01->toString().')', ['phone' => 'phone_number', 'phone_ext'], Select::JOIN_INNER)
                ->join(['ph2' => 'PHONE'], 'ph2.tablekey_id=vs.vendorsite_id AND ph2.table_name=\'vendorsite\' AND ph2.phonetype_id=('.$select02->toString().')', ['fax' => 'phone_number', 'fax_ext2' => 'phone_ext'], Select::JOIN_INNER)
            ->where(
                Where::get()
                    ->equals('vs.vendorsite_id', $id)
            )
        ;
        $result = $this->adapter->query($select);
        if (!empty($result) && !empty($result[0])) {
            $result = $result[0];
            $result['zip'] = $result['address_zip'] + '' + $result['address_zipext'];
        }

        return $result;
    }

    //public function getVendorListing($property_id) {
    public function getVendorListing($integration_package, $orderby = 'v.vendor_name') {
        $select01 = new \NP\core\db\Select();
        $select01
            ->column('addresstype_id')
            ->from('addresstype')
            ->whereEquals('addresstype_name', '\'Mailing\'')
        ;

        /*$select02 = new \NP\core\db\Select();
        $select02
            ->column('integration_package_id')
            ->from('PROPERTY')
            ->whereEquals('property_id', $property_id)
        ;*/
                
        $select = new \NP\core\db\Select();
        $select
            ->distinct()
            ->columns([
                'vendor_name',
                'vendor_id_alt'
            ])
            ->from(['v' => 'VENDOR'])
                ->join(['vs' => 'VENDORSITE'], 'v.vendor_id = vs.vendor_id', ['vendorsite_id', 'vendorsite_status'], \NP\core\db\Select::JOIN_INNER)
                ->join(['a' => 'ADDRESS'], 'a.tablekey_id = vs.vendorsite_id  AND a.addresstype_id = ('.$select01->toString().')', ['address_city', 'address_zip'], \NP\core\db\Select::JOIN_LEFT)
            ->order('v.vendor_name')
        ;
        $where = new Where();
        $where
            ->equals('v.vendor_status', '\'active\'')
            ->equals('vs.vendorsite_status', '\'active\'')
            //->equals('v.integration_package_id', $select02)
            ->equals('v.integration_package_id', $integration_package)
        ;
        $select->where($where);

        return $this->adapter->query($select);
    }

	/**
	 * Get vendors that will show up as available options for an invoice
	 */
	public function findVendorsForInvoice($property_id, $vendor_id=null, $keyword=null) {
		$now = \NP\util\Util::formatDateForDB();

		$select = $this->getSelect()
						->columns(['vendor_id','vendor_id_alt','vendor_name'])
						->join(new sql\join\VendorsiteAddressJoin())
						->join(new sql\join\VendorsitePhoneJoin());

		if ($vendor_id !== null && $keyword === null) {
			$select->whereEquals('v.vendor_id', '?');
			$params = [$vendor_id];
		} else {
			$select->whereEquals('v.vendor_status', "'active'")
					->whereNotIn(
						'v.vendor_id',
						Select::get()->column('vendor_id')
									->from('vendor')
									->whereOr()
									->whereGreaterThan('v.vendor_active_startdate', "'{$now}'")
									->whereLessThan('v.vendor_active_enddate', "'{$now}'")
					)
					->whereNotExists(
						Select::get()->from(['ins'=>'insurance'])
									->join(new sql\join\InsuranceLinkPropertyJoin())
									->whereIsNotNull('ins.insurancetype_id')
									->whereLessThanOrEqual('ins.insurance_expdatetm', "'{$now}'")
									->whereEquals('ins.tablekey_id', 'v.vendor_id')
									->whereEquals('lip.property_id', '?')
					)
					->order('v.vendor_name')
					->limit(200);

			$params = [$property_id];

			if ($keyword !== null) {
				$keyword = "%{$keyword}%";
				$select->whereNest('OR')
							->whereLike('v.vendor_name', '?')
							->whereLike('v.vendor_id_alt', '?')
						->whereUnnest();

				array_push($params, $keyword, $keyword);
			}
		}

		return $this->adapter->query($select, $params);
	}
}
