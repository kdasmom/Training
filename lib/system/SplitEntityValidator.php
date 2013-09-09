<?php

namespace NP\system;

use NP\system\IntegrationPackageGateway;
use NP\vendor\VendorGateway;
use NP\property\PropertyGateway;
use NP\gl\GLAccountGateway;
use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;

class SplitEntityValidator extends BaseImportServiceEntityValidator{
    
protected $integrationPackage, $glaccountGateway, $propertyGateway, $vendorGateway;

    public function __construct(
            IntegrationPackageGateway $integrationPackage,
            VendorGateway $vendorGateway,
            PropertyGateway $propertyGateway, 
            GLAccountGateway $glaccountGateway 
    )
    {
        $this->integrationPackage = $integrationPackage;
        $this->vendorGateway = $vendorGateway;
        $this->propertyGateway = $propertyGateway;
        $this->glaccountGateway = $glaccountGateway;
    }

    /**
     * @param \ArrayObject $row
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator|void
     */
    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        $select = new Select();
        $select ->from('INTEGRATIONPACKAGE')
                ->columns(array('id' => 'integration_package_id'))
                ->where("integration_package_name = ?");

        $resultPropertyGL = $this->integrationPackage->adapter->query($select, array($row['IntegrationPackage']));

        if (empty($resultPropertyGL)) {
            $this->addLocalizedErrorMessage('IntegrationPackage', 'importFieldIntegrationPackageNameError');
        }

        $select = new Select();
        $select ->from('VENDOR')
            ->columns(array('id' => 'vendor_id'))
            ->where("vendor_id_alt = ? ");

        $result = $this->vendorGateway->adapter->query($select, array($row['VendorCode']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('VendorCode', 'importFieldVendorIDError');
        } 

        $select = new Select();
        $select ->from('PROPERTY')
            ->columns(array('id' => 'property_id'))
            ->where("property_id_alt = ? ");

        $result = $this->propertyGateway->adapter->query($select, array($row['PropertyCode']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('PropertyCode', 'importFieldPropertyCodeError');
        }   
        
        $select = new Select();
        $select ->from('GLACCOUNT')
            ->columns(array('id' => 'glaccount_id'))
            ->where("glaccount_number = ? ");

        $result = $this->glaccountGateway->adapter->query($select, array($row['GLCode']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('GLCode', 'importFieldGLCodeError');
        }
   }
}
