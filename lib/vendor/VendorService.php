<?php

namespace NP\vendor;

use NP\contact\AddressEntity;
use NP\contact\AddressGateway;
use NP\contact\ContactEntity;
use NP\contact\ContactGateway;
use NP\contact\EmailGateway;
use NP\contact\PersonGateway;
use NP\contact\EmailEntity;
use NP\contact\PersonEntity;
use NP\contact\PhoneEntity;
use NP\contact\PhoneGateway;
use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\invoice\InvoiceGateway;
use NP\system\ConfigService;
use NP\system\IntegrationPackageGateway;
use NP\user\UserprofileGateway;
use NP\util\Util;

/**
 * Service class for operations related to vendors
 *
 * @author Thomas Messier
 */
class VendorService extends AbstractService {

	const VALIDATE_CHECK_STATUS_OK = 'OK';
	const VALIDATE_CHECK_STATUS_NAME = 'name';
	const VALIDATE_CHECK_STATUS_TAX_ID = 'taxid';
	const VALIDATE_CHECK_STATUS_ID_ALT = 'idalt';
	const VENDORSITE_FAVORITE_NO = 'N';
	const VENDORSITE_FAVORITE_YES = 'Y';
	const VENDOR_STATUS_APPROVED = 'approved';
	const VENDOR_STATUS_REJECTED = 'rejected';

	protected $vendorGateway, $insuranceGateway, $configService, $userprofileGateway, $vendorsiteGateway, $phoneGateway, $addressGateway, $personGateway, $contactGateway, $emailGateway, $integrationPackageGateway;
	
	public function __construct(VendorGateway $vendorGateway,
														InsuranceGateway $insuranceGateway,
														ConfigService $configService,
														UserprofileGateway $userprofileGateway,
														VendorsiteGateway $vendorsiteGateway,
														PhoneGateway $phoneGateway,
														AddressGateway $addressGateway,
														PersonGateway $personGateway,
														ContactGateway $contactGateway,
														EmailGateway $emailGateway,
														IntegrationPackageGateway $integrationPackageGateway) {
		$this->vendorGateway    = $vendorGateway;
		$this->insuranceGateway = $insuranceGateway;
		$this->configService = $configService;
		$this->userprofileGateway = $userprofileGateway;
		$this->vendorsiteGateway = $vendorsiteGateway;
		$this->phoneGateway = $phoneGateway;
		$this->addressGateway = $addressGateway;
		$this->personGateway = $personGateway;
		$this->contactGateway = $contactGateway;
		$this->emailGateway = $emailGateway;
		$this->integrationPackageGateway = $integrationPackageGateway;
	}
	
	/**
	 * Retrieves vendor records for the vendor autocomplete when creating catalogs
	 *
	 * @param  string $keyword Keyword to use to search for a vendor
	 * @return array           Array of vendor records
	 */
	public function getForCatalogDropDown($keyword) {
		return $this->vendorGateway->getForCatalogDropDown($keyword);
	}
	
	/**
	 * Retrieves vendor records by integration package, 
	 *
	 * @param  int          $integration_package_id
	 * @param  string|array $vendor_status          Vendor status or array of statuses
	 * @param  string       $keyword                Keyword to use to search for a vendor
	 * @return array                          Array of vendor records
	 */
	public function getByIntegrationPackage($integration_package_id, $vendor_status=null, $keyword=null) {
		if (is_numeric($integration_package_id)) {
			$wheres = array(array('integration_package_id' => '?'));
			$params = array($integration_package_id);

			if ($vendor_status !== null) {
				$wheres[] = new sql\criteria\VendorStatusCriteria($vendor_status, 'IN');
				if (!is_array($vendor_status)) {
					$vendor_status = array($vendor_status);
				}
				foreach ($vendor_status as $vendor_status_val) {
					$params[] = $vendor_status_val;
				}
			}		

			if ($keyword !== null) {
				$wheres[] = new sql\criteria\VendorKeywordCriteria();
				$keyword = $keyword . '%';
				$params[] = $keyword;
				$params[] = $keyword;
			}

			return $this->vendorGateway->find(
				\NP\core\db\Where::buildCriteria($wheres),
				$params,
				'vendor_name',
				array('vendor_id','vendor_id_alt','vendor_name')
			);
		} else {
			return array();
		}
	}

	/**
	 * Retrieves vendor records matching a specified tax ID. A tax ID can be provided, otherwise a vendor ID can
	 * be provided and all vendors with the same tax ID as the specified vendor will be returned.
	 *
	 * @param  string [$vendor_fedid] Tax ID to search for
	 * @param  int    [$vendor_id]    ID for the vendor who's tax ID you want to find matching vendors for
	 * @return array                  Array of vendor records
	 */
	public function getByTaxId($vendor_fedid=null, $vendor_id=null) {
		if ($vendor_fedid === null) {
			$rec = $this->vendorGateway->findById($vendor_id, array('vendor_fedid'));
			$vendor_fedid = $rec['vendor_fedid'];
		}

		return $this->vendorGateway->find(
			array('vendor_fedid'=>'?'),
			array($vendor_fedid),
			'vendor_name ASC',
			array('vendor_id','vendor_id_alt','vendor_name')
		);
	}

	/**
	 * Get list of vendors to approve
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of vendor records
	 */
	public function getVendorsToApprove($countOnly, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->vendorGateway->findVendorsToApprove($countOnly, $pageSize, $page, $sort);
	}

	/**
	 * Get list of vendors to approve
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of vendor records
	 */
	public function getExpiredInsuranceCerts($countOnly, $pageSize=null, $page=null, $sort="insurance_expdatetm") {
		return $this->insuranceGateway->findExpiredInsuranceCerts($countOnly, $pageSize, $page, $sort);
	}

	/**
	 * find vendors by status
	 *
	 * @param null $pageSize
	 * @param null $page
	 * @param string $status
	 * @param string $sort
	 * @return array|bool
	 */
	public function findByStatus($pageSize = null, $page = null, $status = 'pending', $sort = 'PersonName') {
		$aspClientId = $this->configService->getClientId();

		return $this->vendorGateway->findByStatus($pageSize, $page, $status, $sort, $aspClientId);
	}

	/**
	 * Retrieve vendor's types records list
	 *
	 * @return array|bool
	 */
	public function findVendorTypes() {
		return $this->vendorGateway->findVendorTypes();
	}

	/**
	 * Save vendor
	 *
	 * @param $data
	 */
	public function saveVendor($data) {
		$vendor = new VendorEntity($data['vendor']);

		$aspClientId = $this->configService->getClientId();
		$propertyId = $data['property_id'];
		$userprofileId = $data['userprofile_id'];
		$roleId = $data['role_id'];
		$vendorsite_favorite = isset($data['vendorsite_favorite']) ? $data['vendorsite_favorite'] : self::VENDORSITE_FAVORITE_NO;
		$glaccounts = $data['glaccounts'];

//		integration package id
		$integration_package = $this->configService->findByAspClientIdAndUserprofileId($data['userprofile_id']);
//		approval tracking id

		if ($data['vendor']['approval_tracking_id']) {
			$approval_tracking_id = $data['vendor']['approval_tracking_id'];
		} else {
			$approval_vendor_id = $this->vendorGateway->find(['v.vendor_id' => '?'], [$vendor->vendor_id], null, ['approval_tracking_id']);
			$approval_tracking_id = count($approval_vendor_id) > 0 ? $approval_vendor_id[0]['approval_tracking_id'] : null;
		}


		$approval_data = [
			'asp_client_id'				=> $this->configService->getClientId(),
			'approval_tracking_id'		=> $approval_tracking_id,
			'vendor_id'					=> $vendor->vendor_id,
			'vendor_name'				=> $this->configService->get('PN.VendorOptions.VendorCapsOn') ? strtoupper($vendor->vendor_name) : $vendor->vendor_name,
			'vendor_fed_id'				=> !empty($vendor->vendor_fedid) ? $vendor->vendor_fedid : null,
			'vendor_id_alt'				=> $this->configService->get('PN.VendorOptions.VendorCapsOn') ? strtoupper($vendor->vendor_id_alt) : $vendor->vendor_id_alt,
			'use_vendor_name'			=> $this->configService->get('PN.VendorOptions.ValidateName'),
			'use_vendor_fed_id'			=> $this->configService->get('PN.VendorOptions.ValidateTaxId'),
			'use_vendor_id_alt'			=> $this->configService->get('PN.VendorOptions.ValidateIdAlt'),
			'integration_package_id'	=> $vendor->integration_package_id
		];

		$result = $this->vendorGateway->validateVendor($approval_data);

		if ($result['check_status'] !== self::VALIDATE_CHECK_STATUS_OK) {
			if ($result['check_status'] == self::VALIDATE_CHECK_STATUS_ID_ALT) {
				$message = 'The vendor ' . $vendor->vendor_name . '  already uses this ' . $integration_package[0]['Integration_Package_Type_Display_Name'] . ' Vendor Id. Please update that vendor or select a different Vendor ID.';
			}
			if ($result['check_status'] == self::VALIDATE_CHECK_STATUS_NAME) {
				$message = 'A vendor with this name already exists.';
			}
			if ($result['check_status'] == self::VALIDATE_CHECK_STATUS_TAX_ID) {
				$message = 'The vendor ' . $vendor->vendor_name . ' already uses this taxid. Please update that vendor or select a different tax id';
			}
//			something wrong in check
			$result = [
				'success'	=> false,
				'errors'	=> array('field'=>'global', 'msg'=> $message, 'extra'=>null)
			];

		} else {
//			it's ok, let's go
			$in_app_user = $this->userprofileGateway->isInAppUser($roleId, $userprofileId);
			$vendorstatus = $in_app_user ? $this->configService->get('PN.VendorOptions.OnApprovalStatus') : 'forapproval';

//			save vendor
			$data['vendor']['vendor_status'] = $vendorstatus;
			$data['vendorsite']['vendor_status'] = $vendorstatus;
			$result = $this->saveVendorRecord($data);
			if (!$result['success']) {
				return $result;
			}
			$out_vendor_id = !$vendor->vendor_id ? $result['lastInsertId'] : $vendor->vendor_id;
			if (is_null($vendor->vendor_id)) {
				$this->vendorGateway->update(
					['approval_tracking_id' => !$approval_tracking_id ? $out_vendor_id : $approval_tracking_id],
					['vendor_id'	=> '?'],
					[$out_vendor_id]
				);
			} else {
				$current_vendor_status = $this->vendorGateway->find(['v.vendor_id' => '?'], [$vendor->vendor_id], null, ['vendor_status']);
				if ($current_vendor_status[0]['vendor_status'] == self::VENDOR_STATUS_REJECTED) {
					$this->vendorGateway->deleteMessages($vendor->vendor_id);
				}
			}
//			find vendorsite code
			$vendorsitecode = $this->vendorsiteGateway->getVendositeCode($vendor->vendor_id, $data['address']['address_city'], 'active', $aspClientId);
//			save vendorsite
			$result = $this->saveVendorsite($data, $vendorstatus, $out_vendor_id, $vendorsitecode);
			if (!$result['success']) {
				return $result;
			}
			$out_vendorsite_id = $result['lastInsertId'];
			$approval_vendorsite = $this->vendorsiteGateway->find(['vendor_id' => '?'], [$approval_tracking_id], null, ['vendorsite_id']);
			if (is_null($vendor->vendor_id)) {
				$this->vendorsiteGateway->update(
					['approval_tracking_id' => !$approval_tracking_id ? $out_vendorsite_id : $approval_vendorsite[0]['vendorsite_id']],
					['vendorsite_id' => '?'],
					[$out_vendorsite_id]
				);
			}
//			vendosite favorite
			if ($vendorsite_favorite == self::VENDORSITE_FAVORITE_YES && !is_null($propertyId) && is_null($vendor->vendor_id)) {
				$this->updateFavorite($out_vendorsite_id, $propertyId);
			}

//			assign glaccounts
			if ($glaccounts !== '') {
				if (!$this->vendorsiteGateway->assignGlAccounts($glaccounts, $out_vendor_id)) {
					return [
						'success'		=> false,
						'errors'			=> [array('field'=>'global', 'msg'=>'Cannot assign glaccounts', 'extra'=>null)]
					];
				}
			}
//					save address
			$result = $this->saveAddress($data, $out_vendorsite_id);
			if (!$result['success'] ) {
				return $result;
			}
//				save phone and fax
			$result = $this->savePhoneAndFax($data, $out_vendorsite_id);
			if (!$result['success']) {
				return $result;
			}
//				save person and contact and contact phone
			$result = $this->saveContact($data, $out_vendorsite_id, $aspClientId);
			if (!$result['success']) {
				return $result;
			}
//				save email
			$result = $this->saveEmailRecord($data, $out_vendorsite_id);
			if (!$result['success']) {
				return result;
			}
//				save insurances
			$insurances = json_decode($data['insurances']);
			if (count($insurances) > 0) {
				$this->insuranceGateway->delete(['table_name' => '?', 'tablekey_id' => '?'], ['vendor', $out_vendor_id]);
				if ($data['vendorsite_DaysNotice_InsuranceExpires'] > 0) {
					$this->vendorsiteGateway->update(
						['vendorsite_DaysNotice_InsuranceExpires' => $data['vendorsite_DaysNotice_InsuranceExpires']],
						['vendor_id' => '?'],
						[$out_vendor_id]
					);
				}
				$insurance = $insurances[0];
				if (is_array($insurance->insurancetype_id)) {
					for ($index = 0; $index < count($insurance->insurancetype_id); $index++) {
						$saveInsurance = [
							'insurancetype_id'						=> $insurance->insurancetype_id[$index],
							'insurance_company'						=> $insurance->insurance_company[$index],
							'insurance_policynum'					=> $insurance->insurance_policynum[$index],
							'insurance_policy_effective_datetm'		=> $insurance->insurance_policy_effective_datetm[$index],
							'insurance_expdatetm'					=> $insurance->insurance_expdatetm[$index],
							'insurance_policy_limit'					=> $insurance->insurance_policy_limit[$index],
							'insurance_additional_insured_listed'	=> $insurance->insurance_additional_insured_listed[$index],
							'insurance_id'							=> $insurance->insurance_id[$index]
						];
						$result = $this->saveInsurance(['insurance' => $saveInsurance], $out_vendor_id);
						if (!$result['success']) {
							return $result;
						}
					}
				} else {
					$result = $this->saveInsurance(['insurance' => (array)$insurance], $out_vendor_id);
					if (!$result['success']) {
						return $result;
					}
				}
			}

//			save recauthor
			$this->vendorGateway->recauthorSave($data['userprofile_id'], 'vendor', $out_vendor_id);
		}

		return [
			'success'		=> true
		];
	}

	/**
	 * Save vendorsite
	 *
	 * @param $data
	 * @param $vendorstatus
	 * @param $vendorId
	 * @param $vendorsiteCode
	 * @return array
	 */
	public function saveVendorsite($data, $vendorstatus, $vendorId, $vendorsiteCode) {
		if (!is_object($data) && isset($data['vendorsite'])) {
			$vendorsite = new VendorsiteEntity($data['vendorsite']);

			$vendorsite->vendorsite_lastupdate_date = Util::formatDateForDB(new \DateTime());
			$vendorsite->vendorsite_ship_to_location_id = 1;
			$vendorsite->vendorsite_bill_to_location_id = 1;
			$vendorsite->vendorsite_status =$vendorstatus;
			$vendorsite->vendor_id = $vendorId;
			$vendorsite->vendorsite_id_alt = $this->configService->get('PN.VendorOptions.VendorCapsOn') ? strtoupper($data['vendor']['vendor_id_alt']) : $data['vendor']['vendor_id_alt'];
			$vendorsite->submit_userprofile_id = $data['userprofile_id'];
			$vendorsite->term_id = $vendorsite->term_id == '' ? null : $vendorsite->term_id;
			$vendorsite->bill_contact_id = $vendorsite->bill_contact_id == '' ? null : $vendorsite->bill_contact_id;
			$vendorsite->paygroup_code = $vendorsite->paygroup_code == '' ? null : $vendorsite->paygroup_code;
			$vendorsite->paydatebasis_code = $this->configService->get('PN.VendorOptions.VendorCapsOn') ? strtoupper($vendorsite->paydatebasis_code) : $vendorsite->paydatebasis_code;
			$vendorsite->vendorsite_note = $vendorsite->vendorsite_note == '' ? null : $vendorsite->vendorsite_note;
			$vendorsite->vendorsite_tax_reporting_flag = $vendorsite->vendorsite_tax_reporting_flag == '' ? null : $vendorsite->vendorsite_tax_reporting_flag;
			$vendorsite->vendor_universalfield1 = $vendorsite->vendor_universalfield1 == '' ? null : $vendorsite->vendor_universalfield1;
			$vendorsite->vendorsite_code = $vendorsiteCode;
			$vendorsite->vendorsite_display_account_number_po = strval($vendorsite->vendorsite_display_account_number_po);
			$vendorsite->vendorsite_invoice_maxamount = 0;
		} else {
			$vendorsite = $data;
		}

		$validator = new EntityValidator();
		$validator->validate($vendorsite);
		$errors = $validator->getErrors();
		$id = null;

		if(count($errors) == 0) {
			$this->vendorsiteGateway->beginTransaction();
			try {
				$id = $this->vendorsiteGateway->save($vendorsite);
				$this->vendorsiteGateway->commit();
			} catch (\Exception $e) {
				$this->vendorsiteGateway->rollback();
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		return [
			'success'    			=> (count($errors)) ? false : true,
			'errors'					=> $errors,
			'lastInsertId'		=> $vendorsite->vendorsite_id ? $vendorsite->vendorsite_id : $id
		];

	}

	/**
	 * Save vendor record
	 *
	 * @param $data
	 * @return array
	 */
	public function saveVendorRecord($data) {
		foreach ($data['vendor'] as $key => $item) {
			if ($key !== 'paydatebasis_code' && $key !== 'paygroup_code')
			$data['vendor'][$key] = empty($item) ? null : $item;
		}
		if (!is_null($data['vendor']['vendor_id'])) {
			$data['vendor']['vendor_lastupdate_date'] = Util::formatDateForDB(new \DateTime(date('Y-m-d', strtotime('now'))));
		}

		$vendor = new VendorEntity($data['vendor']);

		$vendor->vendor_type1099 = $vendor->vendor_type1099 == 0 ? '0' : strval($vendor->vendor_type1099);
		$vendor->vendor_fedid = $vendor->vendor_fedid == '' ? null : ($this->configService->get('PN.VendorOptions.VendorCapsOn') ? strtoupper($vendor->vendor_fedid) : $vendor->vendor_fedid);
		$vendor->vendor_id_alt = $this->configService->get('PN.VendorOptions.VendorCapsOn') ? strtoupper($vendor->vendor_id_alt) : $vendor->vendor_id_alt;
		$vendor->vendor_type_code = $this->configService->get('PN.VendorOptions.VendorCapsOn') ? strtoupper($vendor->vendor_type_code) : $vendor->vendor_type_code;
		$vendor->vendor_w9onfile = $vendor->vendor_w9onfile == '' ? null : $vendor->vendor_w9onfile;
		$vendor->remit_req = $vendor->remit_req ? $vendor->remit_req : 0;
		$vendor->insurance_req = $vendor->insurance_req ? $vendor->insurance_req : 0;

		$vendor->vendor_lastupdate_date = Util::formatDateForDB(new \DateTime());

		$validator = new EntityValidator();
		$validator->validate($vendor);
		$errors = $validator->getErrors();

		$id = null;

		if (count($errors) == 0) {
			$this->vendorGateway->beginTransaction();

			try {
				$id = $this->vendorGateway->save($vendor);
				$this->vendorGateway->commit();
			} catch (\Exception $e) {
				$this->vendorGateway->rollback();
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		return [
			'success'    			=> (count($errors)) ? false : true,
			'errors'				=> $errors,
			'lastInsertId'		=> $id
		];
	}

	/**
	 * save address info for the vendor
	 *
	 * @param $data
	 * @param $vendorsite_id
	 * @return array
	 */
	protected function saveAddress($data, $vendorsite_id) {
		$tmpAddress = $this->addressGateway->find(['table_name' => '?', 'tablekey_id' => '?'], ['vendorsite', $vendorsite_id], null, ['address_id']);
		$address = new AddressEntity($data['address']);
		if (count($tmpAddress) > 0) {
			$address->address_id = $tmpAddress[0]['address_id'];
		}

		$address->addresstype_id = AddressGateway::ADDRESS_TYPE_MAILING;
		$address->tablekey_id = $vendorsite_id;
		$address->table_name = 'vendorsite';
		$address->address_state = strval($address->address_state);

		$validator = new EntityValidator();
		$validator->validate($address);
		$errors = $validator->getErrors();

		$address_id = null;
		if (count($errors) == 0) {
			$this->addressGateway->beginTransaction();
			try {
				$address_id = $this->addressGateway->save($address);
				$this->addressGateway->commit();
			} catch (\Exception $e) {
				$this->addressGateway->rollback();
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		return [
			'success'    			=> (count($errors)) ? false : true,
			'errors'					=> $errors,
			'lastInsertId'		=> $address_id
		];

	}

	/**
	 * save phone and fax
	 *
	 * @param $data
	 * @param $vendorsite_id
	 * @return array
	 */
	protected function savePhoneAndFax($data, $vendorsite_id) {
		$tmpPhone = $this->phoneGateway->find(['table_name' => '?', 'tablekey_id' => '?', 'phonetype_id' => '?'], ['vendorsite', $vendorsite_id, PhoneGateway::PHONE_TYPE_MAIN], null, ['phone_id']);
		$tmpFax = $this->phoneGateway->find(['table_name' => '?', 'tablekey_id' => '?', 'phonetype_id' => '?'], ['vendorsite', $vendorsite_id, PhoneGateway::PHONE_TYPE_FAX], null, ['phone_id']);

		$phone = new PhoneEntity($data['vendorsite_phone']);
		$phone->phone_id = count($tmpPhone) > 0 ? $tmpPhone[0]['phone_id'] : $phone->phone_id;
		$phone->phonetype_id =PhoneGateway::PHONE_TYPE_MAIN;
		$phone->tablekey_id = $vendorsite_id;
		$phone->table_name = 'vendorsite';
		$errors = [];

		$result = $this->savePhoneRecord($phone);
		$phone_id = $result['lastInsertPhoneId'];
		$fax_id = null;

		if (count($result['errors']) > 0 ) {
			$errors[] = $result['errors'];
		}

		if ($phone_id) {
			$fax = new PhoneEntity($data['vendorsite_fax_phone']);
			$fax->phone_id = count($tmpFax) > 0 ? $tmpFax[0]['phone_id'] : $fax->phone_id;
			$fax->phonetype_id =PhoneGateway::PHONE_TYPE_FAX;
			$fax->tablekey_id = $vendorsite_id;
			$fax->table_name = 'vendorsite';

			$result = $this->savePhoneRecord($fax);
			$fax_id = $result['lastInsertPhoneId'];
			if (count($result['errors']) > 0 ) {
				$errors[] = $result['errors'];
			}
		}

		return [
			'success'    						=> (count($errors) > 0) ? false : true,
			'errors'								=> $errors,
			'lastInsertPhoneId'		=> $phone_id,
			'lastInsertFaxId'				=> $fax_id
		];
	}

	/**
	 * save person and contact info
	 *
	 * @param $data
	 * @param $vendorsite_id
	 * @param $asp_client_id
	 * @return array
	 */
	protected function saveContact($data, $vendorsite_id, $asp_client_id) {
		$tmpPerson = $this->contactGateway->find(['table_name' => '?', 'tablekey_id' => '?'], ['vendorsite', $vendorsite_id], null, ['person_id', 'contact_id']);
		$tmpContactPhone = null;
		if (count($tmpPerson) > 0) {
			$tmpContactPhone = $this->phoneGateway->find(['table_name' => '?', 'tablekey_id' => '?', 'phonetype_id' => '?'], ['contact', $tmpPerson[0]['contact_id'], PhoneGateway::PHONE_TYPE_MAIN], null, ['phone_id']);
		}

		$person = new PersonEntity($data['person']);
		$person->person_id = !$person->person_id ? (isset($tmpPerson[0]['person_id']) ? $tmpPerson[0]['person_id'] : null) : $person->person_id;
		$person->asp_client_id = $asp_client_id;


		$person_id = null;
		$contact_id = null;
		$phone_id = null;

		$validator = new EntityValidator();
		$validator->validate($person);
		$errors = $validator->getErrors();

		if (count($errors) == 0) {
			$this->personGateway->beginTransaction();

			try {
				$person_id = $this->personGateway->save($person);
				$this->personGateway->commit();
			} catch (\Exception $e) {
				$this->personGateway->rollback();
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}

			if ($person_id) {
				$contact = new ContactEntity([
					'contact_id'			=> count($tmpPerson) > 0 ? $tmpPerson[0]['contact_id'] : null,
					'contacttype_id'		=> ContactGateway::CONTACT_TYPE_VENDOR,
					'table_name'				=> 'vendorsite',
					'tablekey_id'			=> $vendorsite_id,
					'person_id'				=> $person->person_id ? $person->person_id : $person_id
				]);

				$validator->validate($contact);
				$errors = $validator->getErrors();

				$this->contactGateway->beginTransaction();

				try {
					$contact_id = $this->contactGateway->save($contact);
					$this->contactGateway->commit();
				} catch (\Exception $e) {
					$this->contactGateway->rollback();
					$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
				}

				if ($contact_id) {
					$phone = new PhoneEntity($data['attention_phone']);
					$phone->phone_id = count($tmpContactPhone) > 0 ? $tmpContactPhone[0]['phone_id'] : $phone->phone_id;
					$phone->phonetype_id = PhoneGateway::PHONE_TYPE_MAIN;
					$phone->table_name = 'contact';
					$phone->tablekey_id = count($tmpPerson) > 0 ? $tmpPerson[0]['contact_id'] : $contact_id;

					$result = $this->savePhoneRecord($phone);
					$phone_id = $result['lastInsertPhoneId'];
					if (count($result['errors']) > 0) {
						$errors[] = $result['errors'];
					}
				}
			}
		}

		return [
			'success'    			=> (count($errors) > 0) ? false : true,
			'errors'				=> $errors,
			'lastInsertPersonId'	=> $person_id,
			'lastInsertContactId'	=> $contact_id,
			'lastInsertPhoneId'		=> $phone_id
		];

	}
	/**
	 * save phone record (and fax too)
	 *
	 * @param $phone
	 * @return array
	 */
	protected function savePhoneRecord($phone) {
		$validator = new EntityValidator();
		$validator->validate($phone);
		$errors = $validator->getErrors();

		$phone_id = null;

		if (count($errors) == 0) {
			$this->phoneGateway->beginTransaction();
			try {
				$phone_id = $this->phoneGateway->save($phone);
				$this->phoneGateway->commit();
			} catch (\Exception $e) {
				$this->phoneGateway->rollback();
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		return [
			'success'    						=> (count($errors) > 0) ? false : true,
			'errors'								=> $errors,
			'lastInsertPhoneId'		=> $phone_id
		];
	}

	/**
	 * Save email
	 *
	 * @param $data
	 * @param $vendorsite_id
	 * @return array
	 */
	protected function saveEmailRecord($data, $vendorsite_id) {
		$email = new EmailEntity($data['email']);

		$email->emailtype_id = EmailGateway::EMAIL_TYPE_PRIMARY;
		$email->table_name = 'vendorsite';
		$email->tablekey_id = $vendorsite_id;

		$validator = new EntityValidator();
		$validator->validate($email);
		$errors = $validator->getErrors();

		$email_id = null;

		if (count($errors) == 0) {
			$this->emailGateway->beginTransaction();
			try {
				$email_id = $this->emailGateway->save($email);
				$this->emailGateway->commit();
			} catch (\Exception $e) {
				$this->emailGateway->rollback();
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		return [
			'success'    						=> (count($errors) > 0) ? false : true,
			'errors'								=> $errors,
			'lastInsertEmailId'			=> $email_id
		];
	}

	/**
	 * save Insurances
	 *
	 * @param $data
	 * @param $vendor_id
	 * @return array
	 */
	protected function saveInsurance($data, $vendor_id) {
		$insurance = new InsuranceEntity($data['insurance']);

		$insurance->insurance_expdatetm = Util::formatDateForDB(new \DateTime($insurance->insurance_expdatetm));
		$insurance->insurance_policy_effective_datetm = Util::formatDateForDB(new \DateTime($insurance->insurance_policy_effective_datetm));

		$insurance->table_name = 'vendor';
		$insurance->tablekey_id = $vendor_id;

		$validator = new EntityValidator();
		$validator->validate($insurance);
		$errors = $validator->getErrors();

		$id = null;

		if (count($errors) == 0) {
			$this->insuranceGateway->beginTransaction();
			try {
				$id = $this->insuranceGateway->save($insurance);
				if ($data['insurance']['insurance_id']) {
					$this->insuranceGateway->saveLinkInsuranceProperty($data['insurance']['insurance_id'], $id);
				}
				$this->insuranceGateway->commit();
			} catch (\Exception $e) {
				$this->insuranceGateway->rollback();
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		return [
			'success'    						=> (count($errors) > 0) ? false : true,
			'errors'								=> $errors,
			'lastInsertInsuranceId'			=> $id
		];
	}

	/**
	 * retrieve saved vendor
	 *
	 * @param null $vendor_id
	 * @return array
	 */
	public function getVendor($vendor_id = null) {
		$res = $this->vendorGateway->getVendor($vendor_id);
		$res['glaccounts'] = $this->vendorGateway->findAssignedGlaccounts($vendor_id);
		$res['insurances'] = $this->insuranceGateway->find(['table_name' => '?', 'tablekey_id' => '?'], ['vendor', $vendor_id]);

		return $res;
	}

	/**
	 * find by keyword
	 *
	 * @param null $keyword
	 * @return array|bool
	 */
	public function findByKeyword($userprofile_id, $keyword = null, $sort = 'vendor_name', $category_id = 'all', $status = null, $pageSize = null, $page = null, $task_type = null) {
		if (!$keyword) {
			return [];
		}
		$asp_client_id = $this->configService->getClientId();
		$integration_package_id = $this->integrationPackageGateway->findByAspClientIdAndUserprofileId($asp_client_id, $userprofile_id);

		if (!$task_type) {
			return $this->vendorGateway->findByKeyword($keyword, $sort, $category_id, $status, $asp_client_id, $integration_package_id['integration_package_id'], $pageSize, $page);
		} else {
			$allowExpInsurance = $this->configService->findSysValueByName('CP.AllowExpiredInsurance');
			return $this->vendorGateway->findByKeywordWithTaskType($allowExpInsurance);
		}

	}

	/**
	 * Update favorite
	 *
	 * @param $vendorsite
	 * @param $property_id
	 * @return array|bool
	 */
	public function updateFavorite($vendorsite_id = null, $property_id = null, $op = 'add') {
		if ($vendorsite_id == null || $property_id == null) {
			return false;
		}
		return $this->vendorsiteGateway->insertFavorite($vendorsite_id, $property_id, $op);
	}
}

?>