<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 3:19 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\db\Adapter;
use NP\system\IntegrationPackageGateway;
use NP\vendor\VendorGateway;
use NP\vendor\VendorGlAccountsGateway;
use NP\gl\GlAccountGateway;

class VendorGLImportEntityValidator extends AbstractImportEntityValidator {
    
    protected $integrationPackageGateway, $vendorGateway, $glAccountGateway, $glAccountGateway;

    public function __construct(LocalizationService $localizationService, Adapter $adapter,
                                IntegrationPackageGateway $integrationPackageGateway,
                                VendorGateway $vendorGateway, GlAccountGateway $glAccountGateway,
                                VendorGlAccountsGateway $vendorGlAccountsGateway) {
        parent::__construct($localizationService, $adapter);

        $this->integrationPackageGateway = $integrationPackageGateway;
        $this->vendorGateway             = $vendorGateway;
        $this->glAccountGateway          = $glAccountGateway;
        $this->vendorGlAccountsGateway   = $vendorGlAccountsGateway;
    }

    public function validate(\NP\core\AbstractEntity $entity) {
        $errors = parent::validate($entity);

        // Make sure the category is valid for this integration package
        $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($entity->integration_package_name)
        );

        if (!empty($intPkg)) {
            // Validate vendor
            $vendor = $this->vendorGateway->find(
                array('vendor_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($entity->vendor_id_alt, $intPkg[0]['integration_package_id'])
            );
            
            if (empty($vendor)) {
                $this->addError($errors, 'vendor_id_alt', 'importFieldVendorCodeError');
            }

            // Validate GL Account
            $gl = $this->glAccountGateway->find(
                array('glaccount_number' => '?', 'integration_package_id'=> '?'),
                array($entity->glaccount_number, $intPkg[0]['integration_package_id'])
            );

            if (empty($gl)) {
                $this->addError($errors, 'glaccount_number', 'importFieldGLAccountNameError');
            }

            // Check if record already exists
            if (!empty($vendor) && !empty($gl)) {
                $rec = $this->vendorGlAccountsGateway->find(
                    array('vendor_id'=>'?', 'glaccount_id'=>'?'),
                    array($vendor[0]['vendor_id'], $gl[0]['glaccount_id'])
                );

                if (!empty($rec)) {
                    $this->addError($errors, 'global', 'importFieldVendorGlExistsError');
                }
            }
        } else {
            $this->addError($errors, 'vendor_id_alt', 'importFieldDependentIntPkgError');
            $this->addError($errors, 'glaccount_number', 'importFieldDependentIntPkgError');
        }

        return $errors;
    }
}
