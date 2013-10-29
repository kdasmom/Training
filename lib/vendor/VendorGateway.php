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

}

?>