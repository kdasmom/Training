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
use NP\core\db\Update;
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

	public function findVendorsite($vendor_id) {
		return $this->findValue(
			['v.vendor_id' => '?'],
			[$vendor_id],
			['vendorsite_id' => new \NP\core\db\Expression('vs.vendorsite_id')]
		);
	}

	/**
	 * Get vendors that will show up as available options for an invoice
	 */
	public function findVendorsForInvoice($property_id, $vendor_id=null, $keyword=null) {
		$now = \NP\util\Util::formatDateForDB();

		$select = $this->getSelect()
						->columns(['vendor_id','vendor_id_alt','vendor_name','remit_req','default_glaccount_id'])
						->join(new sql\join\VendorsiteAddressJoin())
						->join(new sql\join\VendorsitePhoneJoin('Main'))
						->join(new sql\join\VendorGlAccountJoin());

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
			$select->count(true, 'totalRecs', 'v.vendor_id');
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
			return $this->getPagingArray($select, array(), $pageSize, $page, 'v.vendor_id');
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
	 * @return array|bool
	 */
	public function findByStatus($pageSize = null, $page = null, $status = 'forapproval', $order = 'PersonName', $keyword=null) {
		$selectvendor = new sql\VendorSelect();


		if ($status == 'Pending') {
			$status = 'forapproval';
		}

		$status = strtolower($status);
		$params = [];
		$selectvendor->columns(['vendor_id', 'vendor_id_alt', 'vendor_name', 'vendor_status'])
		  			->columnsPersonName()
					->columnSentForApprovalDate()
					->columnApprovalType()
					->join(new sql\join\VendorVendorsiteJoin([]))
					->join(['i' => 'integrationpackage'], 'v.integration_package_id = i.integration_package_id', ['integration_package_name'])
					->order($order);

		if ($pageSize !== null) {
			$selectvendor->limit($pageSize);
			if ($page !== null) {
				$selectvendor->offset($pageSize * ($page - 1));
			}
		}

		if ($keyword !== null) {
			$keyword .= '%';
			$selectvendor->whereNest('OR')
							->whereLike('v.vendor_name', '?')
							->whereLike('v.vendor_id_alt', '?')
						->whereUnnest();

			array_push($params, $keyword, $keyword);
		}

		if ($status !== null) {
			if (!is_array($status)) {
				$status = explode(',', $status);
			}

			$selectvendor->whereNest('OR');
			foreach ($status as $val) {
				$selectvendor->whereNest('AND')
								->whereEquals('v.vendor_status', '?')
								->whereEquals('vs.vendorsite_status', '?')
							->whereUnnest();

				array_push($params, $val, $val);
			}
			$selectvendor->whereUnnest();
		}

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
	public function findVendorTypes($intergration_package_id) {
		$select = new Select();

		$select->from(['vt' => 'vendortype'])
				->where(['integration_package_id' => '?'])
				->whereGreaterThan('universal_field_status', 0)
				->order('vt.vendortype_name');

		return $this->adapter->query($select, [$intergration_package_id]);
	}

	public function findTopVendors($numberOfVendors=5) {
		$date = new \DateTime();
		$date->add(\DateInterval::createFromDateString('-1 year'));
		$date = Util::formatDateForDB($date);

		$select = Select::get()
    		->columns([
    			'vendor_id',
    			'vendor_id_alt',
    			'vendor_name',
    			'total_amount' => new Expression('SUM(ii.invoiceitem_amount + ii.invoiceitem_shipping + ii.invoiceitem_salestax)')
    		])
    		->from(['v'=>'vendor'])
    			->join(new sql\join\VendorVendorsiteJoin([]))
    			->join(new sql\join\VendorsiteInvoiceJoin())
    			->join(new \NP\invoice\sql\join\InvoiceInvoiceItemJoin())
    		->whereEquals('v.vendor_status', "'active'")
    		->whereEquals('vs.vendorsite_status', "'active'")
    		->whereGreaterThan('i.invoice_datetm', '?')
    		->group('v.vendor_id, v.vendor_id_alt, v.vendor_name')
    		->order('total_amount DESC')
    		->limit($numberOfVendors);

    	return $this->adapter->query($select, [$date]);
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
	public function checkVendorName($useVendorName, $vendorName, $approvalTrackingId, $integrationPackageId, $aspClientId) {
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
	public function checkByVendorFedId($useVendorFedId, $vendorFedId, $approvalTrackingId, $integrationPackageId, $aspClientId) {
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
	public function checkByVendorAlt($useVendorIdAlt, $vendorIdAlt, $approvalTrackingId, $integrationPackageId, $aspClientId) {
		$vendorId = null;
		$vendorName = '';
		$checkStatus = 'OK';
		if ($useVendorIdAlt == 1) {
			$select = new Select();

			$select->from(['v' => 'vendor'])
				->columns(['vendor_id', 'vendor_name'])
				->join(['i' => 'integrationpackage'], 'i.integration_package_id = v.integration_package_id', [])
				->where(new sql\criteria\VendorExistsCriteria($approvalTrackingId))
				->whereEquals('rtrim(v.vendor_id_alt)', 'rtrim(?)');

			if (!$approvalTrackingId) {
				$result = $this->adapter->query($select, ['rejected', $integrationPackageId, $aspClientId, $vendorIdAlt]);
			} else {
				$result = $this->adapter->query($select, [$approvalTrackingId, 'rejected', $integrationPackageId, $aspClientId, $vendorIdAlt]);
			}

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


	/**
	 * Approve vendor
	 *
	 * @param null $aspClientId
	 * @param null $userProfileId
	 * @param $vendorId
	 * @param $approvalTrackingId
	 * @param $approvalStatus
	 * @return array
	 */
	public function approveVendor($aspClientId = null, $vendorId, $approvalTrackingId, $approvalStatus) {

		if ($approvalTrackingId === $vendorId) {
			$result = $this->update(
				['vendor_status' => $approvalStatus],
				['vendor_id'	=> '?'],
				[$vendorId]
			);
			if (!$result) {
				return [
					'success'	=> false,
					'errors'	=> ['field'=>'global', 'msg'=>'Can\'t update vendor', 'extra'=>null]
				];
			}
			$out_vendor_id = $vendorId;
		} else {
			$compare = $this->transferCompareVendor($vendorId, $approvalTrackingId);
			$select = new Select();
			$select->from(['v' => 'vendor'])
					->join(['i' => 'integrationpackage'], 'i.integration_package_id = VENDOR.integration_package_id', [])
					->where([
						'v.vendor_id' 		=> '?',
						'i.asp_client_id'	=> '?'
				]);
			$result = $this->adapter->query($select, [$vendorId, $aspClientId]);

			$this->update([
				'vendor_name'						=> $result[0]['vendor_name'],
				'vendor_fedid'						=> $result[0]['vendor_fedid'],
				'default_glaccount_id'				=> $result[0]['default_glaccount_id'],
				'vendor_type_code'					=> $result[0]['vendor_type_code'],
				'vendorclass_id'					=> $result[0]['vendorclass_id'],
				'term_id'							=> $result[0]['term_id'],
				'vendor_industry_class'				=> $result[0]['vendor_industry_class'],
				'minoritygroup_code'					=> $result[0]['minoritygroup_code'],
				'vendor_women_flag'					=> $result[0]['vendor_women_flag'],
				'vendor_lastupdate_date'			=> $result[0]['vendor_lastupdate_date'],
				'vendor_add_reason'					=> $result[0]['vendor_add_reason'],
				'vendor_customernum'					=> $result[0]['vendor_customernum'],
				'vendor_suppliernum'					=> $result[0]['vendor_suppliernum'],
				'vendortype_id'						=> $result[0]['vendortype_id'],
				'vendor_active_startdate'			=> $result[0]['vendor_active_startdate'],
				'vendor_active_enddate'				=> $result[0]['vendor_active_enddate'],
				'vendor_bank_accname'				=> $result[0]['vendor_bank_accname'],
				'vendor_bank_accnum'					=> $result[0]['vendor_bank_accnum'],
				'vendor_banknum'						=> $result[0]['vendor_banknum'],
				'vendor_bank_acctype'				=> $result[0]['vendor_bank_acctype'],
				'vendor_auto_calc_interest_flag'	=> $result[0]['vendor_auto_calc_interest_flag'],
				'vendor_tax_reporting_name'			=> $result[0]['vendor_tax_reporting_name'],
				'vendor_name_control'				=> $result[0]['vendor_name_control'],
				'vendor_type1099'					=> $result[0]['vendor_type1099'],
				'withholdingstatus_code'			=> $result[0]['withholdingstatus_code'],
				'vendor_withhold_startdate'			=> $result[0]['vendor_withhold_startdate'],
				'vendor_tax_rounding'				=> $result[0]['vendor_tax_rounding'],
				'vendor_tax_calc_flag'				=> $result[0]['vendor_tax_calc_flag'],
				'vendor_tax_calc_override'			=> $result[0]['vendor_tax_calc_override'],
				'vendor_amt_include_tax_flag'		=> $result[0]['vendor_amt_include_tax_flag'],
				'vendor_awt_flag'					=> $result[0]['vendor_awt_flag'],
				'vendor_tax_verif_date'				=> $result[0]['vendor_tax_verif_date'],
				'vendor_smallbusiness_flag'			=> $result[0]['vendor_smallbusiness_flag'],
				'paymentmethod_code'					=> $result[0]['paymentmethod_code'],
				'paydatebasis_code'					=> $result[0]['paydatebasis_code'],
				'paygroup_code'						=> $result[0]['paygroup_code'],
				'vendor_ap_bank_number'				=> $result[0]['vendor_ap_bank_number'],
				'vendor_check_digits'				=> $result[0]['vendor_check_digits'],
				'vendor_paypriority'				=> $result[0]['vendor_paypriority'],
				'vendor_allowunordered_flag'		=> $result[0]['vendor_allowunordered_flag'],
				'vendor_match'						=> $result[0]['vendor_match'],
				'vendor_holdunmatched_invc_flag'		=> $result[0]['vendor_holdunmatched_invc_flag'],
				'vendor_exclusive_payment_flag'		=> $result[0]['vendor_exclusive_payment_flag'],
				'vendor_debit_memo_flag'				=> $result[0]['vendor_debit_memo_flag'],
				'vendor_paymenthold_flag'			=> $result[0]['vendor_paymenthold_flag'],
				'vendor_paymenthold_fut_flag'		=> $result[0]['vendor_paymenthold_fut_flag'],
				'vendor_paymenthold_reason'			=> $result[0]['vendor_paymenthold_reason'],
				'vendor_invoice_currency'			=> $result[0]['vendor_invoice_currency'],
				'vendor_payment_currency'			=> $result[0]['vendor_payment_currency'],
				'vendor_allowsub_flag'				=> $result[0]['vendor_allowsub_flag'],
				'vendor_termsdatebasis'				=> $result[0]['vendor_termsdatebasis'],
				'vendor_minorder'					=> $result[0]['vendor_minorder'],
				'vendor_invoice_maxamount'			=> $result[0]['vendor_invoice_maxamount'],
				'vendor_purchasehold_flag'			=> $result[0]['vendor_purchasehold_flag'],
				'vendor_purchasehold_reason'		=> $result[0]['vendor_purchasehold_reason'],
				'vendor_purchasehold_date'			=> $result[0]['vendor_purchasehold_date'],
				'vendor_inspectionreq_flag'			=> $result[0]['vendor_inspectionreq_flag'],
				'vendor_receiptreq_flag'			=> $result[0]['vendor_receiptreq_flag'],
				'vendor_discount_exclude_freight'	=> $result[0]['vendor_discount_exclude_freight'],
				'vendor_fed_report_flag'			=> $result[0]['vendor_fed_report_flag'],
				'submit_userprofile_id'				=> $result[0]['submit_userprofile_id'],
				'default_paymenttype_id'				=> $result[0]['default_paymenttype_id'],
				'organization_type_code'			=> $result[0]['organization_type_code'],
				'finance_vendor'					=> $result[0]['finance_vendor'],
				'default_due_date'					=> $result[0]['default_due_date'],
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
		}

//		local_vendorsite_id
		$localvendorsite_id = $this->findLocalVendorsiteId($vendorId, 'forapproval', $aspClientId);
		if (is_null($localvendorsite_id)) {
			$localvendorsite_id = $this->findLocalVendorsiteId($vendorId, 'active', $aspClientId);
		}

		return [
			'out_vendor_id'			=> $out_vendor_id,
			'local_vendorsite_id'	=> $localvendorsite_id
		];
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
			$insert = new Insert();

			$insert->into('recauthor')
					->columns(['userprofile_id', 'delegation_to_userprofile_id', 'table_name', 'tablekey_id', 'recauthor_datetm'])
					->values(Select::get()->columns([new Expression('?'), new Expression('?'), new Expression('?'), new Expression('?'), new Expression('GetDate()')]));

			$this->adapter->query($insert, [$userprofile_id, $delegation_to_userprofile_id, $tablename, $tablekey_id]);
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
		return $this->getPagingArray($select, [AddressGateway::ADDRESS_TYPE_MAILING, $keyword . '%', $keyword . '%', '%' . $keyword . '%', '%' . $keyword . '%', '%' . $keyword . '%', '%' . $keyword . '%'] , $pageSize, $page, 'v.vendor_id');
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
					->join(['a' => 'address'], 'a.tablekey_id = vs.vendorsite_id', ['address_id', 'addresstype_id', 'tablekey_id', 'table_name', 'address_attn', 'address_company', 'address_line1', 'address_line2', 'address_line3', 'address_city', 'address_state', 'address_zip', 'address_zipext', 'address_country', 'address_id_alt'], Select::JOIN_LEFT)
					->join(['c' => 'contact'], 'c.tablekey_id = vs.vendorsite_id', [], Select::JOIN_LEFT)
					->join(['ps' => 'person'], 'ps.person_id = c.person_id', ['person_id','asp_client_id', 'person_title', 'person_firstname', 'person_middlename', 'person_lastname', 'person_suffix', 'person_ssn', 'person_gender', 'person_birthdate', 'personmarital_id', 'person_passport_no'], Select::JOIN_LEFT)
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

	/**
	 * Vendor transfer compare
	 *
	 * @param $vendor_id
	 * @param $approval_tracking_id
	 * @return bool
	 */
	public function transferCompareVendor($vendor_id, $approval_tracking_id = null, $compareData = null) {

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
					'address_zipext' => new Expression("ISNULL(a.address_zipext,'')"),
					'address_country' => new Expression("ISNULL(a.address_country,'')")
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

		if (!$compareData) {

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
					'address_zipext' => new Expression("ISNULL(a.address_zipext,'')"),
					'address_country' => new Expression("ISNULL(a.address_country,'')")
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
				return true;
			}

			foreach ($vendor_a[0] as $key => $value) {
				if ($vendor_a[0][$key] !== $vendor_b[0][$key]) {
					return false;
				}
			}
		} else {
			if (!$vendor_a) {
				return true;
			}
			if (
				$vendor_a[0]['vendor_phone'] !== $compareData['phone_number'] ||
				$vendor_a[0]['fax'] !== $compareData['fax_number'] ||
				$vendor_a[0]['address_line1'] !== $compareData['address_line1'] ||
				$vendor_a[0]['address_line2'] !== $compareData['address_line2'] ||
				$vendor_a[0]['address_city'] !== $compareData['address_city'] ||
				$vendor_a[0]['address_state'] !== $compareData['address_state'] ||
				$vendor_a[0]['address_zip'] !== $compareData['address_zip'] ||
				$vendor_a[0]['address_zipext'] !== $compareData['address_zipext'] ||
				$vendor_a[0]['address_country'] !== $compareData['address_country'] ||
				$vendor_a[0]['person_firstname'] !== $compareData['person_firstname'] ||
				$vendor_a[0]['person_lastname'] !== $compareData['person_lastname'] ||
				$vendor_a[0]['person_phone'] !== $compareData['person_phone']
				){
				return false;
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
			->join(['vs' => 'vendorsite'], 'vs.vendor_id = v.vendor_id', ['vendorsite_id'])
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

	/**
	 * Check dependencies before delete
	 *
	 * @param $vendor_id
	 * @return bool
	 */
	public function isReadyToDeleteVendor($vendor_id) {
//		check dependings
//		penging edits
		$select = new Select();
		$select->from(['v' => 'vendor'])
				->count(true, 'reccount')
				->where(['approval_tracking_id' => '?'])
				->whereNotEquals('vendor_id', $vendor_id);

		$result = $this->adapter->query($select, [$vendor_id]);

		if ($result[0]['reccount'] > 0) {
			return false;
		}
//		invoices
		$select = new Select();
		$select->from(['i' => 'invoice'])
				->count(true, 'icount')
				->join(['vs'	=> 'vendorsite'], 'vs.vendorsite_id = i.paytablekey_id', [])
				->join(['v' => 'vendor'], 'v.vendor_id = vs.vendor_id', [])
				->where([
						'i.paytable_name'	=> '?',
						'v.vendor_id'		=> '?'
				]);
		$result = $this->adapter->query($select, ['vendorsite', $vendor_id]);

		if ($result[0]['reccount'] > 0) {
			return false;
		}

//		po
		$select = new Select();
		$select->from(['po' => 'purchaseorder'])
				->count(true, 'pocount')
				->join(['vs'	=> 'vendorsite'], 'vs.vendorsite_id = po.vendorsite_id', [])
				->join(['v' => 'vendor'], 'v.vendor_id = vs.vendor_id', [])
				->where([
					'v.vendor_id'		=> '?'
				]);
		$result = $this->adapter->query($select, [$vendor_id]);

		if ($result[0]['reccount'] > 0) {
			return false;
		}

//		vef
		$select = new Select();
		$select->from(['vef' => 'vendorest'])
					->count(true, 'vefcount')
					->join(['vs' => 'vendorsite'], 'vs.vendorsite_id = vef.vendorsite_id', [])
					->join(['v' => 'vendor'], 'v.vendor_id = vs.vendor_id', [])
					->where([
						'v.vendor_id'		=> '?'
					]);

		if ($result[0]['reccount'] > 0) {
			return false;
		}

		return true;
	}

	/**
	 * Delete vendor category by vendor_id
	 *
	 * @param int $vendor_id
	 * @return array|bool
	 */
	public function deleteVendorCategory($vendor_id) {
		$delete = new Delete();

		$delete->from('vendorcategory')
				->where(['vendor_id' => '?']);

		return $this->adapter->query($delete, [$vendor_id]);
	}

	/**
	 * Vendor reject
	 *
	 * @param $vendor_id
	 * @param $vendor_note
	 * @param $userprofile_id
	 */
	public function vendorReject($vendor_id, $vendor_note, $userprofile_id) {
		$select = new Select();

		$select->from(['v' => 'vendor'])
				->join(['vt' => 'vendortype'], 'v.vendor_type_code = vt.vendortype_code', [])
				->columns(['approval_tracking_id'])
				->where(['v.vendor_id' => '?']);

		$result = $this->adapter->query($select, [$vendor_id]);

		$old_vendor_id = $result[0]['approval_tracking_id'];

		$update = new Update();
		$update->table('vendor')
				->values([
					'vendor_status'		=> '?',
					'vendor_reject_note'	=> '?',
					'vendor_reject_dt'		=> '?',
					'vendor_reject_userprofile_id'	=> '?'
				])
				->where(['vendor_id'	=> '?']);

		$this->adapter->query($update, ['rejected', $vendor_note, Util::formatDateForDB(new \DateTime()), $userprofile_id, $old_vendor_id]);
	}

	/**
	 * Retrieve recauthor id
	 *
	 * @param $vendor_id
	 * @return mixed
	 */
	public function getRecauthor($vendor_id) {
		$result = $this->find(['vendor_id' => '?'], [$vendor_id], null, ['approval_tracking_id', 'vendor_status']);

		return $result[0];
	}

	/**
	 * Retrieve vendortype code by vendortype_id
	 *
	 * @param $vendortype_id
	 * @return mixed
	 */
	public function findVendorTypeById($vendortype_id) {
		$select = new Select();

		$select->from('vendortype')
				->columns(['vendortype_code'])
				->where(['vendortype_id' => '?']);

		$result = $this->adapter->query($select, [$vendortype_id]);

		return $result[0]['vendortype_code'];
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
}

?>