<?php

namespace NP\budget;

use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;
require_once("NPSoap\NPSoapAutoload.php");
require_once("NPSoap\NPSoapWsdlClass.php");

class BudgetEntityValidator extends BaseImportServiceEntityValidator{

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
        $select ->from('GLACCOUNT')
            ->columns(array('id' => 'glaccount_id'))
            ->where("glaccount_number = ? and integration_package_id = ?");

        $glaccount = $this->adapter->query($select, array($row['GLAccount'], $integrationPackage[0]['id']));

        if (empty($glaccount)) {
            $this->addLocalizedErrorMessage('GLAccount', 'importFieldGLAccountError');
        }
        
        $select = new Select();
        $select ->from('PROPERTY')
            ->columns(array('id' => 'property_id'))
            ->where("property_id_alt = ?");

        $property = $this->adapter->query($select, array($row['BusinessUnit']));

        if (empty($property)) {
            $this->addLocalizedErrorMessage('BusinessUnit', 'importFieldPropertyCodeError');
        }  

        $query = new Select();
        $query->from('GLACCOUNTYEAR')
            ->column( 'glaccountyear_id')
            ->where('glaccount_id = ? AND glaccountyear_year = ? AND property_id = ?');
        $glaccountyear = $this->adapter->query($query, array($glaccount[0]['id'], $row['PeriodYear'], $property[0]['id']));
        if (empty($glaccountyear)) {
            $this->addLocalizedErrorMessage('PeriodYear', 'importFieldPeriodYearError');
        }  
                   
         $xmlstring = "
             <BUDGETS xmlns=''>
                <BUDGET>
                    <Business_Unit>{$row['BusinessUnit']}</Business_Unit>
                    <Gl_Account>{$row['GLAccount']}</Gl_Account>
                    <Period_Month>{$row['PeriodMonth']}</Period_Month>
                    <Period_Year>{$row['PeriodYear']}</Period_Year>
                    <Amount>{$row['Amount']}</Amount>
                </BUDGET>
            </BUDGETS>";
       
        $xml = new \NPSoapStructBudgets($xmlstring);

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
       
       if($nPSoapServicePN->PN_SET_BUDGET(new \NPSoapStructPN_SET_BUDGET($integrationPackage[0]['id'], $xml))){
            $BudgetResult = $nPSoapServicePN->getResult();
            $xmlResult = $BudgetResult->PN_SET_BUDGETResult->PN_SET_BUDGETResult->any;
            $xmlLogin = simplexml_load_string($xmlResult);
            $status = (string)$xmlLogin->StatusCode;
       } else {
            $errors = $nPSoapServicePN->getLastError();
       }
    }

}