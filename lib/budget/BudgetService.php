<?php

namespace NP\budget;

use NP\core\AbstractService;
use NP\system\IntegrationPackageGateway;
use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;
use NP\util\SoapService;

/**
 * Service class for operations related to Budgets
 *
 * @author Thomas Messier
 */
class BudgetService extends AbstractService {

	protected $budgetGateway, $integrationPackageGateway, $glaccountGateway, $propertyGateway, $glAccountYearGateway;

	public function __construct(        
                BudgetGateway $budgetGateway,
                IntegrationPackageGateway $integrationPackageGateway,
                GLAccountGateway $glaccountGateway,
                PropertyGateway $propertyGateway,
                GlAccountYearGateway $glAccountYearGateway,
                SoapService $soapService
                )
        {
                $this->budgetGateway             = $budgetGateway;
                $this->integrationPackageGateway = $integrationPackageGateway;
                $this->glaccountGateway          = $glaccountGateway;
                $this->propertyGateway           = $propertyGateway;
                $this->glAccountYearGateway      = $glAccountYearGateway;
                $this->soapService               = $soapService;
	}

	public function createMissingBudgets($entityType) {
		$this->budgetGateway->beginTransaction();

		try {
			$this->glAccountYearGateway->createMissingGlAccountYears($entityType);
			$this->budgetGateway->createMissingBudgets($entityType);

			$this->budgetGateway->commit();
		} catch(\Exception $e) {
			$this->budgetGateway->rollback();
		}
	}

	public function activateGlAccountYear($property_id, $glaccountyear_year) {
		$this->glAccountYearGateway->beginTransaction();
		
		try {
			$this->glAccountYearGateway->activateYear($property_id, $glaccountyear_year);

			$this->glAccountYearGateway->commit();
		} catch(\Exception $e) {
			$this->glAccountYearGateway->rollback();
		}
	}

    /**
     * Shortcut function for saveBudgetFromImport($data, 'budget')
     */
    public function saveGLBudgetFromImport($data) {
        return $this->saveBudgetFromImport($data, 'budget');
    }

    /**
     * Shortcut function for saveBudgetFromImport($data, 'actual')
     */
    public function saveGLActualFromImport($data) {
        return $this->saveBudgetFromImport($data, 'actual');
    }

    /**
     * Function to save a budget or actual record from a  
     */
    public function saveBudgetFromImport($data, $type) {
        // Make sure a type was set in the extended class
        if ($type === null) {
            throw new \NP\core\Exception('You must override the $type property in your extended class');
        }

        // Make sure the type set is valid
        $parentNodeName = strtolower($type);
        $nodeName = strtoupper($type);
        if ($nodeName !== 'BUDGET' && $nodeName !== 'ACTUAL') {
            throw new \NP\core\Exception("\$type '{$type}' is invalid. Valid types are 'budget' and 'actual'");
        }
        
        $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($data[0]['integration_package_name'])
        );
        $integration_package_id = $intPkg[0]['integration_package_id'];
        
        try {
            $sessionKey = $this->soapService->login();

            $soapSettings = $this->soapService->getSettings();

            $headerXml = "<SecurityHeader xmlns=\"http://tempuri.org/\">
                            <SessionKey>{$sessionKey}</SessionKey>
                            <ClientName>{$soapSettings['wsdl_client']}</ClientName>
                            <UserName>{$soapSettings['wsdl_user']}</UserName>
                        </SecurityHeader>";

            $xml = "<PN_SET_{$nodeName} xmlns=\"http://tempuri.org/\">
                        <{$parentNodeName}s>
                            <{$nodeName}S xmlns=\"\">";

            foreach ($data as $rec) {
                $xml .=         "<{$nodeName}>
                                    <Business_Unit>{$rec['property_id_alt']}</Business_Unit>
                                    <Gl_Account>{$rec['glaccount_number']}</Gl_Account>
                                    <Period_Month>{$rec['period_month']}</Period_Month>
                                    <Period_Year>{$rec['glaccountyear_year']}</Period_Year>
                                    <Amount>{$rec['amount']}</Amount>
                                </{$nodeName}>";
            }

            $xml .=         "</{$nodeName}S>
                        </{$parentNodeName}s>
                        <integration_id>{$integration_package_id}</integration_id>
                    </PN_SET_{$nodeName}>";

            $res = $this->soapService->request(
                $soapSettings['wsdl_url'],
                $xml,
                $headerXml
            );

            $resultProperty = "PN_SET_{$nodeName}Result";
            $statusCode = (string)$res['soapResult']->$resultProperty->Status->StatusCode;

            $error = null;
            if ($statusCode === 'SUCCESS') {
                $success = true;
            } else {
                throw new \NP\core\Exception('The SOAP request for saving a budget failed.');
            }
        } catch(\Exception $e) {
            $success = false;
            $error   = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
        }

        return array(
            'success' => $success,
            'error'   => $error
        );
    }
}

?>