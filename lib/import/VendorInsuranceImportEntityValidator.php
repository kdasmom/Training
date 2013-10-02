<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/27/13
 * Time: 11:23 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\db\Adapter;
use NP\system\IntegrationPackageGateway;
use NP\vendor\VendorGateway;
use NP\property\PropertyGateway;

class VendorInsuranceImportEntityValidator extends AbstractImportEntityValidator {

    protected $integrationPackageGateway, $propertyGateway, $vendorGateway, $vendorFavoriteGateway;

    public function __construct(LocalizationService $localizationService, Adapter $adapter,
                                IntegrationPackageGateway $integrationPackageGateway,
                                VendorGateway $vendorGateway, PropertyGateway $propertyGateway) {
        parent::__construct($localizationService, $adapter);

        $this->integrationPackageGateway = $integrationPackageGateway;
        $this->vendorGateway             = $vendorGateway;
        $this->propertyGateway           = $propertyGateway;
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
                array('vendor_id_alt'=>'?', 'vendor_status'=>'?', 'integration_package_id'=>'?'),
                array($entity->vendor_id_alt, 'active', $intPkg[0]['integration_package_id'])
            );
            
            if (empty($vendor)) {
                $this->addError($errors, 'vendor_id_alt', 'importFieldVendorCodeError');
            }

            // Validate property
            $prop = $this->propertyGateway->find(
                array('property_id_alt' => '?', 'integration_package_id'=> '?'),
                array($entity->property_id_alt, $intPkg[0]['integration_package_id'])
            );

            if (empty($prop)) {
                $this->addError($errors, 'property_id_alt', 'importFieldPropertyCodeError');
            }
        } else {
            $this->addError($errors, 'vendor_id_alt', 'importFieldDependentIntPkgError');
            $this->addError($errors, 'property_id_alt', 'importFieldDependentIntPkgError');
        }

        return $errors;
    }
}
