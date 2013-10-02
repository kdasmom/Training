<?php

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\db\Adapter;
use NP\core\Config;
use NP\contact\StateGateway;
use NP\user\UserprofileGateway;

class UserImportEntityValidator extends AbstractImportEntityValidator {
    protected $roleGateway;

    public function __construct(LocalizationService $localizationService, Adapter $adapter,
                                Config $config, StateGateway $stateGateway,
                                UserprofileGateway $userprofileGateway) {
        parent::__construct($localizationService, $adapter);

        $this->config             = $config;
        $this->stateGateway       = $stateGateway;
        $this->userprofileGateway = $userprofileGateway;
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

            // Validate the home phone number
            if ($entity->home_phone_number != '') {
                $phoneValidator = $this->createValidator('usPhone', array(), 'home_phone_number');
                if (!$phoneValidator->isValid($entity->home_phone_number)) {
                    $this->addError($errors, 'home_phone_number', 'importFieldPhoneError');
                }
            }

            // Validate the work phone number
            if ($entity->work_phone_number != '') {
                $phoneValidator = $this->createValidator('usPhone', array(), 'work_phone_number');
                if (!$phoneValidator->isValid($entity->work_phone_number)) {
                    $this->addError($errors, 'work_phone_number', 'importFieldPhoneError');
                }
            }
        }

        // Validate the username (must be unique)
        $rec = $this->userprofileGateway->find('u.userprofile_username = ?', array($entity->userprofile_username));

        if (!empty($rec)) {
            $this->addError($errors, 'userprofile_username', 'importFieldUsernameUniqueError');
        }

        return $errors;
    }
}