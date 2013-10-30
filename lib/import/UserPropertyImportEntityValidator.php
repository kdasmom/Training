<?php

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\db\Adapter;
use NP\core\Config;
use NP\contact\StateGateway;
use NP\user\UserprofileGateway;
use NP\user\PropertyUserprofileGateway;
use NP\property\PropertyGateway;

class UserPropertyImportEntityValidator extends AbstractImportEntityValidator {
    protected $userprofileGateway, $propertyGateway, $propertyUserprofileGateway;

    public function __construct(LocalizationService $localizationService, Adapter $adapter,
                                UserprofileGateway $userprofileGateway, PropertyGateway $propertyGateway,
                                PropertyUserprofileGateway $propertyUserprofileGateway) {
        parent::__construct($localizationService, $adapter);

        $this->userprofileGateway         = $userprofileGateway;
        $this->propertyGateway            = $propertyGateway;
        $this->propertyUserprofileGateway = $propertyUserprofileGateway;
    }

    public function validate(\NP\core\AbstractEntity $entity) {
        $errors = parent::validate($entity);

        // Make sure there isn't already a record for this
        $user = $this->userprofileGateway->find('u.userprofile_username = ?', array($entity->userprofile_username));
        $prop = $this->propertyGateway->find('property_id_alt = ?', array($entity->property_id_alt));

        if (!empty($user) && !empty($prop)) {
            $res = $this->propertyUserprofileGateway->find(
                array('pu.userprofile_id'=>'?', 'pu.property_id'=>'?'),
                array($user[0]['userprofile_id'], $prop[0]['property_id'])
            );

            if (!empty($res)) {
                $this->addError($errors, 'global', 'importFieldPropertyUserExistsError');
            }
        }

        return $errors;
    }
}