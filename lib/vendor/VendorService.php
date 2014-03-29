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
use NP\core\db\Adapter;
use NP\core\db\Delete;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\validation\EntityValidator;
use NP\image\ImageIndexGateway;
use NP\invoice\InvoiceGateway;
use NP\locale\LocalizationService;
use NP\system\ConfigService;
use NP\system\IntegrationPackageGateway;
use NP\system\MessageEntity;
use NP\system\MessageGateway;
use NP\system\PnCustomFieldDataGateway;
use NP\user\UserprofileGateway;
use NP\util\Util;
use NP\vendor\validation\VendorEntityValidator;

/**
 * Service class for operations related to vendors
 *
 * @author Thomas Messier
 */
class VendorService extends AbstractService {

	const VENDORSITE_FAVORITE_NO = 'N';
	const VENDORSITE_FAVORITE_YES = 'Y';
	const VENDOR_STATUS_APPROVED = 'approved';
	const VENDOR_STATUS_REJECTED = 'rejected';

	protected $configService, $vendorEntityValidator;
	
	public function __construct(VendorEntityValidator $vendorEntityValidator) {
		$this->vendorEntityValidator = $vendorEntityValidator;
	}

	public function setConfigService(ConfigService $configService) {
		$this->configService = $configService;
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
	public function findByStatus($pageSize = null, $page = null, $status = 'pending', $sort = 'PersonName', $keyword=null) {
		return $this->vendorGateway->findByStatus($pageSize, $page, $status, $sort, $keyword);
	}

	/**
	 * Retrieve vendor's types records list
	 *
	 * @return array|bool
	 */
	public function findVendorTypes($userprofile_id = null) {
		$integration_package = $this->configService->findByAspClientIdAndUserprofileId($userprofile_id);
		return $this->vendorGateway->findVendorTypes($integration_package['integration_package_id']);
	}

	/**
	 * Save vendor
	 *
	 * @param $data
	 */
	public function saveVendor($data) {
		$data['vendorsite'] = $data['vs_vendorsite'];
		unset($data['vs_vendorsite']);

		if ($data['vendor']['vendor_id'] && $data['vendorsite']['vendorsite_id'] && $data['action'] == 'delete_vendor') {
			$this->deleteVendor($data['vendor']['vendor_id'], $data['vendorsite']['vendorsite_id']);
			$this->vendorGateway->deleteMessages($data['vendor']['vendor_id']);
		}

		$errors = [];
		$vendor = new VendorEntity($data['vendor']);


		$aspClientId = $this->configService->getClientId();
		$propertyId = $data['property_id'];
		$userprofileId = $data['userprofile_id'];
		$roleId = $data['role_id'];
		$vendorsite_favorite = isset($data['vendorsite_favorite']) ? $data['vendorsite_favorite'] : self::VENDORSITE_FAVORITE_NO;
		$glaccounts = $data['glaccounts'];

		$data['vendor']['submit_userprofile_id'] = !($data['vendor']['vendor_id']) ? $data['userprofile_id'] : $data['vendor']['submit_userprofile_id'];
		$data['vendorsite']['submit_userprofile_id'] = !($data['vendor']['vendor_id']) ? $data['userprofile_id'] : $data['vendorsite']['submit_userprofile_id'];

//		integration package id
		$integration_package = $this->configService->findByAspClientIdAndUserprofileId($data['userprofile_id']);
//		approval tracking id

		if ($data['vendor']['approval_tracking_id']) {
			$approval_tracking_id = $data['vendor']['approval_tracking_id'];
		} else {
			$approval_vendor_id = $this->vendorGateway->find(['v.vendor_id' => '?'], [$vendor->vendor_id], null, ['approval_tracking_id']);
			$approval_tracking_id = count($approval_vendor_id) > 0 ? $approval_vendor_id[0]['approval_tracking_id'] : null;
		}

		$this->vendorGateway->beginTransaction();
		try {
			$in_app_user = $this->userprofileGateway->isInAppUser($roleId, $userprofileId);
			$vendorstatus = $in_app_user ? $this->configService->get('PN.VendorOptions.OnApprovalStatus') : 'forapproval';

//				save vendor
			$data['vendor']['vendor_status'] = $vendorstatus;
			$data['vendorsite']['vendor_status'] = $vendorstatus;

			$result = $this->saveVendorRecord($data);
			if (!$result['success']) {
				foreach ($result['errors'] as $error) {
					$errors[] = $error;
				}
				throw new \NP\core\Exception("Cannot save vendor!");
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
				if (count($current_vendor_status) > 0 && $current_vendor_status[0]['vendor_status'] == self::VENDOR_STATUS_REJECTED) {
					$this->vendorGateway->deleteMessages($vendor->vendor_id);
				}
			}
//				find vendorsite code
			$vendorsitecode = $this->vendorsiteGateway->getVendositeCode($vendor->vendor_id, $data['address']['address_city'], 'active', $aspClientId);
//				save vendorsite
			$result = $this->saveVendorsite($data, $vendorstatus, $out_vendor_id, $vendorsitecode);
			$out_vendorsite_id = $result['lastInsertId'];
			$approval_vendorsite = $this->vendorsiteGateway->find(['vendor_id' => '?'], [$approval_tracking_id], null, ['vendorsite_id']);
			if (is_null($vendor->vendor_id)) {
				$this->vendorsiteGateway->update(
					['approval_tracking_id' => !$approval_tracking_id ? $out_vendorsite_id : $approval_vendorsite[0]['vendorsite_id']],
					['vendorsite_id' => '?'],
					[$out_vendorsite_id]
				);
			}
//				vendosite favorite
			if ($vendorsite_favorite == self::VENDORSITE_FAVORITE_YES && !is_null($propertyId) && is_null($vendor->vendor_id)) {
				$this->updateFavorite($out_vendorsite_id, $propertyId);
			}
//				assign glaccounts
			if ($glaccounts !== '') {
				if (!$this->vendorGlAccountsGateway->assignGlAccounts($glaccounts, $out_vendor_id)) {
					throw new \NP\core\Exception("Cannot assign glaccounts");
				}
			}
//				save address
			$result = $this->saveAddress($data, $out_vendorsite_id);
			if (!$result['success']) {
				throw new \NP\core\Exception("Cannot save address");
			}
//				save phone and fax
			$result = $this->savePhoneAndFax($data, $out_vendorsite_id);
			if (!$result['success']) {
				throw new \NP\core\Exception("Cannot save phone");
			}
//				save person and contact and contact phone
			$result = $this->saveContact($data, $out_vendorsite_id, $aspClientId);
			if (!$result['success']) {
				throw new \NP\core\Exception("Cannot save contact");
			}
//				save email
			$result = $this->saveEmailRecord($data, $out_vendorsite_id);
			if (!$result['success']) {
				throw new \NP\core\Exception("Cannot save email");
			}
//				save insurances
			$this->saveInsurances($out_vendor_id, $data['insurances'], $data['vendorsite_DaysNotice_InsuranceExpires']);
//				save recauthor
			$this->vendorGateway->recauthorSave($data['userprofile_id'], 'vendor', $out_vendor_id);

			$this->saveCustomFields($data['customFields'], $out_vendor_id, $data['userprofile_id']);

			if ($data['action'] && $data['action'] == 'approve') {
				$compare_date = [
					'phone_number'		=> is_null($data['vendorsite_phone']['phone_number']) ? '' : $data['vendorsite_phone']['phone_number'],
					'fax'				=> is_null($data['vendorsite_fax_phone']['phone_number']) ? '' : $data['vendorsite_fax_phone']['phone_number'],
					'address_line1'		=> is_null($data['address']['address_line1']) ? '' : $data['address']['address_line1'],
					'address_line2'		=> is_null($data['address']['address_line2']) ? '' : $data['address']['address_line2'],
					'address_city'		=> is_null($data['address']['address_city']) ? '' : $data['address']['address_city'],
					'address_state'		=> is_null($data['address']['address_state']) ? '' : $data['address']['address_state'],
					'address_zip'		=> is_null($data['address']['address_zip']) ? '' : $data['address']['address_zip'],
					'address_zipext'		=> is_null($data['address']['address_zipext']) ? '' : $data['address']['address_zipext'],
					'address_country'		=> is_null($data['address']['address_country']) ? '' : $data['address']['address_country'],
					'person_firstname'		=> is_null($data['person']['person_firstname']) ? '' : $data['person']['person_firstname'],
					'person_lastname'		=> is_null($data['person']['person_lastname']) ? '' : $data['person']['person_lastname'],
					'phone_number'		=> is_null($data['attention_phone']['phone_number']) ? '' : $data['attention_phone']['phone_number']
				];
				$vendorsite_transfer_compare = $this->vendorGateway->transferCompareVendor($data['vendor']['vendor_id'], null, $compare_date);
				$vendor_transfer_compare = $this->vendorGateway->transferCompareVendor($out_vendor_id, $approval_tracking_id);
				$status = (!$vendor_transfer_compare && !$vendorsite_transfer_compare) ? 'active' : $this->configService->get('PN.VendorOptions.OnApprovalStatus');

				$this->vendorApprove($aspClientId, $out_vendor_id, $approval_tracking_id, $status, $out_vendorsite_id);
			}

			if ($data['action'] && ($data['action'] == 'inactive' || $data['action'] == 'active')) {
				$this->vendorActive($out_vendor_id, $out_vendorsite_id, $userprofileId, $data['action']);
			}

			$this->vendorGateway->commit();
		} catch (\Exception $e) {
			$this->vendorGateway->rollback();
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
		}
//		}

		return [
			'success'			=> (count($errors)) ? false : true,
			'errors'			=> $errors
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
	public function saveVendorsite($data, $vendorstatus = null, $vendorId = null, $vendorsiteCode = null) {
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

		$errors = $this->entityValidator->validate($vendorsite);
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
		$vendor->vendor_ModificationType = $vendor->vendor_id ? $vendor->vendor_ModificationType : 'New';

		$vendor->vendor_lastupdate_date = Util::formatDateForDB(new \DateTime());

		$errors = $this->vendorEntityValidator->validate($vendor);
//		$errors = $this->entityValidator->validate($vendor);

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
			'lastInsertId'			=> $id
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

		$errors = $this->entityValidator->validate($address);

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
			'success'    		=> (count($errors)) ? false : true,
			'errors'			=> $errors,
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

		$errors = $this->entityValidator->validate($person);

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


				$errors = $this->entityValidator->validate($contact);

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
		$errors = $this->entityValidator->validate($phone);

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

		$errors = $this->entityValidator->validate($email);

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
	 * retrieve saved vendor
	 *
	 * @param null $vendor_id
	 * @return array
	 */
	public function getVendor($vendor_id = null) {
		$res = $this->vendorGateway->getVendor($vendor_id);
		$res['glaccounts'] = $this->vendorGateway->findAssignedGlaccounts($vendor_id);

		$custom = $this->getCustomFields($vendor_id);

		$res['custom_fields'] = $custom['custom_fields'];
		$res['insurances'] = $custom['insurances'];

		return $res;
	}

	/**
	 * find by keyword
	 *
	 * @param null $keyword
	 * @return array|bool
	 */
	public function findByKeyword($userprofile_id, $keyword = null, $integration_package_id = null, $sort = 'vendor_name', $category_id = 'all', $status = null, $pageSize = null, $page = null, $task_type = null) {
		if (!$keyword) {
			return [];
		}
		$asp_client_id = $this->configService->getClientId();

		if (!$task_type) {
			return $this->vendorGateway->findByKeyword($keyword, $sort, $category_id, $status, $asp_client_id, $integration_package_id, $pageSize, $page);
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

	/**
	 * Retrieve custom fields for the edit form
	 *
	 * @param integer $vendor_id
	 * @return mixed
	 */
	public function getCustomFields($vendor_id) {
		$result['custom_fields'] = $this->configService->getCustomFieldData('vendor', $vendor_id);
		$result['insurances'] = $this->insuranceGateway->find(['table_name' => '?', 'tablekey_id' => '?'], ['vendor', $vendor_id]);

		return $result;
	}

	/**
	 * Sve vendor custom fields value
	 *
	 * @param $custom_fields_values
	 * @param $vendor_id
	 * @param $userprofile_id
	 */
	protected function saveCustomFields($custom_fields_values, $vendor_id, $userprofile_id) {
		$custom_fields = $this->configService->getCustomFieldData('vendor', $vendor_id);
		foreach ($custom_fields as $field) {
			$formFieldName = $field['customfield_name'];
			// Build the data array
			$fieldData = array(
				'customfielddata_id'           => $field['customfielddata_id'],
				'customfield_id'               => $field['customfield_id'],
				'customfielddata_table_id'     => $vendor_id,
				'customfielddata_value'        => $custom_fields_values[$formFieldName],
				'customfielddata_lastupdatedt' => \NP\util\Util::formatDateForDB(),
				'customfielddata_lastupdateby' => $userprofile_id
			);
			// If the custom field data is new, also give it a created date and user
			if ($field['customfielddata_id'] === null) {
				$fieldData['customfielddata_createdt']  = \NP\util\Util::formatDateForDB();
				$fieldData['customfielddata_createdby'] = $userprofile_id;
			}
			// Save the custom field data
			$this->pnCustomFieldDataGateway->save($fieldData);
		}
	}
    
    public function getVendorBySiteId($vendorsite_id) {
        $res = $this->vendorGateway->find('vs.vendorsite_id = ?', array($vendorsite_id));
        return $res[0];
    }
    
    /**
     * Get vendors that will show up on the vendor drop down of the invoice view page
     *
     * @param  int    $property_id Property selected on the invoice page
     * @param  string $keyword     Keyword to filter list of vendors by
     * @return array               List of vendor records
     */
    public function getVendorsForInvoice($property_id, $vendor_id=null, $useFavorites=true, $keyword=null, $criteria='begins', $pageSize=null, $page=null, $sort="vendor_name") {
    	if (is_string($useFavorites)) {
    		if ($useFavorites == 'false') {
    			$useFavorites = false;
    		} else {
    			$useFavorites = true;
    		}
    	}
        return $this->vendorGateway->findVendorsForInvoice($property_id, $vendor_id, $useFavorites, $keyword, $criteria, $pageSize, $page, $sort);
    }

    /**
     * Retrieves vendor records for the vendor autocomplete when creating catalogs
     *
     * @param  string $keyword Keyword to use to search for a vendor
     * @return array           Array of vendor records
     */
    public function getForCatalogDropDown($keyword=null) {
        if ($keyword !== null) {
            return $this->vendorGateway->getForCatalogDropDown($keyword);
        } else {
            return [];
        }
    }
       
    /**
     * Get all vendors in the application
     *
     * @param  string $vendor_status The status of the vendor (optional); valid values are 'active' or 'inactive'
     * @return array
     */
    public function getAll($vendor_status='active', $integration_package_id=null, $keyword=null, $pageSize=null, $page=1, $sort='vendor_name') {
        return $this->vendorGateway->findAll($vendor_status, $integration_package_id, $keyword, $pageSize, $page, $sort);
    }

    /**
     * Gets the top spending vendors
     *
     * @param  int $numberOfVendors
     * @return array
     */
    public function getTopVendors($numberOfVendors=5) {
    	return $this->vendorGateway->findTopVendors($numberOfVendors);
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
                // We need to do this twice because the vendorsite status also needs the params
                for ($i=0; $i<=1; $i++) {
	                foreach ($vendor_status as $vendor_status_val) {
	                    $params[] = $vendor_status_val;
	                }
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
     * Checks if a vendor has any utility accounts setup
     */
    public function isUtilityVendor($vendorsite_id, $property_id=0) {
    	$Utility_Id = $this->utilityGateway->findValue(['Vendorsite_Id'=>'?'], [$vendorsite_id], 'Utility_Id');
    	
    	if ($Utility_Id === null) {
    		return false;
    	}

    	if ($property_id) {
	    	$UtilityAccount_Id = $this->utilityAccountGateway->findValue(
	    		['Utility_Id'=>'?', 'Property_Id'=>'?', 'utilityaccount_active'=>'?'],
	    		[$Utility_Id, $property_id, 1],
	    		'UtilityAccount_Id'
	    	);

	    	if ($UtilityAccount_Id === null) {
	    		return false;
	    	}
	    }

    	return true;
    }

    /**
     * Saves a collection of vendors imported from a file through the import tool
     */
    public function saveVendorFromImport($data) {
        $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($data[0]['integration_package_name'])
        );
        $integration_package_id = $intPkg[0]['integration_package_id'];
        
        try {
            $sessionKey = $this->soapService->login();

            $soapSettings = $this->soapService->getSettings();

            $headerXml = "<SecurityHeader xmlns=\"http://tempuri.org/\">
                            <SessionKey>{$sessionKey}</SessionKey>
                            <ClientName>{$soapSettings['wsdl_client']}</ClientName>
                            <UserName>{$soapSettings['wsdl_user']}</UserName>
                        </SecurityHeader>";

            $xml = "<PN_SET_VENDORCOMBO xmlns=\"http://tempuri.org/\">
                        <vendorcombo>
                            <VENDORCOMBOS xmlns=\"\">";

            foreach ($data as $rec) {
                $xml .=         "<VENDORCOMBO>
                                    <VENDOR_ID_ALT>{$rec['vendor_id_alt']}</VENDOR_ID_ALT>
                                    <VENDOR_NAME>{$rec['vendor_name']}</VENDOR_NAME>
                                    <VENDOR_FEDID>{$rec['vendor_fedid']}</VENDOR_FEDID>
                                    <VENDOR_TAX_REPORTING_NAME>{$rec['vendor_tax_reporting_name']}</VENDOR_TAX_REPORTING_NAME>
                                    <VENDOR_STATUS>{$rec['vendor_status']}</VENDOR_STATUS>
                                    <VENDOR_TYPE_CODE>{$rec['vendortype_code']}</VENDOR_TYPE_CODE>
                                    <VENDOR_PAYPRIORITY>{$rec['vendor_paypriority']}</VENDOR_PAYPRIORITY>
                                    <VENDOR_CREATEDDATE>{$rec['vendor_createddatetm']}</VENDOR_CREATEDDATE>
                                    <VENDOR_LASTUPDATE_DATE>{$rec['vendor_lastupdate_date']}</VENDOR_LASTUPDATE_DATE>
                                    <VENDOR_TYPE1099>{$rec['vendor_type1099']}</VENDOR_TYPE1099>
                                    <VENDOR_TERMSDATEBASIS>{$rec['vendor_termsdatebasis']}</VENDOR_TERMSDATEBASIS>
                                    <PAYDATEBASIS_CODE>{$rec['paydatebasis_code']}</PAYDATEBASIS_CODE>
                                    <DEFAULT_GLCODE>{$rec['default_glaccount_number']}</DEFAULT_GLCODE>
                                    <VENDOR_PHONE>{$rec['phone_number']}</VENDOR_PHONE>
                                    <VENDOR_FAX>{$rec['fax_number']}</VENDOR_FAX>
                                    <VENDOR_ADDRESS1>{$rec['address_line1']}</VENDOR_ADDRESS1>
                                    <VENDOR_ADDRESS2>{$rec['address_line2']}</VENDOR_ADDRESS2>
                                    <VENDOR_CITY>{$rec['address_city']}</VENDOR_CITY>
                                    <VENDOR_STATE>{$rec['address_state']}</VENDOR_STATE>
                                    <VENDOR_ZIPCODE>{$rec['address_zip']}</VENDOR_ZIPCODE>
                                    <CONTACT_LAST_NAME>{$rec['person_firstname']}</CONTACT_LAST_NAME>
                                    <CONTACT_FIRST_NAME>{$rec['person_lastname']}</CONTACT_FIRST_NAME>
                                </VENDORCOMBO>";
            }

            $xml .=         "</VENDORCOMBOS>
                        </vendorcombo>
                        <integration_id>{$integration_package_id}</integration_id>
                    </PN_SET_VENDORCOMBO>";

            $res = $this->soapService->request(
                $soapSettings['wsdl_url'],
                $xml,
                $headerXml
            );

            $statusCode = (string)$res['soapResult']->PN_SET_VENDORCOMBO->Status->StatusCode;

            $error = null;
            if ($statusCode === 'SUCCESS') {
                $success = true;
            } else {
                throw new \NP\core\Exception('The SOAP request for saving vendors failed.');
            }
        } catch(\Exception $e) {
            $success = false;
            $error   = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
        }

        return array(
            'success' => $success,
            'error'   => $error
        );
    }

    /**
     * Save vendor/GL assignment
     */
    public function saveVendorGlAssignment($data) {
        $vendorGl = new VendorGlAccountEntity($data);
        $errors = $this->entityValidator->validate($vendorGl);

        if (!count($errors)) {
            try {
                $this->vendorGlAccountsGateway->save($vendorGl);
            } catch (\Exception $e) {
                $errors[]   = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
            }
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
    }

    /**
     * Save vendor favorite
     */
    public function saveVendorFavorite($data) {
        $vendorFav = new VendorFavoriteEntity($data);
        $errors = $this->entityValidator->validate($vendorFav);

        if (!count($errors)) {
            try {
                $this->vendorFavoriteGateway->save($vendorFav);
            } catch (\Exception $e) {
                $errors[]   = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
            }
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
    }

    /**
     * Save vendor insurance
     */
    public function saveInsurance($data) {
        $insurance = new InsuranceEntity($data['insurance']);
		$insurance->insurance_expdatetm = Util::formatDateForDB(new \DateTime($data['insurance']['insurance_expdatetm']));
		$insurance->insurance_policy_effective_datetm = Util::formatDateForDB(new \DateTime($data['insurance']['insurance_policy_effective_datetm']));
        $errors = $this->entityValidator->validate($insurance);
		$id = null;

        if (!count($errors)) {
            $this->insuranceGateway->beginTransaction();
            
            try {
                $id = $this->insuranceGateway->save($insurance);

                if (array_key_exists('property_id_list', $data)) {
                    if (array_key_exists('insurance_id', $data['insurance'])) {
                        $this->linkInsurancePropertyGateway->delete(
                            'insurance_id = ?',
                            array($data['insurance']['insurance_id'])
                        );
                    }
                    foreach ($data['property_id_list'] as $property_id) {
                        $insuranceProp = new LinkInsurancePropertyEntity(array(
                            'insurance_id' => $insurance->insurance_id,
                            'property_id'  => $property_id
                        ));
                        $propErrors = $this->entityValidator->validate($insuranceProp);
                        if (count($propErrors)) {
                            $this->entityValidator->addError($errors, 'global', 'Error saving insurance property');
                            break;
                        } else {
                            $this->linkInsurancePropertyGateway->save($insuranceProp);
                        }
                    }
                }
            } catch (\Exception $e) {
                $errors[]   = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
            }
        }

        if (count($errors)) {
            $this->insuranceGateway->rollback();
        } else {
            $this->insuranceGateway->commit();
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors,
			'lastInsertInsuranceId'	=> !$insurance->insurance_id ? $id : $insurance->insurance_id
        );
    }

    /**
     * Save vendor GL assignment from import tool
     */
    public function saveVendorGLFromImport($data) {
        // Use this to store integration package IDs
        $intPkgs = array();
        $errors  = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $integration_package_id = $intPkgs[$row['integration_package_name']];

            // Get vendor ID
            $rec = $this->vendorGateway->find(
                array('vendor_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($row['vendor_id_alt'], $integration_package_id)
            );
            $row['vendor_id'] = $rec[0]['vendor_id'];

            // Get GL Account ID
            $rec = $this->glAccountGateway->find(
                array('glaccount_number'=>'?', 'integration_package_id'=>'?'),
                array($row['glaccount_number'], $integration_package_id)
            );
            $row['glaccount_id'] = $rec[0]['glaccount_id'];

            // Save the row
            $result = $this->saveVendorGlAssignment($row);

            // Set errors
            if (!$result['success']) {
                $rowNum = $idx + 1;
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
                $errors[] = $errorMsg;

                $this->loggingService->log('error', 'Error importing vendor GL', $result['errors']);
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
    }

    /**
     * Save vendor favorite from import tool
     */
    public function saveVendorFavoriteFromImport($data) {
        // Use this to store integration package IDs
        $intPkgs = array();
        $errors  = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $integration_package_id = $intPkgs[$row['integration_package_name']];

            // Get vendor ID
            $rec = $this->vendorsiteGateway->findByVendorCode(
                $row['vendor_id_alt'],
                $integration_package_id
            );
            $row['vendorsite_id'] = $rec[0]['vendorsite_id'];

            // Get property ID
            $rec = $this->propertyGateway->find(
                array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($row['property_id_alt'], $integration_package_id)
            );
            $row['property_id'] = $rec[0]['property_id'];

            // Save the row
            $result = $this->saveVendorFavorite($row);

            // Set errors
            if (!$result['success']) {
                $rowNum = $idx + 1;
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
                $errors[] = $errorMsg;

                $this->loggingService->log('error', 'Error importing vendor favorite', $result['errors']);
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
    }

    /**
     * Save vendor favorite from import tool
     */
    public function saveVendorInsuranceFromImport($data) {
        // Use this to store integration package IDs
        $intPkgs = array();
        $errors  = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $integration_package_id = $intPkgs[$row['integration_package_name']];

            // Get vendor ID
            $rec = $this->vendorGateway->find(
                array('vendor_id_alt'=>'?', 'vendor_status'=>'?', 'integration_package_id'=>'?'),
                array($row['vendor_id_alt'], 'active', $integration_package_id)
            );
            $row['tablekey_id'] = $rec[0]['vendor_id'];
            $row['table_name'] = 'vendor';

            // Get insurance type ID
            $rec = $this->insuranceTypeGateway->find('insurancetype_name = ?', array($row['insurancetype_name']));
            $row['insurancetype_id'] = $rec[0]['insurancetype_id'];

            // Get property ID
            $prop = $this->propertyGateway->find(
                array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($row['property_id_alt'], $integration_package_id)
            );
            
            // If insurance record is to be updated, figure out ID
            $rec = $this->insuranceGateway->find(
                array('table_name'=>'?', 'tablekey_id'=>'?', 'insurance_policynum'=>'?'),
                array($row['table_name'], $row['tablekey_id'], $row['insurance_policynum'])
            );
            if (count($rec)) {
                $row['insurance_id'] = $rec[0]['insurance_id'];
            }

            // Format dates properly
            $row['insurance_policy_effective_datetm'] = $this->convertInsuranceDate($row['insurance_policy_effective_datetm']);
            $row['insurance_expdatetm'] = $this->convertInsuranceDate($row['insurance_expdatetm']);

            $insuranceData = array(
                'insurance'        => $row,
                'property_id_list' => array($prop[0]['property_id'])
            );
            
            // Save the row
            $result = $this->saveInsurance($insuranceData);

            // Set errors
            if (!$result['success']) {
                $rowNum = $idx + 1;
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$rowNum}";
                $errors[] = $errorMsg;

                $this->loggingService->log('error', 'Error importing vendor insurance', $result['errors']);
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
    }

    protected function convertInsuranceDate($date) {
        $date = substr($date, 4, 4) . '-' . substr($date, 0, 2) . '-' . substr($date, 2, 2);
        $date .= ' 00:00:00';
        $date = \DateTime::createFromFormat('Y-m-d H:i:s', $date);

        return \NP\util\Util::formatDateForDB($date);
    }

	/**
	 * Check user's rights to approve
	 *
	 * @param $userprofile_id
	 * @param $role_id
	 * @return bool
	 */
	public function isApprovalRights($userprofile_id = null, $role_id = null) {
		if (!$userprofile_id || !$role_id) {
			return [
				'success'	=> false,
				'errors'	=> ['field'=>'global', 'msg'=>'Empty userprofile or user role', 'extra'=>null]
			];
		}
		return [
			'success'	=> true,
			'ap_count'	=> $this->userprofileGateway->isInAppUser($role_id, $userprofile_id)
		];
	}

	/**
	 * Delete vendor and all dependencies
	 *
	 * @param $vendor_id
	 * @param $vendorsite_id
	 */
	public function deleteVendor($vendor_id, $vendorsite_id) {
		$ready = $this->vendorGateway->isReadyToDeleteVendor($vendor_id);

		if ($ready) {
			$this->vendorsiteGateway->deleteVendorFavorite($vendorsite_id);
			$this->addressGateway->delete(['table_name' => '?', 'tablekey_id' => '?'], ['vendorsite', $vendorsite_id]);
			$this->phoneGateway->delete(['table_name' => '?', 'tablekey_id' => '?'], ['vendorsite', $vendorsite_id]);
			$this->emailGateway->delete(['table_name' => '?', 'tablekey_id' => '?'], ['vendorsite', $vendorsite_id]);
			$this->phoneGateway->deleteByTablenameAndKey('vendorsite', $vendorsite_id);
			$this->contactGateway->delete(['table_name' => '?', 'tablekey_id' => '?'], ['vendorsite', $vendorsite_id]);
			$this->vendorGateway->deleteAssignedGlaccounts($vendor_id);
			$this->insuranceGateway->deleteInsuranceLinkProperty($vendor_id, 'vendor');
			$this->insuranceGateway->delete(['tablekey_id' => '?', 'table_name' => '?'], [$vendor_id, 'vendor']);
			$this->vendorGateway->deleteVendorCategory($vendor_id);
			$this->vendorsiteGateway->delete(['vendorsite_id' => '?'], [$vendorsite_id]);
			$this->vendorGateway->delete(['vendor_id' => '?'], [$vendor_id]);
		}
	}

	/**
	 * Retrieve alternate addresses
	 *
	 * @param null $vendor_id
	 * @param null $vendorsite_id
	 * @param bool $returnAll
	 * @return array|bool
	 */
	public function findAlternateAddresses($vendor_id = null, $vendorsite_id = null, $returnAll = false) {
		return $this->vendorsiteGateway->findAlternateAddresses($vendor_id, $vendorsite_id, $returnAll);
	}

	/**
	 * Active vendor
	 *
	 * @param $vendor_id
	 * @param $vendorsite_id
	 * @param $userprofile_id
	 * @param $active_status
	 */
	public function vendorActive($vendor_id, $vendorsite_id, $userprofile_id, $active_status) {
		$this->vendorGateway->update(['vendor_status' => $active_status], ['vendor_id' => '?'], [$vendor_id]);
		$this->vendorsiteGateway->vendorsiteActive($vendor_id, $active_status);
		$this->configService->saveAuditLog($userprofile_id, $vendorsite_id, 5, 'vendor_status', $active_status);
	}

	/**
	 * Reject vendor
	 *
	 * @param $vendor_id
	 * @param $vendor_note
	 * @param $userprofile_id
	 * @return array
	 */
	public function vendorReject($vendor_id, $vendor_note, $userprofile_id) {
		$this->vendorGateway->vendorReject($vendor_id, $vendor_note, $userprofile_id);
		$this->configService->saveAuditLog($userprofile_id, $vendor_id, 5, 'vendor_status', 'rejected', 'auditvendor');
		$this->vendorsiteGateway->update(['vendorsite_status' => 'rejected'], ['vendor_id' => '?', 'vendorsite_status' => '?']. [$vendor_id, 'forapproval']);
		$messagetype_id = $this->messageGateway->findMessageType('Alert');
		$result = $this->saveMessages($vendor_id, $messagetype_id, 'vendor', 'Rejected');
		if (!$result['success']) {
			return $result;
		}

	}

	/**
	 * Save messages
	 *
	 * @param $vendor_id
	 * @return array
	 */
	public function saveMessages($tablekey_id, $messagetype_id, $table_name,$message_flagstatus) {
		$message = new MessageEntity();
		$message->messagetype_id = $messagetype_id;
		$message->table_name = $table_name;
		$message->tablekey_id = $tablekey_id;
		$message->message_flagstatus = $message_flagstatus;
		$message->message_datetm = Util::formatDateForDB(new \DateTime());

		$errors = $this->entityValidator->validate($message);

		if (count($errors) == 0 ) {

			$this->messageGateway->beginTransaction();
			try {
				$id = $this->messageGateway->save($message);
				$this->messageGateway->commit();
			} catch (\Exception $e) {
				$this->messageGateway->rollback();
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		return [
			'success'    			=> (count($errors)) ? false : true,
			'errors'				=> $errors
		];
	}


	/**
	 * Approve vendor
	 *
	 * @param null $aspClientId
	 * @param $vendorId
	 * @param $approvalTrackingId
	 * @param $approvalStatus
	 */
	public function vendorApprove($aspClientId = null,  $vendorId, $approvalTrackingId, $approvalStatus, $vendorsite_id) {

		$result = $this->vendorGateway->approveVendor($aspClientId, $vendorId, $approvalTrackingId, $approvalStatus);
		if ($result['local_vendorsite_id']) {
			$this->vendorsiteApprove($aspClientId, $result['local_vendorsite_id'], $approvalStatus);
		}
		$sitecount = $this->vendorsiteGateway->findSiteCount($vendorId);
		if ($sitecount == 0) {
			$this->vendorGateway->deleteAssignedGlaccounts($vendorId);
			$this->vendorGateway->delete(['vendor_id' => '?'], [$vendorId]);
		}
		$message_type_id = $this->messageGateway->findMessageType('Alert');
		$this->saveMessages($approvalTrackingId, $message_type_id, 'vendor', 'Approved');
	}

	/**
	 * Approve vendorsite
	 *
	 * @param $asp_client_id
	 * @param $vendor_id
	 * @param $vendorsite_id
	 * @param $userprofile_id
	 * @param $approvalStatus
	 * @param bool $skipMessages
	 */
	public function vendorsiteApprove($asp_client_id, $vendorsite_id, $approvalStatus, $skipMessages = true) {
		$approval_tracking_id= $this->vendorsiteGateway->findApproval($vendorsite_id, $asp_client_id);
		$vendorsite = $this->vendorsiteGateway->vendorsiteApprove($asp_client_id, $approval_tracking_id, $vendorsite_id, $approvalStatus);

		if (is_array($vendorsite)) {
			$address = $this->vendorsiteGateway->findAddressAndPhoneInfoByVendorsiteId($vendorsite_id, $asp_client_id);
			if (isset($address['address_id'])) {
				$this->addressGateway->update(
					[
						'addresstype_id'	=> $vendorsite['addresstype_id'],
						'address_line1'		=> $vendorsite['address_line1'],
						'address_line2'		=> $vendorsite['address_line2'],
						'address_city'		=> $vendorsite['address_city'],
						'address_state'		=> $vendorsite['address_state'],
						'address_zip'		=> $vendorsite['address_zip'],
						'address_zipext'	=> $vendorsite['address_zipext']
					],
					['address_id' => '?'],
					[$address['address_id']]
				);
				$this->phoneGateway->update(
					[
						'phone_number'		=> $vendorsite['site_phone_number'],
						'phone_ext'			=> $vendorsite['site_phone_ext']
					],
					['phone_id' => '?'],
					[$address['site_phone_id']]
				);
				$this->phoneGateway->update(
					[
						'phone_number'	=> $vendorsite['site_fax_number']
					],
					['phone_id'	=> '?'],
					[$address['site_fax_id']]
				);
				$this->emailGateway->update(
					[
						'email_address'	=> $vendorsite['site_email_address']
					],
					['email_id' => '?'],
					[$address['site_email_id']]
				);
				$this->personGateway->update(
					[
						'person_firstname'	=> $vendorsite['person_firstname'],
						'person_lastname'	=> $vendorsite['person_lastname']
					],
					['person_id' => '?'],
					[$address['person_id']]
				);
				$this->phoneGateway->update(
					[
						'phone_number'	=> $vendorsite['contact_phone_number'],
						'phone_ext'		=> $vendorsite['contact_phone_ext'],
					],
					['phone_id' => '?'],
					[$address['contact_phone_id']]
				);
			}

			$this->vendorsiteGateway->deleteVendorFavorite($vendorsite_id);
			$this->vendorsiteGateway->delete(['vendorsite_id' => '?'], [$vendorsite_id]);
			$this->addressGateway->delete(['table_name' => '?', 'tablekey_id' => '?'], ['vendorsite', $vendorsite_id]);
			$this->phoneGateway->delete(['table_name' => '?', 'tablekey_id' => '?'], ['vendorsite', $vendorsite_id]);
			$this->emailGateway->delete(['table_name' => '?', 'tablekey_id' => '?'], ['vendorsite', $vendorsite_id]);
			$this->phoneGateway->deleteByTablenameAndKey('vendorsite', $vendorsite_id);
		}

		if (!$skipMessages) {
			$messagetype_id = $this->messageGateway->findMessageType('Alert');
			$result = $this->saveMessages($approval_tracking_id, $messagetype_id, 'vendorsite', 'Approved');
		}
	}

	public function vendorViewSiteSave($data) {
		$on_approval_status =	$this->configService->get('PN.VendorOptions.OnApprovalStatus');
		$compare_date = [
			'phone_number'		=> is_null($data['vendorsite_phone']['phone_number']) ? '' : $data['vendorsite_phone']['phone_number'],
			'fax'				=> is_null($data['vendorsite_fax_phone']['phone_number']) ? '' : $data['vendorsite_fax_phone']['phone_number'],
			'address_line1'		=> is_null($data['address']['address_line1']) ? '' : $data['address']['address_line1'],
			'address_line2'		=> is_null($data['address']['address_line2']) ? '' : $data['address']['address_line2'],
			'address_city'		=> is_null($data['address']['address_city']) ? '' : $data['address']['address_city'],
			'address_state'		=> is_null($data['address']['address_state']) ? '' : $data['address']['address_state'],
			'address_zip'		=> is_null($data['address']['address_zip']) ? '' : $data['address']['address_zip'],
			'address_zipext'		=> is_null($data['address']['address_zipext']) ? '' : $data['address']['address_zipext'],
			'address_country'		=> is_null($data['address']['address_country']) ? '' : $data['address']['address_country'],
			'person_firstname'		=> is_null($data['person']['person_firstname']) ? '' : $data['person']['person_firstname'],
			'person_lastname'		=> is_null($data['person']['person_lastname']) ? '' : $data['person']['person_lastname'],
			'phone_number'		=> is_null($data['attention_phone']['phone_number']) ? '' : $data['attention_phone']['phone_number']
		];
		$vendorsite_transfer_compare = $this->vendorGateway->transferCompareVendor($data['vendor']['vendor_id'], null, $compare_date);
		$aspClientId = $this->configService->getClientId();

		if (!$data['vendorsite']['vendorsite_id']) {
			$vendorsitecode = $this->vendorsiteGateway->getVendositeCode($data['vendor']['vendor_id'], $data['address']['address_city'], null, $aspClientId);
		} else {
			$result = $this->vendorsiteGateway->getCurrentCityAndVendorsiteCode($data['vendorsite']['vendorsite_id'], $aspClientId);
			if ($result['address_city'] !== $data['address']['address_city'] || is_null($result['address_city'])) {
				$vendorsitecode = $this->vendorsiteGateway->getVendositeCode($data['vendor']['vendor_id'], $data['address']['address_city'], null, $aspClientId);
			}
		}
		if (!$data['vendorsite']['vendorsite_id']) {
			$out_vendorsite_id = null;
			$out_approval_tracking_id = null;
		} else {
			$out_vendorsite_id = $data['vendorsite']['vendorsite_id'];
			$out_approval_tracking_id = $data['vendorsite']['vendorsite_id'];
		}

		$in_app_user = $this->userprofileGateway->isInAppUser($data['role_id'], $data['userprofile_id']);

		if (is_null($out_vendorsite_id) && $data['vendor']['vendor_status'] !== 'forapproval') {
			$vendorsite_status = !$in_app_user ? 'forapproval' : $on_approval_status;
		} else {
			if (is_null($out_vendorsite_id) && $data['vendor']['vendor_status'] == 'forapproval') {
				if ($out_approval_tracking_id !== $data['vendor']['vendor_id']) {
					$out_vendor_id = $out_approval_tracking_id;
				}
				$vendorsite_status = !$in_app_user ? 'forapproval' : $on_approval_status;
			} else {
				if ($out_vendorsite_id) {
					$vendorsite_status = !$in_app_user ? 'forapproval' : $data['vendorsite']['vendorsite_status'];
					if ($data['vendorsite']['vendorsite_status'] !== 'forapproval' && !$in_app_user) {
						$out_vendorsite_id = null;
						$moddate = Util::formatDateForDB(new \DateTime());
					}
				}
			}
		}

		if (is_null($out_vendorsite_id)) {
			if (!$data['vendorsite']['term_id']) {
				$out_term_id = $data['vendor']['term_id'];
			}
			if (!$data['vendorsite']['paygroup_code']) {
				$out_paygroup_code = $data['vendor']['paygroup_code'];
			}
		}
		if ($out_vendorsite_id == null) {

			$vendorsite = new VendorsiteEntity();
			$vendorsite->vendorsite_id_alt = $data['vendorsite']['vendorsite_id_alt'];
			$vendorsite->vendor_id = $data['vendor']['vendor_id'];
			$vendorsite->vendorsite_code = $vendorsitecode;
			$vendorsite->term_id = $out_term_id;
			$vendorsite->bill_contact_id = $data['vendorsite']['bill_contact_id'];
			$vendorsite->shipvia_code = $data['vendorsite']['shipvia_code'];
			$vendorsite->paygroup_code = $out_paygroup_code;
			$vendorsite->freightterms_code = $data['vendorsite']['freightterms_code'];
			$vendorsite->vendorsite_reject_note = $data['vendorsite']['vendorsite_reject_note'];
			$vendorsite->vendorsite_ship_to_location_id = 1;
			$vendorsite->vendorsite_bill_to_location_id = 1;
			$vendorsite->vendorsite_discount_exclude_freight = $data['vendorsite']['vendorsite_discount_exclude_freight'];
			$vendorsite->vendorsite_status = $vendorsite_status;
			$vendorsite->approval_tracking_id = $out_approval_tracking_id;
			$vendorsite->submit_userprofile_id = $data['userprofile_id'];
			$vendorsite->vendorsite_lastupdate_date = $moddate;
			$vendorsite->vendor_universalfield1 = $data['vendorsite']['vendor_universalfield1'];
			$vendorsite->vendorsite_display_account_number_po = $data['vendorsite']['vendorsite_display_account_number_po'];
			$vendorsite->vendorsite_account_number = $data['vendorsite']['vendorsite_account_number'];

			$result = $this->saveVendorsite($vendorsite);
			if (!$result['success']) {
				return $result;
			}

			$out_vendorsite_id = $result['lastInsertId'];
			if (!$out_approval_tracking_id) {
				$this->vendorsiteGateway->update(
					['approval_tracking_id' => $out_vendorsite_id],
					['vendorsite_id' => '?'],
					[$out_vendorsite_id]
				);
			}
		}

	}

	/**
	 * Reject vendor
	 *
	 * @param null $vendor_id
	 * @param null $reject_note
	 * @param null $userprofile_id
	 * @return array
	 */
	public function rejectVendor($vendor_id = null, $reject_note = null, $userprofile_id = null) {
		if (!$vendor_id || !$reject_note || !$userprofile_id) {
			return [
				'success'	=> false,
				'errors'	=> ['field'=>'global', 'msg'=> 'Can\'t reject vendor!', 'extra'=>null]
			];
		}
		$this->vendorGateway->vendorReject($vendor_id, $reject_note, $userprofile_id);
		$messageType = $this->messageGateway->findMessageType('Alert');
		$this->saveMessages($vendor_id, $messageType, 'vendor', 'Rejected');

		return [
			'success'	=> true,
			'errors'	=> []
		];
	}

	/**
	 * @param $glaccounts
	 * @param $vendor_id
	 * @return array|bool
	 */
	public function refreshGlAccounts($glaccounts = null, $vendor_id = null) {
		if (!$vendor_id) {
			return [
				'success'		=> false,
				'errors'		=> [array('field'=>'global', 'msg'=>'Cannot assign glaccounts', 'extra'=>null)]
			];
		}
		if ($glaccounts == '') {
			$this->vendorGateway->deleteAssignedGlaccounts($vendor_id);
		} else {
			if (!$this->vendorsiteGateway->assignGlAccounts($glaccounts, $vendor_id)) {
				return [
					'success'		=> false,
					'errors'		=> [array('field'=>'global', 'msg'=>'Cannot assigns glaccounts', 'extra'=>null)]
				];
			}
		}
		return true;
	}

	/**
	 * Retrieve images list
	 *
	 * @param null $vendor_id
	 * @return array|bool
	 */
	public function findImages($vendor_id = null) {
		if (!$vendor_id) {
			return [];
		}

		$images = $this->imageIndexGateway->findEntityImages($vendor_id, 'Vendor');

		return $images;
	}

	/**
	 * Save insurances
	 *
	 * @param null $vendor_id
	 * @param null $insurances
	 * @param int $insuranceExpires
	 * @return array
	 * @throws \NP\core\Exception
	 */
	public function saveInsurances($vendor_id = null, $insurances = null, $insuranceExpires = 0) {
		if ($vendor_id) {
			$insurances = json_decode($insurances);
			$savedInsurances = [];
			if (count($insurances) > 0) {
				if ($insuranceExpires > 0) {
					$this->vendorsiteGateway->update(
						['vendorsite_DaysNotice_InsuranceExpires' => $insuranceExpires],
						['vendor_id' => '?'],
						[$vendor_id]
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
							'insurance_id'							=> $insurance->insurance_id[$index],
							'tablekey_id'							=> $vendor_id,
							'table_name'								=> 'vendor'
						];

						$result = $this->saveInsurance(['insurance' => $saveInsurance], $vendor_id);

						if (!$result['success']) {
							throw new \NP\core\Exception("Cannot save insurance");
						}
						$savedInsurances[] = $result['lastInsertInsuranceId'];

					}
				} else {
					$insurance->tablekey_id = $vendor_id;
					$insurance->table_name = 'vendor';
					$result = $this->saveInsurance(['insurance' => (array)$insurance], $vendor_id);
					if (!$result['success']) {
						throw new \NP\core\Exception("Cannot save insurance");
					}
					$savedInsurances[] = $result['lastInsertInsuranceId'];
				}
			}

			$this->insuranceGateway->deleteInsuranceList($savedInsurances, 'vendor', $vendor_id);

			return [
				'success'	=> true
			];
		}

		return [
			'success'	=> false
		];
	}

}