<?php

namespace NP\budget;

use NP\system\BaseImportServiceEntityValidator;
use NP\core\db\Select;
use NP\core\Config;
use NP\system\IntegrationPackageGateway;
use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;

abstract class BudgetEntityValidator extends BaseImportServiceEntityValidator {

    protected $adapter, $type;

    /**
     * @param \NP\core\db\Adapter $adapter
     */
    public function __construct(IntegrationPackageGateway $integrationPackageGateway, GLAccountGateway $glAccountGateway,
                                PropertyGateway $propertyGateway, GlAccountYearGateway $glAccountYearGateway,
                                Config $config) {
        if ($this->type === null) {
            throw new \NP\core\Exception('You must override the $type property in your extended class');
        }

        $this->nodeName = strtoupper($this->type);
        
        if ($this->nodeName !== 'BUDGET' && $this->nodeName !== 'ACTUAL') {
            throw new \NP\core\Exception("\$type '{$this->type}' is invalid. Valid types are 'budget' and 'actual'");
        }

        $this->soapClass = '\\NPSoapStruct' . ucfirst($this->type) . 's';

        $this->integrationPackageGateway      = $integrationPackageGateway;
        $this->glAccountGateway               = $propertyGateway;
        $this->propertyGateway                = $propertyGateway;
        $this->glAccountYearGateway           = $glAccountYearGateway;
        $this->config                         = $config;
    }

    /**
     * @param \ArrayObject $row
     * @param \ArrayObject $errors
     * @return BaseImportServiceEntityValidator
     */
    
    protected function validate(\ArrayObject $row, \ArrayObject $errors)
    {
        $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($row['IntegrationPackage'])
        );
        
        if (empty($intPkg)) {
            $this->addLocalizedErrorMessage('IntegrationPackage', 'importFieldIntegrationPackageNameError');
        }
        
        $glaccount = $this->glAccountGateway->find(
            array('glaccount_number' => '?', 'integration_package_id' => '?'),
            array($row['GLAccount'], $intPkg[0]['integration_package_id'])
        );

        if (empty($glaccount)) {
            $this->addLocalizedErrorMessage('GLAccount', 'importFieldGLAccountError');
        }
        
        $property = $this->propertyGateway->find('property_id_alt = ?', array($row['BusinessUnit']));

        if (empty($property)) {
            $this->addLocalizedErrorMessage('BusinessUnit', 'importFieldPropertyCodeError');
        }  

        $glaccountyear = $this->glAccountYearGateway->find(
            array(
                'glaccount_id'       => '?',
                'glaccountyear_year' => '?',
                'property_id'        => '?'
            ),
            array($glaccount[0]['id'], $row['PeriodYear'], $property[0]['id']));
        
        if (empty($glaccountyear)) {
            $this->addLocalizedErrorMessage('PeriodYear', 'importFieldPeriodYearError');
        }
        
        $wsdl_url = $this->config->get('PN.Main.WebServiceOptions.WSDLAddress');

        $xml = '
            <PN_VALIDATE_XML xmlns="http://tempuri.org/">
                <xml><![CDATA[
                     <{$this->nodeName}S xmlns="">
                        <{$this->nodeName}>
                            <Business_Unit>{$row["BusinessUnit"]}</Business_Unit>
                            <Gl_Account>{$row["GLAccount"]}</Gl_Account>
                            <Period_Month>{$row["PeriodMonth"]}</Period_Month>
                            <Period_Year>{$row["PeriodYear"]}</Period_Year>
                            <Amount>{$row["Amount"]}</Amount>
                        </{$this->nodeName}>
                    </{$this->nodeName}S>
                ]]></xml>
                <methodname>'.strtolower($this->nodeName).'</methodname>
            </PN_VALIDATE_XML>';
        
        $res = \NP\util\Util::soapRequest($wsdl_url, $xml);

        if (array_key_exists('soapResult', $res)) {
            
        } else {
            
        }
    }

}