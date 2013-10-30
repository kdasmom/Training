<?php

namespace NP\import;

use NP\core\validation\EntityValidator;
use NP\core\db\Select;
use NP\core\db\Adapter;
use NP\core\Config;
use NP\system\IntegrationPackageGateway;
use NP\gl\GlAccountGateway;
use NP\property\PropertyGateway;
use NP\locale\LocalizationService;
use NP\util\SoapService;

abstract class AbstractBudgetImportEntityValidator extends EntityValidator {

    protected $type, $localizationService, $integrationPackageGateway, $glAccountGateway, 
            $propertyGateway, $config, $soapService;

    public function __construct(LocalizationService $localizationService, Adapter $adapter, IntegrationPackageGateway $integrationPackageGateway,
                                GlAccountGateway $glAccountGateway, PropertyGateway $propertyGateway,
                                Config $config, SoapService $soapService) {
        // Make sure a type was set in the extended class
        if ($this->type === null) {
            throw new \NP\core\Exception('You must override the $type property in your extended class');
        }

        // Make sure the type set is valid
        $this->nodeName = strtoupper($this->type);
        if ($this->nodeName !== 'BUDGET' && $this->nodeName !== 'ACTUAL') {
            throw new \NP\core\Exception("\$type '{$this->type}' is invalid. Valid types are 'budget' and 'actual'");
        }

        // Initialize the class
        parent::__construct($localizationService, $adapter);

        $this->integrationPackageGateway = $integrationPackageGateway;
        $this->glAccountGateway          = $glAccountGateway;
        $this->propertyGateway           = $propertyGateway;
        $this->config                    = $config;
        $this->soapService               = $soapService;
    }

    /**
     * @param \NP\core\AbstractEntity $entity
     * @return array
     */
    public function validate(\NP\core\AbstractEntity $entity) {
        $errors = parent::validate($entity);

        // Make sure the integration package is valid
        $intPkgError = false;
        $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($entity->integration_package_name)
        );
        
        if (empty($intPkg)) {
            $this->addError($errors, 'integration_package_name', 'importFieldIntegrationPackageNameError');
            $intPkgError = true;
        }
        
        // Make sure the GL Account is valid
        if (!$intPkgError) {
            $glaccount = $this->glAccountGateway->find(
                array('glaccount_number' => '?', 'integration_package_id' => '?'),
                array($entity->glaccount_number, $intPkg[0]['integration_package_id'])
            );

            if (empty($glaccount)) {
                $this->addError($errors, 'glaccount_number', 'importFieldGLAccountNameError');
            }
        } else {
            $this->addError($errors, 'glaccount_number', 'importFieldDependentIntPkgError');
        }
        
        // Make sure the property is valid
        $property = $this->propertyGateway->find('property_id_alt = ?', array($entity->property_id_alt));

        if (empty($property)) {
            $this->addError($errors, 'property_id_alt', 'importFieldPropertyCodeError');
        }

        return $errors;
    }

    public function validateCollection(&$data) {
        $xml = "<PN_VALIDATE_XML xmlns=\"http://tempuri.org/\">
                <xml><![CDATA[
                     <{$this->nodeName}S xmlns=''>";
        
        $hasOneValid = false;
        foreach ($data as $idx=>$row) {
            if ($data[$idx]['validation_status'] == 'valid') {
                $hasOneValid = true;
                $invoice_datetm = \DateTime::createFromFormat('m/d/Y', $row['invoice_datetm']);
                $invoice_datetm = $invoice_datetm->format('Y-m-d');
                $invoicepayment_datetm = \DateTime::createFromFormat('m/d/Y', $row['invoicepayment_datetm']);
                $invoicepayment_datetm = $invoicepayment_datetm->format('Y-m-d');
                $xml .= "<{$this->nodeName}>
                            <Business_Unit>{$row['property_id_alt']}</Business_Unit>
                            <Gl_Account>{$row['glaccount_number']}</Gl_Account>
                            <Period_Month>{$row['period_month']}</Period_Month>
                            <Period_Year>{$row['glaccountyear_year']}</Period_Year>
                            <Amount>{$row['amount']}</Amount>
                        </{$this->nodeName}>";
            }
        }

        $xml .=     "</{$this->nodeName}S>
                ]]></xml>
                <methodname>".strtolower($this->nodeName)."s</methodname>
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