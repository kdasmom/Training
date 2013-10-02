<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/20/13
 * Time: 10:48 AM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\db\Adapter;
use NP\system\IntegrationPackageGateway;
use NP\vendor\VendorsiteGateway;
use NP\vendor\VendorFavoriteGateway;
use NP\property\PropertyGateway;

class VendorFavoriteImportEntityValidator extends AbstractImportEntityValidator {

    protected $integrationPackageGateway, $propertyGateway, $vendorGateway, $vendorFavoriteGateway;

    public function __construct(LocalizationService $localizationService, Adapter $adapter,
                                IntegrationPackageGateway $integrationPackageGateway,
                                VendorsiteGateway $vendorsiteGateway, PropertyGateway $propertyGateway,
                                VendorFavoriteGateway $vendorFavoriteGateway) {
        parent::__construct($localizationService, $adapter);

        $this->integrationPackageGateway = $integrationPackageGateway;
        $this->propertyGateway           = $propertyGateway;
        $this->vendorsiteGateway         = $vendorsiteGateway;
        $this->vendorFavoriteGateway     = $vendorFavoriteGateway;
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
            $vendorsite = $this->vendorsiteGateway->findByVendorCode(
                $entity->vendor_id_alt,
                $intPkg[0]['integration_package_id']
            );
            
            if (empty($vendorsite)) {
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

            // Check if record already exists
            if (!empty($vendorsite) && !empty($prop)) {
                $rec = $this->vendorFavoriteGateway->find(
                    array('vendorsite_id'=>'?', 'property_id'=>'?'),
                    array($vendorsite[0]['vendorsite_id'], $prop[0]['property_id'])
                );

                if (!empty($rec)) {
                    $this->addError($errors, 'global', 'importFieldVendorFavoriteExistsError');
                }
            }
        } else {
            $this->addError($errors, 'vendor_id_alt', 'importFieldDependentIntPkgError');
            $this->addError($errors, 'property_id_alt', 'importFieldDependentIntPkgError');
        }

        return $errors;
    }

}
