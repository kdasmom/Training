<?php

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\Config;
use NP\core\db\Adapter;
use NP\contact\StateGateway;

abstract class AbstractContactImportEntityValidator extends AbstractImportEntityValidator {

    protected $config, $stateGateway;

    public function __construct(LocalizationService $localizationService,
                                Adapter $adapter,
                                Config $config,
                                StateGateway $stateGateway) {
        // Initialize the class
        parent::__construct($localizationService, $adapter);

        $this->config                    = $config;
        $this->stateGateway              = $stateGateway;
    }

    public function validate(\NP\core\AbstractEntity $entity) {
        $errors = parent::validate($entity);

        $address_use_intl = $this->config->get('CP.ADDRESS_useInternational', '0');

        // If international addresses aren't valid, do some extra validation
        if ($address_use_intl != '1') {
            // Validate the US state entered
            $res = $this->stateGateway->find('state_code = ?', array($entity->address_state));
            if (empty($res)) {
                $this->addError($errors, 'address_state', 'importFieldStateError');
            }

            // Validate the zip code
            if ($entity->address_zip != '') {
                $zip = explode('-', $entity->address_zip);
                $zipValidator = $this->createValidator('digits', array(), 'address_zip');
                if (!$zipValidator->isValid($zip[0]) || (count($zip) > 1 && !$zipValidator->isValid($zip[1]))) {
                    $this->addError($errors, 'address_zip', 'importFieldZipError');
                }
            }

            // Validate the phone number
            if ($entity->phone_number != '') {
                $phoneValidator = $this->createValidator('usPhone', array(), 'phone_number');
                if (!$phoneValidator->isValid($entity->phone_number)) {
                    $this->addError($errors, 'phone_number', 'importFieldPhoneError');
                }
            }

            // Validate the fax number
            if ($entity->fax_number != '') {
                $phoneValidator = $this->createValidator('usPhone', array(), 'fax_number');
                if (!$phoneValidator->isValid($entity->fax_number)) {
                    $this->addError($errors, 'fax_number', 'importFieldFaxError');
                }
            }
        }

        return $errors;
    }
}
