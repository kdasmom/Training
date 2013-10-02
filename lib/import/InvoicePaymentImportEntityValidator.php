<?php

namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\Config;
use NP\core\db\Adapter;
use NP\system\IntegrationPackageGateway;
use NP\vendor\VendorGateway;
use NP\property\PropertyGateway;
use NP\util\SoapService;

class InvoicePaymentImportEntityValidator extends AbstractImportEntityValidator {

    protected $integrationPackageGateway;

    public function __construct(LocalizationService $localizationService,
                                Adapter $adapter, IntegrationPackageGateway $integrationPackageGateway,
                                VendorGateway $vendorGateway, PropertyGateway $propertyGateway,
                                SoapService $soapService) {
        // Initialize the class
        parent::__construct($localizationService, $adapter);

        $this->integrationPackageGateway = $integrationPackageGateway;
        $this->vendorGateway             = $vendorGateway;
        $this->propertyGateway           = $propertyGateway;
        $this->soapService               = $soapService;
    }

    public function validate(\NP\core\AbstractEntity $entity) {
        $errors = parent::validate($entity);

        // Make sure the integration package is valid
        $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($entity->integration_package_name)
        );
        
        // Validate certain fields that depend on the integration package
        if (!empty($intPkg)) {
            // Validate vendor
            $vendor = $this->vendorGateway->find(
                array('vendor_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($entity->vendor_id_alt, $intPkg[0]['integration_package_id'])
            );
            
            if (empty($vendor)) {
                $this->addError($errors, 'vendor_id_alt', 'importFieldVendorCodeError');
            }

            // Validate property
            $prop = $this->propertyGateway->find(
                array('property_id_alt'=>'?', 'integration_package_id'=>'?'),
                array($entity->property_id_alt, $intPkg[0]['integration_package_id'])
            );
            
            if (empty($prop)) {
                $this->addError($errors, 'property_id_alt', 'importFieldPropertyCodeError');
            }
        }
        
        return $errors;
    }

    public function validateCollection(&$data) {
        $xml = "<PN_VALIDATE_XML xmlns=\"http://tempuri.org/\">
                <xml><![CDATA[
                     <INVOICEPAYMENTS xmlns=''>";
        
        $hasOneValid = false;
        foreach ($data as $idx=>$row) {
            if ($data[$idx]['validation_status'] == 'valid') {
                $hasOneValid = true;
                $invoice_datetm = \DateTime::createFromFormat('m/d/Y', $row['invoice_datetm']);
                $invoice_datetm = $invoice_datetm->format('Y-m-d');
                $invoicepayment_datetm = \DateTime::createFromFormat('m/d/Y', $row['invoicepayment_datetm']);
                $invoicepayment_datetm = $invoicepayment_datetm->format('Y-m-d');
                $xml .= "<INVOICEPAYMENT>
                            <Business_unit>{$row['property_id_alt']}</Business_unit>
                            <Invoice_Id_Alt>{$row['invoice_ref']}{$row['vendor_id_alt']}</Invoice_Id_Alt>
                            <VendorSite_Id_Alt>{$row['vendor_id_alt']}</VendorSite_Id_Alt>
                            <invoice_ref>{$row['invoice_ref']}</invoice_ref>
                            <Invoice_Date>{$invoice_datetm}</Invoice_Date>
                            <Invoice_Period>{$row['invoice_period']}</Invoice_Period>
                            <Invoice_Id>0</Invoice_Id>
                            <Invoice_Payment_Id_alt>{$row['invoicepayment_id_alt']}</Invoice_Payment_Id_alt>
                            <Invoice_Payment_Number>0</Invoice_Payment_Number>
                            <Invoice_Payment_Datetm>{$invoicepayment_datetm}</Invoice_Payment_Datetm>
                            <Invoice_Payment_CheckNum>{$row['invoicepayment_checknum']}</Invoice_Payment_CheckNum>
                            <Invoice_Payment_Amount>{$row['invoicepayment_amount']}</Invoice_Payment_Amount>
                            <Invoice_Payment_Status>".strtolower($row['invoicepayment_status'])."</Invoice_Payment_Status>
                        </INVOICEPAYMENT>";
            }
        }

        $xml .=     "</INVOICEPAYMENTS>
                ]]></xml>
                <methodname>invoicepayment</methodname>
            </PN_VALIDATE_XML>";
        
        if ($hasOneValid) {
            $soapSettings = $this->soapService->getSettings();

            $res = $this->soapService->request($soapSettings['wsdl_url'], $xml);

            if (array_key_exists('soapResult', $res)) {
                $success = (string)$res['soapResult']->PN_VALIDATE_XMLResult;
                if ($success !== 'True') {
                    $this->addRowErrors($data);
                }
            } else {
                $this->addRowErrors($data);
            }
        }
    }

    public function addRowErrors(&$data) {
        foreach ($data as $idx=>$row) {
            if ($data[$idx]['validation_status'] == 'valid') {
                $data[$idx]['validation_status'] = 'invalid';
                $data[$idx]['validation_errors']['global'] = $this->localizationService->getMessage('importGlobalError');
            }
        }
    }
}
