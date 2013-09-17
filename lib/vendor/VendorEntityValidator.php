<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 9/2/13
 * Time: 6:11 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;


use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;
require_once("NPSoap\NPSoapAutoload.php");
require_once("NPSoap\NPSoapWsdlClass.php");

class VendorEntityValidator extends BaseImportServiceEntityValidator
{

    /**
     * @var \NP\core\db\Adapter
     */
    protected $adapter;

    /**
     * @param \NP\core\db\Adapter $adapter
     */
    public function __construct(\NP\core\db\Adapter $adapter)
    {
        $this->adapter = $adapter;
    }

    /**
     * @param \ArrayObject $row
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator
     */
    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        $select = new Select();
        $select ->from('INTEGRATIONPACKAGE')
                ->columns(array('id' => 'integration_package_id'))
                ->where("integration_package_name = ?");

        $integrationPackage = $this->adapter->query($select, array($row['IntegrationPackage']));
        
        if (empty($integrationPackage)) {
            $this->addLocalizedErrorMessage('IntegrationPackage', 'importFieldIntegrationPackageNameError');
        }
        
        $select = new Select();
        $select ->from('VENDOR')
            ->columns(array('id' => 'vendor_id'))
            ->where("vendor_id_alt = ? ");

        $vendor = $this->adapter->query($select, array($row['VendorID']));

        if (!empty($vendor)) {
            $this->addLocalizedErrorMessage('VendorID', 'importFieldVendorIDError');
        }  
                   
         $xmlstring = "<?xml version=\"1.0\" encoding=\"utf-8\"?> 
            <VENDORCOMBOS xmlns=''>
                <VENDORCOMBO>
                    <VENDOR_ID_ALT>{$row['VendorID']}</VENDOR_ID_ALT>
                    <VENDOR_NAME>{$row['Name']}</VENDOR_NAME>
                    <VENDOR_FEDID>{$row['FederalID']}</VENDOR_FEDID>
                    <VENDOR_TAX_REPORTING_NAME>{$row['TaxReportName']}</VENDOR_TAX_REPORTING_NAME>
                    <VENDOR_STATUS>{$row['Status']}</VENDOR_STATUS>
                    <VENDOR_TYPE_CODE>{$row['VendorType']}</VENDOR_TYPE_CODE>
                    <VENDOR_PAYPRIORITY>{$row['PayPriority']}</VENDOR_PAYPRIORITY>
                    <VENDOR_CREATEDDATE>{$row['CreatedDate']}</VENDOR_CREATEDDATE>
                    <VENDOR_LASTUPDATE_DATE>{$row['LastUpdateDate']}</VENDOR_LASTUPDATE_DATE>
                    <VENDOR_TYPE1099>{$row['1099Reportable?']}</VENDOR_TYPE1099>
                    <VENDOR_TERMSDATEBASIS>{$row['TermDateBasis']}</VENDOR_TERMSDATEBASIS>
                    <PAYDATEBASIS_CODE>{$row['PayDateBasis']}</PAYDATEBASIS_CODE>
                    <DEFAULT_GLCODE>{$row['DefaultGLcode']}</DEFAULT_GLCODE>
                    <VENDOR_PHONE>{$row['Phone']}</VENDOR_PHONE>
                    <VENDOR_FAX>{$row['Fax']}</VENDOR_FAX>
                    <VENDOR_ADDRESS1>{$row['Address1']}</VENDOR_ADDRESS1>
                    <VENDOR_ADDRESS2>{$row['Address2']}</VENDOR_ADDRESS2>
                    <VENDOR_CITY>{$row['City']}</VENDOR_CITY>
                    <VENDOR_STATE>{$row['State']}</VENDOR_STATE>
                    <VENDOR_ZIPCODE>{$row['ZipCode']}</VENDOR_ZIPCODE>
                    <CONTACT_LAST_NAME>{$row['ContactLastName']}</CONTACT_LAST_NAME>
                    <CONTACT_FIRST_NAME>{$row['ContactFirstName']}</CONTACT_FIRST_NAME>
                </VENDORCOMBO>
            </VENDORCOMBOS>";
        
        $vendorcombo = new \NPSoapStructVendors($xmlstring);

        $wsdl_url = 'http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?WSDL';
        $wsdl_username = 'xmlservices';
        $wsdl_password = 'monkeys';
        $wsdl_client_name = 'LegacyResQABudgetClient';
        $wsdl_client_ip ='';
              
        $wsdl = array('wsdl_url' => $wsdl_url, 
           'wsdl_cache_wsdl' => WSDL_CACHE_NONE, 
           'wsdl_trace' => true);
        
       $nPSoapServicePN = new \NPSoapServicePN($wsdl);
       $nPSoapServiceLogin = new \NPSoapServiceLogin($wsdl);
       if($nPSoapServiceLogin->Login(new \NPSoapStructLogin($wsdl_username, $wsdl_password, $wsdl_client_name, $wsdl_client_ip))){
            $LoginResult = $nPSoapServiceLogin->getResult();
            $xmlResult = $LoginResult->LoginResult->LoginResult->any;
            $xmlLogin = simplexml_load_string($xmlResult);
            $session_key = (string)$xmlLogin->SessionKey;
       } else {
            $errors = $nPSoapServiceLogin->getLastError();
       }

       $nPSoapServicePN->setSoapHeaderSecurityHeader(new \NPSoapStructSecurityHeader($session_key, $wsdl_client_name, $wsdl_username));
       
       if($nPSoapServicePN->PN_SET_VENDORCOMBO(new \NPSoapStructPN_SET_VENDORCOMBO($integrationPackage[0]['id'], $vendorcombo))){
            $result = $nPSoapServicePN->getResult();
            $xmlResult = $result->PN_SET_VENDORCOMBOResult->PN_SET_VENDORCOMBOResult->any;
            $statusResult = simplexml_load_string($xmlResult);
            $status = (string)$statusResult->StatusCode;
       } else {
            $error = $nPSoapServicePN->getLastError();
       }
        
    }
}
