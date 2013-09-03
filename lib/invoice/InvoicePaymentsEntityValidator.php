<?php

namespace NP\invoice;

use NP\property\PropertyGateway;
use NP\vendor\VendorGateway;
use NP\invoice\InvoiceGateway;
use NP\invoice\InvoicePaymentStatusGateway;
use NP\system\IntegrationPackageGateway;
use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;

class InvoicePaymentsEntityValidator extends BaseImportServiceEntityValidator{

    protected  $propertyGateway, $vendorGateway, $invoiceGateway, $invoicepaymentstatusGateway, $integrationpackageGateway;

    public function __construct(PropertyGateway $propertyGateway, VendorGateway $vendorGateway, 
            InvoiceGateway $invoiceGateway, InvoicePaymentStatusGateway $invoicepaymentstatusGateway, 
            IntegrationPackageGateway $integrationpackageGateway)
    {
        $this->propertyGateway = $propertyGateway;
        $this->vendorGateway = $vendorGateway;
        $this->invoiceGateway = $invoiceGateway;
        $this->invoicepaymentstatusGateway = $invoicepaymentstatusGateway;
        $this->integrationpackageGateway = $integrationpackageGateway;
    }

    /**
     * @param \ArrayObject $row
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator|void
     */
    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        $select = new Select();
        $select ->from('PROPERTY')
            ->columns(array('id' => 'property_id'))
            ->where("property_id_alt_ap = ? ");

        $result = $this->propertyGateway->adapter->query($select, array($row['BusinessUnit']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('PropertyCode', 'importFieldBusinessUnitError');
        }   
        
        $select = new Select();
        $select ->from('VENDOR')
            ->columns(array('id' => 'vendor_id'))
            ->where("vendor_id_alt = ? ");

        $result = $this->vendorGateway->adapter->query($select, array($row['VendorID']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('VendorID', 'importFieldVendorIDError');
        }  
        
        $select = new Select();
        $select ->from('INVOICE')
            ->columns(array('id' => 'invoice_id'))
            ->where("invoice_id = ? ");

        $result = $this->invoiceGateway->adapter->query($select, array($row['InvoiceID']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('InvoiceID', 'importFieldInvoiceIDError');
        } 
                $select = new Select();
                
        $select ->from('INVOICE')
            ->columns(array('id' => 'invoice_id'))
            ->where("paytablekey_id = ? AND paytable_name = 'vendorsite'");

        $result = $this->invoiceGateway->adapter->query($select, array($row['PaymentID']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('PaymentID', 'importFieldPaymentIDError');
        }
        
        $select ->from('INVOICEPAYMENTSTATUS')
            ->columns(array('id' => 'invoicepayment_status_id'))
            ->where("invoicepayment_status = ? ");

        $result = $this->invoicepaymentstatusGateway->adapter->query($select, array($row['PaymentStatus']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('PaymentStatus', 'importFieldPaymentStatusError');
        }
        
        $select ->from('INTEGRATIONPACKAGE')
            ->columns(array('id' => 'integration_package_id'))
            ->where("integration_package_name = ? ");

        $result = $this->integrationpackageGateway->adapter->query($select, array($row['IntegrationPackage']));

        if (empty($result)) {
            $this->addLocalizedErrorMessage('IntegrationPackage', 'importFieldIntegrationPackageError');
        }
   }
}
