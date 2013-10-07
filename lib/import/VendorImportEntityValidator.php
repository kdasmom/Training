<?php
namespace NP\import;

use NP\locale\LocalizationService;
use NP\core\Config;
use NP\core\db\Adapter;
use NP\system\IntegrationPackageGateway;
use NP\contact\StateGateway;
use NP\vendor\VendorTypeGateway;
use NP\gl\GLAccountGateway;
use NP\util\SoapService;

/**
 * Entity class for importing vendors
 *
 * @author Thomas Messier
 */
class VendorImportEntityValidator extends AbstractContactImportEntityValidator {

    protected $integrationPackageGateway, $vendorTypeGateway, $glAccountGateway, $soapService;

    public function __construct(LocalizationService $localizationService,
                                Adapter $adapter, Config $config,
                                IntegrationPackageGateway $integrationPackageGateway,
                                StateGateway $stateGateway, VendorTypeGateway $vendorTypeGateway,
                                GLAccountGateway $glAccountGateway, SoapService $soapService) {
        // Initialize the class
        parent::__construct($localizationService, $adapter, $config, $stateGateway);

        $this->integrationPackageGateway = $integrationPackageGateway;
        $this->vendorTypeGateway         = $vendorTypeGateway;
        $this->glAccountGateway          = $glAccountGateway;
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
            // Validate the vendor type
            $rec = $this->vendorTypeGateway->find(
                array('vendortype_code' => '?', 'integration_package_id' => '?'),
                array($entity->vendortype_code, $intPkg[0]['integration_package_id'])
            );

            if (empty($rec)) {
                $this->addError($errors, 'vendortype_code', 'importFieldVendorTypeError');
            }
            
            // Validate the default glaccount if not blank
            if ($entity->default_glaccount_number != '') {
                $rec = $this->glAccountGateway->find(
                    array('glaccount_number' => '?', 'integration_package_id' => '?'),
                    array($entity->default_glaccount_number, $intPkg[0]['integration_package_id'])
                );

                if (empty($rec)) {
                    $this->addError($errors, 'default_glaccount_number', 'importFieldGLAccountNameError');
                }
            }
        } else {
            $this->addError($errors, 'vendortype_code', 'importFieldDependentIntPkgError');
            if ($entity->default_glaccount_number != '') {
                $this->addError($errors, 'default_glaccount_number', 'importFieldDependentIntPkgError');
            }
        }

        return $errors;
    }

    public function validateCollection(&$data) {
        $xml = "<PN_VALIDATE_XML xmlns=\"http://tempuri.org/\">
                <xml><![CDATA[
                     <VENDORCOMBOS xmlns=''>";
        
        $hasOneValid = false;
        foreach ($data as $idx=>$row) {
            if ($data[$idx]['validation_status'] == 'valid') {
                $hasOneValid = true;
                $xml .= "<VENDORCOMBO>
                            <VENDOR_ID_ALT>{$row['vendor_id_alt']}</VENDOR_ID_ALT>
                            <VENDOR_NAME>{$row['vendor_name']}</VENDOR_NAME>
                            <VENDOR_FEDID>{$row['vendor_fedid']}</VENDOR_FEDID>
                            <VENDOR_TAX_REPORTING_NAME>{$row['vendor_tax_reporting_name']}</VENDOR_TAX_REPORTING_NAME>
                            <VENDOR_STATUS>{$row['vendor_status']}</VENDOR_STATUS>
                            <VENDOR_TYPE_CODE>{$row['vendortype_code']}</VENDOR_TYPE_CODE>
                            <VENDOR_PAYPRIORITY>{$row['vendor_paypriority']}</VENDOR_PAYPRIORITY>
                            <VENDOR_CREATEDDATE>{$row['vendor_createddatetm']}</VENDOR_CREATEDDATE>
                            <VENDOR_LASTUPDATE_DATE>{$row['vendor_lastupdate_date']}</VENDOR_LASTUPDATE_DATE>
                            <VENDOR_TYPE1099>{$row['vendor_type1099']}</VENDOR_TYPE1099>
                            <VENDOR_TERMSDATEBASIS>{$row['vendor_termsdatebasis']}</VENDOR_TERMSDATEBASIS>
                            <PAYDATEBASIS_CODE>{$row['paydatebasis_code']}</PAYDATEBASIS_CODE>
                            <DEFAULT_GLCODE>{$row['default_glaccount_number']}</DEFAULT_GLCODE>
                            <VENDOR_PHONE>{$row['phone_number']}</VENDOR_PHONE>
                            <VENDOR_FAX>{$row['fax_number']}</VENDOR_FAX>
                            <VENDOR_ADDRESS1>{$row['address_line1']}</VENDOR_ADDRESS1>
                            <VENDOR_ADDRESS2>{$row['address_line2']}</VENDOR_ADDRESS2>
                            <VENDOR_CITY>{$row['address_city']}</VENDOR_CITY>
                            <VENDOR_STATE>{$row['address_state']}</VENDOR_STATE>
                            <VENDOR_ZIPCODE>{$row['address_zip']}</VENDOR_ZIPCODE>
                            <CONTACT_LAST_NAME>{$row['person_firstname']}</CONTACT_LAST_NAME>
                            <CONTACT_FIRST_NAME>{$row['person_lastname']}</CONTACT_FIRST_NAME>
                        </VENDORCOMBO>";
            }
        }

        $xml .=     "</VENDORCOMBOS>
                ]]></xml>
                <methodname>vendors</methodname>
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
