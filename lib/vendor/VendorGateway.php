<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\system\ConfigService;
use NP\property\PropertyService;
use NP\vendor\sql\join\VendorRejectedJoin;
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

	/**
	 * Retrieve vendors list by status
	 *
	 * @param null $pageSize
	 * @param null $page
	 * @param string $status
	 * @param string $order
	 * @param $aspClientId
	 * @return array|bool
	 */
	public function findByStatus($pageSize = null, $page = null, $status = 'forapproval', $order = 'PersonName',  $aspClientId) {
		$selectvendor = new sql\VendorSelect();


		if ($status == 'Pending') {
			$status = 'forapproval';
		}

		$status = strtolower($status);
		$where = ['v.vendor_status' => '?', 'i.asp_client_id' => '?'];
		$params = [$status, $aspClientId];
		if ($status == 'rejected') {
			$where['v.vendor_reject_dt >'] = '?';
			$params[] = 'DateAdd(d, -30, GetDate())';
		}
		$selectvendor->columns(['vendor_id', 'vendor_name', 'vendor_status'])
		  			->columnsPersonName()
					->columnSentForApprovalDate()
					->columnApprovalType()
					->join(['i' => 'integrationpackage'], 'v.integration_package_id = i.integration_package_id', ['integration_package_name'])
					->where(['v.vendor_status' => '?', 'i.asp_client_id' => '?'])
					->order($order)
					->limit($pageSize)
					->offset($pageSize * ($page - 1));
		if ($status == 'rejected') {
			$selectvendor->join(new sql\join\VendorRejectedJoin());
		}

		return $this->adapter->query($selectvendor, $params);
	}

	/**
	 * Retrieve vendor's types records list
	 *
	 * @return array|bool
	 */
	public function findVendorTypes() {
		$select = new Select();

		$select->from(['vt' => 'vendortype'])
					->order('vt.vendortype_name');

		return $this->adapter->query($select);
	}

	public function validateVendor($data) {
		var_dump($data);
		/**
		 * @in_asp_client_id int,
		@in_vendor_id int,
		@in_vendor_name varchar(500),
		@in_vendor_fedid varchar(30),
		@in_vendor_id_alt varchar(50),
		@in_useVendorName int,
		@in_useVendorFedId int,
		@in_UseVendorIdAlt int,
		@in_Integration_Package_id int,

		@out_check_status varchar(20) OUTPUT,
		@out_vendor_id int OUTPUT,
		@out_vendor_name varchar(500) OUTPUT
		 */
		$approval_tracking_id = $this->find(['vendor_id' => '?'], [$data['vendor_id']], null, ['approval_tracking_id']);

	}

	protected function isIssetVendorId($useVendorName, $vendorName, $approval_tracking_id, $integrationPackageId, $asp_client_id) {
		$select = new Select();

		if ($useVendorName) {
		$select->from(['v' => 'vendor'])
					->columns(['vendor_id'])
					->join(['i' => 'integrationpackage'], 'i.integration_package_id = v.integration_package_id', [])
					->where(['rtrim((v.vendor_name)' => 'rtrim(?)'])
					->whereNotEquals('v.approval_tracking_id', '?')
					->whereNest('OR')
					->whereLessThanOrEqual('v.vendor_active_startdate', 'GetDate()')
					->whereIsNull('v.vendor_active_startdate')
					->whereUnNest()
					->whereNest('OR')
					->whereGreaterThan('v.vendor_active_enddate', 'GetDate()')
					->whereIsNull('v.vendor_active_enddate')
					->whereUnNest()
					->whereNotEqual('v.vendor_status', "'rejected'")
					->whereEquals('v.Integration_Package_id', "?")
					->where(['ip.asp_client_id' => '?']);
			$result = $this->adapter->query($select, [$vendorName, $approval_tracking_id, $integrationPackageId, $asp_client_id]);

			return $result[0]['vendor_id'];
		} else {
			return null;
		}
	}

}

?>