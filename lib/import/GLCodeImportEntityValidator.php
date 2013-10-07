<?php

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\db\Adapter;
use NP\system\IntegrationPackageGateway;
use NP\gl\GLAccountGateway;

class GLCodeImportEntityValidator extends AbstractImportEntityValidator {

    protected $integrationPackageGateway, $glAccountGateway;

    public function __construct(LocalizationService $localizationService,
                                Adapter $adapter,
                                IntegrationPackageGateway $integrationPackageGateway,
                                GLAccountGateway $glAccountGateway) {
        // Initialize the class
        parent::__construct($localizationService, $adapter);

        $this->integrationPackageGateway = $integrationPackageGateway;
        $this->glAccountGateway          = $glAccountGateway;
    }

    public function validate(\NP\core\AbstractEntity $entity) {
        $errors = parent::validate($entity);

        // Make sure the category is valid for this integration package
        $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($entity->integration_package_name)
        );

        if (!empty($intPkg)) {
            $category = $this->glAccountGateway->getCategoryByName(
                $entity->category_name,
                $intPkg[0]['integration_package_id']
            );
            if ($category === null) {
                $this->addError($errors, 'category_name', 'importFieldGLCategoryError');
            }
        } else {
            $this->addError($errors, 'category_name', 'importFieldDependentIntPkgError');
        }

        return $errors;
    }
}
