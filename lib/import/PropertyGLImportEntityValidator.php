<?php

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\db\Adapter;
use NP\system\IntegrationPackageGateway;
use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\property\PropertyGlAccountGateway;

class PropertyGLImportEntityValidator extends AbstractImportEntityValidator {

    protected $integrationPackageGateway, $glAccountGateway, $propertyGlAccountGateway;

    public function __construct(LocalizationService $localizationService,
                                Adapter $adapter,
                                IntegrationPackageGateway $integrationPackageGateway,
                                PropertyGateway $propertyGateway, GLAccountGateway $glAccountGateway,
                                PropertyGlAccountGateway $propertyGlAccountGateway) {
        // Initialize the class
        parent::__construct($localizationService, $adapter);

        $this->integrationPackageGateway = $integrationPackageGateway;
        $this->propertyGateway           = $propertyGateway;
        $this->glAccountGateway          = $glAccountGateway;
        $this->propertyGlAccountGateway  = $propertyGlAccountGateway;
    }

    public function validate(\NP\core\AbstractEntity $entity) {
        $errors = parent::validate($entity);

        // Make sure the category is valid for this integration package
        $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($entity->integration_package_name)
        );

        if (!empty($intPkg)) {
            // Validate property
            $prop = $this->propertyGateway->find(
                array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($entity->property_id_alt, $intPkg[0]['integration_package_id'])
            );
            
            if (empty($prop)) {
                $this->addError($errors, 'property_id_alt', 'importFieldPropertyCodeError');
            }

            // Validate GL account
            $gl = $this->glAccountGateway->find(
                array('glaccount_number'=>'?', 'integration_package_id'=>'?'),
                array($entity->glaccount_number, $intPkg[0]['integration_package_id'])
            );

            if (empty($gl)) {
                $this->addError($errors, 'glaccount_number', 'importFieldGLCategoryError');
            }

            if (!empty($prop) && !empty($gl)) {
                $rec = $this->propertyGlAccountGateway->find(
                    array('pg.property_id' => '?', 'pg.glaccount_id'=> '?'),
                    array($prop[0]['property_id'], $gl[0]['glaccount_id'])
                );

                if (!empty($rec)) {
                    $this->addError($errors, 'global', 'importFieldPropertyGlExistsError');
                }
            }
        } else {
            $this->addError($errors, 'property_id_alt', 'importFieldDependentIntPkgError');
            $this->addError($errors, 'glaccount_number', 'importFieldDependentIntPkgError');
        }

        return $errors;
    }
}
