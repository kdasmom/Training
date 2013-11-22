<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 11/22/13
 * Time: 11:33 AM
 */

namespace NP\vendor\validation;


use NP\core\AbstractEntity;
use NP\core\db\Adapter;
use NP\core\validation\EntityValidator;
use NP\locale\LocalizationService;
use NP\system\ConfigService;

class VendorEntityValidator extends EntityValidator{

	protected $localizationService, $vendorGateway, $configService;

	public function __construct(LocalizationService $localizationService, Adapter $adapter, VendorGateway $vendorGateway, ConfigService $configService) {
		parent::__construct($localizationService, $adapter);

		$this->localizationService = $localizationService;
		$this->vendorGateway = $vendorGateway;
		$this->configService = $configService;
	}

	public function validate(AbstractEntity $entity) {
		$errors = parent::validate($entity);
		if ($entity->approval_tracking_id) {
			$approval_tracking_id = $entity->approval_tracking_id;
		} else {
			$approval_vendor_id = $this->vendorGateway->find(['v.vendor_id' => '?'], [$entity->vendor_id], null, ['approval_tracking_id']);
			$approval_tracking_id = count($approval_vendor_id) > 0 ? $approval_vendor_id[0]['approval_tracking_id'] : null;
		}

		$data = [
			'asp_client_id'				=> $this->configService->getClientId(),
			'approval_tracking_id'		=> $approval_tracking_id,
			'vendor_id'					=> $entity->vendor_id,
			'vendor_name'				=> $this->configService->get('PN.VendorOptions.VendorCapsOn') ? strtoupper($entity->vendor_name) : $entity->vendor_name,
			'vendor_fed_id'				=> !empty($entity->vendor_fedid) ? $entity->vendor_fedid : null,
			'vendor_id_alt'				=> $this->configService->get('PN.VendorOptions.VendorCapsOn') ? strtoupper($entity->vendor_id_alt) : $entity->vendor_id_alt,
			'use_vendor_name'			=> $this->configService->get('PN.VendorOptions.ValidateName'),
			'use_vendor_fed_id'			=> $this->configService->get('PN.VendorOptions.ValidateTaxId'),
			'use_vendor_id_alt'			=> $this->configService->get('PN.VendorOptions.ValidateIdAlt'),
			'integration_package_id'	=> $entity->integration_package_id
		];

		$vendor_id = null;
		$vendor_name = '';
		$check_status = 'name';

		if ($data['use_vendor_name']) {
			$vendor_id = $this->vendorGateway->checkVendorName($data['use_vendor_name'], $data['vendor_name'], $data['approval_tracking_id'], $data['integration_package_id'], $data['asp_client_id']);
		}

		if (is_null($vendor_id)) {
			$result = $this->vendorGateway->checkByVendorFedId($data['use_vendor_fed_id'], $data['vendor_fed_id'], $data['approval_tracking_id'], $data['integration_package_id'], $data['asp_client_id']);
			$vendor_id = $result['vendor_id'];
			$vendor_name = $result['vendor_name'];

			if (!is_null($vendor_id)) {
				$check_status = 'taxid';
			} else {
				$result = $this->vendorGateway->checkByVendorAlt($data['use_vendor_id_alt'], $data['vendor_id_alt'], $data['approval_tracking_id'], $data['integration_package_id'], $data['asp_client_id']);

				$vendor_id = $result['vendor_id'];
				$vendor_name = $result['vendor_name'];
				$check_status = $result['check_status'];
			}
		}

		if ($check_status !== VendorService::VALIDATE_CHECK_STATUS_OK) {
			if ($check_status == VendorService::VALIDATE_CHECK_STATUS_ID_ALT) {
				$this->addError($errors, 'vendor_id_alt', 'The vendor ' . $entity->vendor_name . '  already uses this Vendor Id. Please update that vendor or select a different Vendor ID.');
			}
			if ($check_status == VendorService::VALIDATE_CHECK_STATUS_NAME) {
				$this->addError($errors, 'vendor_name', 'A vendor with this name already exists.');
			}
			if ($check_status == VendorService::VALIDATE_CHECK_STATUS_TAX_ID) {
				$this->addError($errors, 'vendor_name', 'A vendor with this name already exists.');
			}
		}

		return [
			'vendor_id'			=> $vendor_id,
			'vendor_name'		=> $vendor_name,
			'check_status'		=> $check_status
		];
	}
} 