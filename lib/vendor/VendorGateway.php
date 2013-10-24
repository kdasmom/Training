<?php

namespace NP\vendor;

use NP\contact\AddressGateway;
use NP\contact\EmailGateway;
use NP\contact\PhoneGateway;
use NP\core\AbstractGateway;
use NP\core\db\Delete;
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
use NP\vendor\sql\criteria\VendorSearchCriteria;

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
		$params = [$status, $aspClientId];
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
			$selectvendor->join(new sql\join\VendorRejectedJoin())
									->whereGreaterThan('v.vendor_reject_dt', '?');
			$date = date('Y-m-d', strtotime('-30 day'));
			$params[] = Util::formatDateForDB(new \DateTime($date));
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

		$vendor_id = null;
		$vendor_name = '';
		$check_status = 'name';

		if ($data['use_vendor_name']) {
			$vendor_id = $this->checkVendorName($data['use_vendor_name'], $data['vendor_name'], $data['approval_tracking_id'], $data['integration_package_id'], $data['asp_client_id']);
		}

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
			'vendor_name'		=> $vendor_name,
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

		if ($approvalTrackingId === $vendorId) {
			$vendor = $this->update(
				['vendor_status' => $approvalStatus],
				['vendor_id'	=> '?'],
				[$vendorId]
			);


			if ($vendor) {

				return [
					'vendor_id'			=> $vendorId,
					'approval_status'	=> $approvalStatus
				];
			}
			return $vendor;
		} else {
			$compare = $this->transferCompareVendor($vendorId, $approvalTrackingId);
			$vendor = $this->find(['v.vendor_id' => '?'], [$vendorId]);

			$this->update([
				'vendor_name'			=> $vendor[0]['vendor_name'],
				'vendor_fedid'			=> $vendor[0]['vendor_fedid'],
				'default_glaccount_id'			=> $vendor[0]['default_glaccount_id'],
				'vendor_type_code'			=> $vendor[0]['vendor_type_code'],
				'vendorclass_id'			=> $vendor[0]['vendorclass_id'],
				'term_id'			=> $vendor[0]['term_id'],
				'vendor_industry_class'			=> $vendor[0]['vendor_industry_class'],
				'minoritygroup_code'			=> $vendor[0]['minoritygroup_code'],
				'vendor_women_flag'			=> $vendor[0]['vendor_women_flag'],
				'vendor_lastupdate_date'			=> $vendor[0]['vendor_lastupdate_date'],
				'vendor_add_reason'			=> $vendor[0]['vendor_add_reason'],
				'vendor_customernum'			=> $vendor[0]['vendor_customernum'],
				'vendor_suppliernum'			=> $vendor[0]['vendor_suppliernum'],
				'vendortype_id'			=> $vendor[0]['vendortype_id'],
				'vendor_active_startdate'			=> $vendor[0]['vendor_active_startdate'],
				'vendor_active_enddate'			=> $vendor[0]['vendor_active_enddate'],
				'vendor_bank_accname'			=> $vendor[0]['vendor_bank_accname'],
				'vendor_bank_accnum'			=> $vendor[0]['vendor_bank_accnum'],
				'vendor_banknum'			=> $vendor[0]['vendor_banknum'],
				'vendor_bank_acctype'			=> $vendor[0]['vendor_bank_acctype'],
				'vendor_auto_calc_interest_flag'			=> $vendor[0]['vendor_auto_calc_interest_flag'],
				'vendor_tax_reporting_name'			=> $vendor[0]['vendor_tax_reporting_name'],
				'vendor_name_control'			=> $vendor[0]['vendor_name_control'],
				'vendor_type1099'			=> $vendor[0]['vendor_type1099'],
				'withholdingstatus_code'			=> $vendor[0]['withholdingstatus_code'],
				'vendor_withhold_startdate'			=> $vendor[0]['vendor_withhold_startdate'],
				'vendor_tax_rounding'			=> $vendor[0]['vendor_tax_rounding'],
				'vendor_tax_calc_flag'			=> $vendor[0]['vendor_tax_calc_flag'],
				'vendor_tax_calc_override'			=> $vendor[0]['vendor_tax_calc_override'],
				'vendor_amt_include_tax_flag'			=> $vendor[0]['vendor_amt_include_tax_flag'],
				'vendor_awt_flag'			=> $vendor[0]['vendor_awt_flag'],
				'vendor_tax_verif_date'			=> $vendor[0]['vendor_tax_verif_date'],
				'vendor_smallbusiness_flag'			=> $vendor[0]['vendor_smallbusiness_flag'],
				'paymentmethod_code'			=> $vendor[0]['paymentmethod_code'],
				'paydatebasis_code'			=> $vendor[0]['paydatebasis_code'],
				'paygroup_code'			=> $vendor[0]['paygroup_code'],
				'vendor_ap_bank_number'			=> $vendor[0]['vendor_ap_bank_number'],
				'vendor_check_digits'			=> $vendor[0]['vendor_check_digits'],
				'vendor_paypriority'			=> $vendor[0]['vendor_paypriority'],
				'vendor_allowunordered_flag'			=> $vendor[0]['vendor_allowunordered_flag'],
				'vendor_match'			=> $vendor[0]['vendor_match'],
				'vendor_holdunmatched_invc_flag'			=> $vendor[0]['vendor_holdunmatched_invc_flag'],
				'vendor_exclusive_payment_flag'			=> $vendor[0]['vendor_exclusive_payment_flag'],
				'vendor_debit_memo_flag'			=> $vendor[0]['vendor_debit_memo_flag'],
				'vendor_paymenthold_flag'			=> $vendor[0]['vendor_paymenthold_flag'],
				'vendor_paymenthold_fut_flag'			=> $vendor[0]['vendor_paymenthold_fut_flag'],
				'vendor_paymenthold_reason'			=> $vendor[0]['vendor_paymenthold_reason'],
				'vendor_invoice_currency'			=> $vendor[0]['vendor_invoice_currency'],
				'vendor_payment_currency'			=> $vendor[0]['vendor_payment_currency'],
				'vendor_allowsub_flag'			=> $vendor[0]['vendor_allowsub_flag'],
				'vendor_termsdatebasis'			=> $vendor[0]['vendor_termsdatebasis'],
				'vendor_minorder'			=> $vendor[0]['vendor_minorder'],
				'vendor_invoice_maxamount'			=> $vendor[0]['vendor_invoice_maxamount'],
				'vendor_purchasehold_flag'			=> $vendor[0]['vendor_purchasehold_flag'],
				'vendor_purchasehold_reason'			=> $vendor[0]['vendor_purchasehold_reason'],
				'vendor_purchasehold_date'			=> $vendor[0]['vendor_purchasehold_date'],
				'vendor_inspectionreq_flag'			=> $vendor[0]['vendor_inspectionreq_flag'],
				'vendor_receiptreq_flag'			=> $vendor[0]['vendor_receiptreq_flag'],
				'vendor_discount_exclude_freight'			=> $vendor[0]['vendor_discount_exclude_freight'],
				'vendor_fed_report_flag'			=> $vendor[0]['vendor_fed_report_flag'],
				'submit_userprofile_id'			=> $vendor[0]['submit_userprofile_id'],
				'default_paymenttype_id'			=> $vendor[0]['default_paymenttype_id'],
				'organization_type_code'			=> $vendor[0]['organization_type_code'],
				'finance_vendor'			=> $vendor[0]['finance_vendor'],
				'default_due_date'			=> $vendor[0]['default_due_date'],
			], ['vendor_id' => '?'], [$approvalTrackingId]);
			if (!$compare && $approvalStatus == 'approved') {
				$approvalStatus = 'active';
			}

			$this->update(['vendor_status' => $approvalStatus], ['vendor_id' => '?'], [$approvalTrackingId]);
			$out_vendor_id = $approvalTrackingId;
			$this->deleteAssignedGlaccounts($approvalTrackingId);

			$insert = new Insert();

			$insert->into('vendorglaccounts')
					->columns(['vendor_id', 'glaccount_id'])
					->values(Select::get()->from(['g' => 'vendorglaccounts'])
										->columns([new Expression('?'), 'glaccount_id'])
										->where(['g.vendor_id' => '?']));

			$result = $this->adapter->query($insert, [$approvalTrackingId, $vendorId]);

			return [
				'vendor_id'			=> $out_vendor_id,
				'approval_status'	=> $approvalStatus
			];

		}
	}

	/**
	 * Assign author
	 *
	 * @param $userprofile_id
	 * @param $tablename
	 * @param $tablekey_id
	 * @param null $delegation_to_userprofile_id
	 */
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

	/**
	 * Retrieve vendors list by vendor_name
	 *
	 * @param $keyword
	 * @return array|bool
	 */
	public function findByKeyword($keyword, $sort = 'vendor_name',$category, $status, $asp_client_id, $integration_package_id,  $pageSize=null, $page=1) {
		$select = new Select();

		$status = !$status ? "'active', 'inactive'" : $status;
		if ($category == 'all') {
			$select->from(['v' => 'vendor'])
						->distinct()
						->join(['vs' => 'vendorsite'], 'vs.vendor_id = v.vendor_id', ['vendorsite_id', 'vendorsite_id_alt'])
						->join(['a' => 'address'], 'a.tablekey_id = vs.vendorsite_id', ['address_line1', 'address_line2', 'address_city', 'address_state', 'address_zip', 'address_zipext'])
						->join(['i' => 'integrationpackage'], 'i.integration_package_id = v.integration_package_id', ['integration_package_name'])
						->join(['f' => 'vendorfavorite'], 'f.vendorsite_id = vs.vendorsite_id', ['vendorfavorite_id, property_id'], Select::JOIN_LEFT)
						->join(['vt' => 'vendortype'], 'vt.vendortype_id = v.vendortype_id', ['vendortype_name'], Select::JOIN_LEFT)
						->join(['c' => 'country'], 'a.address_country = c.country_id', ['country_name'], Select::JOIN_LEFT)
						->where(['a.addresstype_id' => '?'])
						->whereMerge(new VendorSearchCriteria($asp_client_id, $integration_package_id, $status))
						->order($sort);
		}

		if (intval($category) == 1) {

		}
		if ($category == 'favorites') {

		}
		if ($category == 'top20') {

		}
		return $this->getPagingArray($select, [AddressGateway::ADDRESS_TYPE_MAILING, $keyword . '%', $keyword . '%', '%' . $keyword . '%', '%' . $keyword . '%', '%' . $keyword . '%', '%' . $keyword . '%'] , $pageSize, $page, 'vendor_id');
	}

	public function findByKeywordWithTaskType($allowExpInsurance) {
			$select = new Select();
	}

	/**
	 * get vendor
	 *
	 * @param $vendor_id
	 * @return mixed
	 */
	public function getVendor($vendor_id) {
		$select = new Select();

		$select->from(['v' => 'vendor'])
					->join(['vs' => 'vendorsite'], 'vs.vendor_id = v.vendor_id', [
						'vs_vendorsite_id' => 'vendorsite_id',
						'vs_vendorsite_id_alt' => 'vendorsite_id_alt',
						'vs_vendorsite_lastupdate_date' => 'vendorsite_lastupdate_date',
						'vs_vendorsite_code' => 'vendorsite_code',
						'vs_vendorsite_ship_to_location_id' => 'vendorsite_ship_to_location_id',
						'vs_vendorsite_bill_to_location_id' => 'vendorsite_bill_to_location_id',
						'vs_term_id' => 'term_id',
						'vs_bill_contact_id' => 'bill_contact_id',
						'vs_paydatebasis_code' => 'paydatebasis_code',
						'vs_vendorsite_note' => 'vendorsite_note',
						'vs_vendorsite_tax_reporting_flag' => 'vendorsite_tax_reporting_flag',
						'vs_vendorsite_status' => 'vendorsite_status',
						'vs_vendor_universalfield1' => 'vendor_universalfield1',
						'vs_vendorsite_account_number' => 'vendorsite_account_number',
						'vs_vendorsite_display_account_number_po' => 'vendorsite_display_account_number_po',
					])
					->join(['p' => 'phone'], 'p.tablekey_id = vs.vendorsite_id', ['vendorsite_phone_number' => 'phone_number', 'vendorsite_phone_ext' => 'phone_ext', 'vendorsite_phone_id' => 'phone_id'], Select::JOIN_LEFT)
					->join(['f' => 'phone'], 'f.tablekey_id = vs.vendorsite_id', ['vendorsite_fax_phone_number' => 'phone_number', 'vendorsite_fax_id' => 'phone_id'], Select::JOIN_LEFT)
					->join(['a' => 'address'], 'a.tablekey_id = vs.vendorsite_id')
					->join(['c' => 'contact'], 'c.tablekey_id = vs.vendorsite_id', [], Select::JOIN_LEFT)
					->join(['ps' => 'person'], 'ps.person_id = c.person_id')
					->join(['pc' => 'phone'], 'pc.tablekey_id = c.contact_id', ['attention_phone_number' => 'phone_number', 'attention_phone_ext' => 'phone_ext', 'attention_phone_id' => 'phone_id'], Select::JOIN_LEFT)
					->join(['e' => 'email'], 'e.tablekey_id = vs.vendorsite_id', ['email_id', 'email_address'], Select::JOIN_LEFT)
					->where(
								[
									'v.vendor_id' => '?',
									'p.table_name' => '?',
									'p.phonetype_id' => '?',
									'f.table_name'		=> '?',
									'f.phonetype_id'		=> '?',
									'a.table_name'		=> '?',
									'c.table_name'		=> '?',
									'pc.table_name'		=> '?',
									'e.table_name'		=> '?',
									'e.emailtype_id'		=> '?'
								]
					);
		$result = $this->adapter->query($select, [$vendor_id, 'vendorsite', PhoneGateway::PHONE_TYPE_MAIN, 'vendorsite', PhoneGateway::PHONE_TYPE_FAX, 'vendorsite', 'vendorsite', 'contact', 'vendorsite', EmailGateway::EMAIL_TYPE_PRIMARY]);

		return $result[0];
	}

	public function findAssignedGlaccounts($vendor_id) {
		$select = new Select();

		$select->from(['vg' => 'vendorglaccounts'])
						->columns(['glaccount_id'])
						->where(['vg.vendor_id' => '?']);

		$result = $this->adapter->query($select, [$vendor_id]);

		$glaccounts = [];
		if (count($result) > 0) {
			foreach ($result as $item) {
				$glaccounts[] = $item['glaccount_id'];
			}
		}

		return implode(',', $glaccounts);
	}

	/**
	 * delete vendor messages
	 *
	 * @param $vendor_id
	 * @return array|bool
	 */
	public function deleteMessages($vendor_id) {
		$delete = new Delete();

		$delete->from('messages')
				->where(['table_name' => '?', 'tablekey_id' => '?']);

		return $this->adapter->query($delete, ['vendor', $vendor_id]);
	}

	public function transferCompareVendor($vendor_id, $approval_tracking_id) {

		$compare = false;

		$select = new Select();

//		find by vendor_id
		$select->from(['v' => 'vendor'])
				->columns([
					'vendor_id_alt' => new Expression("ISNULL(v.vendor_id_alt, '')"),
					'vendor_name' => new Expression("ISNULL(v.vendor_name, '')"),
					'vendor_fedid' => new Expression("ISNULL(v.vendor_fedid, '')"),
					'vendor_tax_reporting_name' => new Expression("ISNULL(v.vendor_tax_reporting_name, '')"),
					'vendor_type_code' => new Expression("ISNULL(v.vendor_type_code, '')"),
					'paygroup_code' => new Expression("ISNULL(v.paygroup_code, '')"),
					'vendor_paypriority' => new Expression("ISNULL(v.vendor_paypriority, '')"),
					'vendor_type1099' => new Expression("ISNULL(v.vendor_type1099, '')"),
					'Vendor_Active_StartDate' => new Expression("ISNULL(v.Vendor_Active_StartDate, '')"),
					'Vendor_Active_EndDate' => new Expression("ISNULL(v.Vendor_Active_EndDate, '')"),
					'vendor_termsdatebasis' => new Expression("ISNULL(v.vendor_termsdatebasis, '')"),
					'paydatebasis_code' => new Expression("ISNULL(v.paydatebasis_code, '')"),
					'person_firstname' => new Expression("ISNULL(p.person_firstname,'')"),
					'person_lastname' => new Expression("ISNULL(p.person_lastname,'')"),
					'person_phone' => new Expression("REPLACE(REPLACE(REPLACE(REPLACE(ISNULL(ph.phone_number,''), '(', ''), ')', ''), '-', ''), ' ', '')"),
					'vendor_phone' => new Expression("REPLACE(REPLACE(REPLACE(REPLACE(ISNULL(vp.phone_number,''), '(', ''), ')', ''), '-', ''), ' ', '')"),
					'fax' => new Expression("REPLACE(REPLACE(REPLACE(REPLACE(ISNULL(f.phone_number,''), '(', ''), ')', ''), '-', ''), ' ', '')"),
					'address_line1' => new Expression("ISNULL(a.address_line1,'')"),
					'address_line2' => new Expression("ISNULL(a.address_line2,'')"),
					'address_city' => new Expression("ISNULL(a.address_city,'')"),
					'address_state' => new Expression("ISNULL(a.address_state,'')"),
					'address_zip' => new Expression("ISNULL(a.address_zip,'')"),
					'address_zipext' => new Expression("ISNULL(a.address_zipext,'')")
				])
				->join(['vs' => 'vendorsite'], 'vs.vendor_id = v.vendor_id', [])
				->join(['c' => 'contact'], 'c.tablekey_id = vs.vendorsite_id and c.table_name=\'vendorsite\'', [], Select::JOIN_LEFT)
				->join(['p' => 'person'], 'p.person_id = c.person_id', [], Select::JOIN_LEFT)
				->join(['ph' => 'phone'], 'ph.tablekey_id = c.contact_id and ph.table_name = \'contact\' and ph.phonetype_id = ' . PhoneGateway::PHONE_TYPE_MAIN, [], Select::JOIN_LEFT)
				->join(['vp' => 'phone'], 'vp.table_name=\'vendorsite\' and vp.tablekey_id =vs.vendorsite_id and vp.phonetype_id = ' . PhoneGateway::PHONE_TYPE_MAIN, [], Select::JOIN_LEFT)
				->join(['f' => 'phone'], 'f.table_name = \'vendorsite\' and f.tablekey_id = vs.vendorsite_id and f.phonetype_id = ' . PhoneGateway::PHONE_TYPE_FAX, [], Select::JOIN_LEFT)
				->join(['a' => 'address'], 'a.tablekey_id = vs.vendorsite_id and a.table_name = \'vendorsite\'', [], Select::JOIN_LEFT)
				->where([
					'v.vendor_id' => '?',
					'vs.vendorsite_status' => '?'
				]);

		$vendor_a = $this->adapter->query($select, [$vendor_id, 'active']);

		$select = new Select();
		$select->from(['v' => 'vendor'])
			->columns([
				'vendor_id_alt' => new Expression("ISNULL(v.vendor_id_alt, '')"),
				'vendor_name' => new Expression("ISNULL(v.vendor_name, '')"),
				'vendor_fedid' => new Expression("ISNULL(v.vendor_fedid, '')"),
				'vendor_tax_reporting_name' => new Expression("ISNULL(v.vendor_tax_reporting_name, '')"),
				'vendor_type_code' => new Expression("ISNULL(v.vendor_type_code, '')"),
				'paygroup_code' => new Expression("ISNULL(v.paygroup_code, '')"),
				'vendor_paypriority' => new Expression("ISNULL(v.vendor_paypriority, '')"),
				'vendor_type1099' => new Expression("ISNULL(v.vendor_type1099, '')"),
				'Vendor_Active_StartDate' => new Expression("ISNULL(v.Vendor_Active_StartDate, '')"),
				'Vendor_Active_EndDate' => new Expression("ISNULL(v.Vendor_Active_EndDate, '')"),
				'vendor_termsdatebasis' => new Expression("ISNULL(v.vendor_termsdatebasis, '')"),
				'paydatebasis_code' => new Expression("ISNULL(v.paydatebasis_code, '')"),
				'person_firstname' => new Expression("ISNULL(p.person_firstname,'')"),
				'person_lastname' => new Expression("ISNULL(p.person_lastname,'')"),
				'person_phone' => new Expression("REPLACE(REPLACE(REPLACE(REPLACE(ISNULL(ph.phone_number,''), '(', ''), ')', ''), '-', ''), ' ', '')"),
				'vendor_phone' => new Expression("REPLACE(REPLACE(REPLACE(REPLACE(ISNULL(vp.phone_number,''), '(', ''), ')', ''), '-', ''), ' ', '')"),
				'fax' => new Expression("REPLACE(REPLACE(REPLACE(REPLACE(ISNULL(f.phone_number,''), '(', ''), ')', ''), '-', ''), ' ', '')"),
				'address_line1' => new Expression("ISNULL(a.address_line1,'')"),
				'address_line2' => new Expression("ISNULL(a.address_line2,'')"),
				'address_city' => new Expression("ISNULL(a.address_city,'')"),
				'address_state' => new Expression("ISNULL(a.address_state,'')"),
				'address_zip' => new Expression("ISNULL(a.address_zip,'')"),
				'address_zipext' => new Expression("ISNULL(a.address_zipext,'')")
			])
			->join(['vs' => 'vendorsite'], 'vs.vendor_id = v.vendor_id', [])
			->join(['c' => 'contact'], 'c.tablekey_id = vs.vendorsite_id and c.table_name=\'vendorsite\'', [], Select::JOIN_LEFT)
			->join(['p' => 'person'], 'p.person_id = c.person_id', [], Select::JOIN_LEFT)
			->join(['ph' => 'phone'], 'ph.tablekey_id = c.contact_id and ph.table_name = \'contact\' and ph.phonetype_id = ' . PhoneGateway::PHONE_TYPE_MAIN, [], Select::JOIN_LEFT)
			->join(['vp' => 'phone'], 'vp.table_name=\'vendorsite\' and vp.tablekey_id =vs.vendorsite_id and vp.phonetype_id = ' . PhoneGateway::PHONE_TYPE_MAIN, [], Select::JOIN_LEFT)
			->join(['f' => 'phone'], 'f.table_name = \'vendorsite\' and f.tablekey_id = vs.vendorsite_id and f.phonetype_id = ' . PhoneGateway::PHONE_TYPE_FAX, [], Select::JOIN_LEFT)
			->join(['a' => 'address'], 'a.tablekey_id = vs.vendorsite_id and a.table_name = \'vendorsite\'', [], Select::JOIN_LEFT)
			->where([
				'v.vendor_id' => '?',
				'vs.vendorsite_status' => '?'
			]);

		$vendor_b = $this->adapter->query($select, [$approval_tracking_id, 'forapproval']);


		if (!$vendor_a || !$vendor_b) {
			return false;
		}

		foreach ($vendor_a[0] as $key => $value) {
			if ($vendor_a[0][$key] !== $vendor_b[0][$key]) {
				return true;
			}
		}


		return $compare;
	}

	/**
	 * Delete glaccounts
	 *
	 * @param $vendor_id
	 * @return array|bool
	 */
	public function deleteAssignedGlaccounts($vendor_id) {
		$delete = new Delete();

		$delete->from('vendorglaccounts')
				->where(['vendor_id' => '?']);

		return $this->adapter->query($delete, [$vendor_id]);
	}

	/**
	 * Find vendorsite id
	 *
	 * @param $vendor_id
	 * @param $status
	 * @param $asp_client_id
	 * @return null
	 */
	public function findLocalVendorsiteId($vendor_id, $status, $asp_client_id) {
		$select = new Select();

		$select->from(['vo' => 'vendor'])
			->columns([])
			->join(['v' => 'vendor'], 'vo.vendor_id = v.approval_tracking_id', [], Select::JOIN_INNER)
			->join(['vs' => 'vendorsite'], null, ['vendorsite_id'], Select::JOIN_CROSS)
			->join(['vso' => 'vendorsite'], 'vs.approval_tracking_id = vso.vendorsite_id and vo.vendor_id = vso.vendor_id', [], Select::JOIN_INNER)
			->join(['i' => 'integrationpackage'], ' i.integration_package_id = v.integration_package_id', [], Select::JOIN_INNER)
			->where([
				'v.vendor_id'	=> '?',
				'vs.vendorsite_status'	=> '?',
				'i.asp_client_id'		=> '?'
			]);

		$local_vendorsite_id = $this->adapter->query($select, [$vendor_id, $status, $asp_client_id]);

		if (!isset($local_vendorsite_id[0]['vendorsite_id'])) {
			return null;
		}

		return $local_vendorsite_id[0]['vendorsite_id'];
	}

	/**
	 * Retrieve vendortype id
	 *
	 * @param $vendortype_code
	 * @param $integrationPackage_id
	 * @return mixed
	 */
	public function findVendortypeByCodeAndIntegrationPackageId($vendortype_code, $integrationPackage_id) {
		$select = new Select();

		$select->from(['vt' => 'vendortype'])
				->where(
					[
						'vt.vendortype_code' => '?',
						'vt.integration_package_id' => '?'
					])
				->columns(['vendortype_id']);

		$retult = $this->adapter->query($select, [$vendortype_code, $integrationPackage_id]);

		return $retult[0]['vendortype_id'];
	}
}

?>