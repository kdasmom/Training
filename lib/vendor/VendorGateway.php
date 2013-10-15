<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Expression;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\system\ConfigService;
use NP\property\PropertyService;
use NP\vendor\sql\criteria\VendorExistsCriteria;
use NP\vendor\sql\join\VendorRejectedJoin;
use NP\vendor\VendorSelect;
use NP\util\Util;

use NP\core\db\Adapter;

/**
 * Gateway for the VENDOR table
 *
 * @author Thomas Messier
 */
class VendorGateway extends AbstractGateway {
	protected $tableAlias = 'v';
	protected $table      = 'vendor';
	protected $pk         = 'vendor_id';
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

	/**
	 * Validate vendor
	 *
	 * @param $data
	 * @return array
	 */
	public function validateVendor($data) {

		$vendor_id = $this->checkVendorName($data['use_vendor_name'], $data['vendor_name'], $data['approval_tracking_id'], $data['integration_package_id'], $data['asp_client_id']);
		$vendor_name = '';
		$check_status = 'name';

		if (is_null($vendor_id)) {
			$result = $this->checkByVendorFedId($data['use_vendor_fed_id'], $data['vendor_fed_id'], $data['approval_tracking_id'], $data['integration_package_id'], $data['asp_client_id']);
			$vendor_id = $result['vendor_id'];
			$vendor_name = $result['vendor_name'];

			if (!is_null($vendor_id)) {
				$check_status = 'taxid';
			} else {
				$result = $this->checkByVendorAlt($data['use_vendor_id_alt'], $data['vendor_id_alt'], $data['approval_tracking_id'], $data['integration_package_id'], $data['asp_client_id']);

				$vendor_id = $result['vendor_id'];
				$vendor_name = $result['vendor_name'];
				$check_status = $result['check_status'];
			}
		}

		return [
			'vendor_id'			=> $vendor_id,
			'vendor_name'	=> $vendor_name,
			'check_status'		=> $check_status
		];

	}

	/**
	 * Check vendor name
	 *
	 * @param $useVendorName
	 * @param $vendorName
	 * @param $approvalTrackingId
	 * @param $integrationPackageId
	 * @param $aspClientId
	 * @return null
	 */
	protected function checkVendorName($useVendorName, $vendorName, $approvalTrackingId, $integrationPackageId, $aspClientId) {
		$select = new Select();

		if ($useVendorName) {
			$select->from(['v' => 'vendor'])
					->columns(['vendor_id'])
					->join(['i' => 'integrationpackage'], 'i.integration_package_id = v.integration_package_id', [])
					->where(new  sql\criteria\VendorExistsCriteria())
					->where(['rtrim((v.vendor_name)' => 'rtrim(?)'])
					->where(new sql\criteria\VendorInActiveDateCriteria());
			$result = $this->adapter->query($select, [$approvalTrackingId, 'rejected', $integrationPackageId, $aspClientId, $vendorName]);

			return count($result) > 1 ? $result[0]['vendor_id'] : null;
		} else {
			return null;
		}
	}

	/**
	 * check by vendor fed id
	 *
	 * @param $useVendorFedId
	 * @param $vendorFedId
	 * @param $approvalTrackingId
	 * @param $integrationPackageId
	 * @param $aspClientId
	 * @return array
	 */
	protected function checkByVendorFedId($useVendorFedId, $vendorFedId, $approvalTrackingId, $integrationPackageId, $aspClientId) {
		$vendorId = null;
		$vendorName = '';

		if ($useVendorFedId == 1 && !is_null($vendorFedId)) {
			$select = new Select();

			$select->from(['v' => 'vendor'])
						->columns(['vendor_id', 'vendor_name'])
						->join(['i' => 'integrationpackage'], 'i.integration_package_id = v.integration_package_id', [])
						->where(new sql\criteria\VendorExistsCriteria())
						->whereEquals('rtrim(v.vendor_fedid)', 'rtrim(?)')
						->where(new sql\criteria\VendorInActiveDateCriteria())
						->whereNotEquals('v.vendor_fedid', '')
						->whereIsNotNull('v.vendor_fedid');

			$result = $this->adapter->query($select, [$approvalTrackingId, 'rejected', $integrationPackageId, $aspClientId, $vendorFedId]);

			$vendorId = count($result) > 1 ? $result[0]['vendor_id'] : null;
			$vendorName = count($result) > 1 ? $result[0]['vendor_name'] : '';
		}

		return array(
			'vendor_id' => $vendorId,
			'vendor_name'	=> $vendorName
		);
	}

	/**
	 * check for the vendor alt
	 *
	 * @param $useVendorIdAlt
	 * @param $vendorIdAlt
	 * @param $approvalTrackingId
	 * @param $integrationPackageId
	 * @param $aspClientId
	 * @return array
	 */
	public  function  checkByVendorAlt($useVendorIdAlt, $vendorIdAlt, $approvalTrackingId, $integrationPackageId, $aspClientId) {
		$vendorId = null;
		$vendorName = '';
		$checkStatus = 'OK';

		if ($useVendorIdAlt == 1) {
			$select = new Select();

			$select->from(['v' => 'vendor'])
				->columns(['vendor_id', 'vendor_name'])
				->join(['i' => 'integrationpackage'], 'i.integration_package_id = v.integration_package_id', [])
				->where(new sql\criteria\VendorExistsCriteria())
				->whereEquals('rtrim(v.vendor_id_alt)', 'rtrim(?)');

			$result = $this->adapter->query($select, [$approvalTrackingId, 'rejected', $integrationPackageId, $aspClientId, $vendorIdAlt]);

			$vendorId = count($result) > 1 ? $result[0]['vendor_id'] : null;
			$vendorName = count($result) > 1 ? $result[0]['vendor_name'] : '';
		}

		if (!is_null($vendorId)) {
			$checkStatus = 'idalt';
		}

		return array(
			'vendor_id'			=> $vendorId,
			'vendor_name'	=> $vendorName,
			'check_status'		=> $checkStatus
		);
	}

	public function approveVendor($aspClientId = null, $userProfileId = null, $vendorId, $approvalTrackingId, $approvalStatus) {
		if ($approvalTrackingId == $vendorId) {
			$vendor = $this->update(
				['vendor_status' => $approvalStatus],
				['vendor_id'	=> '?'],
				[$vendorId]
			);

			return $vendor;
		} else {

		}
	}

	public function recauthorSave($userprofile_id, $tablename, $tablekey_id, $delegation_to_userprofile_id = null) {
		$delegation_to_userprofile_id = is_null($delegation_to_userprofile_id) ? $userprofile_id : $delegation_to_userprofile_id;
		$count = 0;
		if ($tablename !== 'vendor') {
			$select = new Select();
			$select->from(['r' => 'recauthor'])
						->count(true, 'tablekey_count')
						->where(
								[
									'r.tablekey_id' => '?',
									'r.table_name' => '?'
								]
						);
			$result = $this->adapter->query($select, [$tablekey_id, $tablename]);
			$count = $result[0]['tablekey_count'];
		}

		if ($count == 0) {
			$sql = "insert into recauthor (userprofile_id, delegation_to_userprofile_id, table_name, tablekey_id, recauthor_datetm) values ({$userprofile_id}, {$delegation_to_userprofile_id}, '{$tablename}', {$tablekey_id}, GetDate())";
			$this->adapter->query($sql);
		}
	}

}

?>