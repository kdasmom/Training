<?php

namespace NP\budget;

use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;
use Zend\Soap\Client as SOAPClient;
use Zend\Dom\Query as DOMQuery;

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
        
        $dom = new DOMQuery();
        $dom->setDocumentXml($xmlstring);
            
        $wsdl_url = 'http://setup.nexussystems.com/PNQAServices/payablenexus.asmx?WSDL';
        $wsdl_login = array('username' => 'xmlservices',
                'password' => 'monkeys',
                'client_name' => 'LegacyResQABudgetClient',
                'client_ip' => '');
        $client = new SOAPClient($wsdl_url);
        
        $login = $client->Login($wsdl_login);
        $LoginResult = $login->LoginResult;
        $session_key = $LoginResult->any;
        $SecurityHeader = new \SoapHeader('SOAPHEADER', 'HEADERNAME', array('SessionKey' => $session_key, 
                'ClientName' => $wsdl_login['client_name'], 
                'UserName' => $wsdl_login['username']));
        $client->addSoapInputHeader($SecurityHeader);
        $client->PN_SET_BUDGET(array('budgets' => $dom,'integration_id' =>1));

    }

}