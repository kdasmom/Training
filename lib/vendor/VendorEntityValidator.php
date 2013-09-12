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
use Zend\Soap\Client as SOAPClient;;

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
        
        $wsdl_url = 'http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?WSDL';
        $wsdl_login = array('username' => 'xmlservices',
                'password' => 'monkeys',
                'client_name' => 'LegacyResQABudgetClient',
                'client_ip' => '');
        $client = new SOAPClient($wsdl_url);
        
        $login = $client->Login($wsdl_login);
        $LoginResult = $login->LoginResult;
        $session_key = $LoginResult->any;
//        $SecurityHeader = new SoapHeader(null, null, array('SessionKey' => $session_key, 
//                'ClientName' => $wsdl_login['client_name'], 
//                'UserName' => $wsdl_login['username']));
//        $client->addSoapInputHeader($SecurityHeader);
        $resultWsdl = $client->PN_SET_VENDORCOMBO(array('vendorcombo' => $xmlstring,'integration_id' =>1));
        
    }
}
