<?php

namespace NP\budget;

use NP\core\AbstractService;
use NP\property\FiscalCalService;
use NP\util\SoapService;

/**
 * Service class for operations related to Budgets
 *
 * @author Thomas Messier
 */
class BudgetService extends AbstractService {

    protected $soapService;

    public function __construct(SoapService $soapService) {
        $this->soapService = $soapService;
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
     * Get Month-to-Date Over Budget categories
     *
     * @param  boolean $countOnly   Whether we want to retrieve only the number of records or all the data
     * @param  int     $property_id The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
     * @param  int     $pageSize    The number of records per page; if null, all records are returned
     * @param  int     $page        The page for which to return records
     * @param  string  $sort        Field(s) by which to sort the result; defaults to vendor_name
     * @return array                Array of budget records
     */
    public function getMtdOverBudgetCategories($countOnly, $property_id, $pageSize=null, $page=null, $sort="category_name") {
        return $this->budgetGateway->findMtdOverBudgetCategories($countOnly, $property_id, $pageSize, $page, $sort);
    }

    /**
     * Get Year-to-Date Over Budget categories
     *
     * @param  boolean $countOnly   Whether we want to retrieve only the number of records or all the data
     * @param  int     $property_id The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
     * @param  int     $pageSize    The number of records per page; if null, all records are returned
     * @param  int     $page        The page for which to return records
     * @param  string  $sort        Field(s) by which to sort the result; defaults to vendor_name
     * @return array                Array of budget records
     */
    public function getYtdOverBudgetCategories($countOnly, $property_id, $pageSize=null, $page=null, $sort="category_name") {
        return $this->budgetGateway->findYtdOverBudgetCategories($countOnly, $property_id, $pageSize, $page, $sort);
    }

    /**
     * Retrieve budget overage by id
     * @param $id
     * @return array
     */
    public function getBudgetOverage($id) {
        return $this->budgetOverageGateway->findById($id);
    }

    /**
     * Retrieve list of budget overage
     *
     * @param $property_id
     * @return array
     */
    public function getBudgetOveragesByProperty($property_id, $pageSize=null, $page=null, $sort="property_name") {
        return $this->budgetOverageGateway->findByPropertyId($property_id, $pageSize, $page, $sort);
    }

    /**
     * save budget overage
     *
     * @param $data
     * @return array
     */
    public function saveBudgetOverage($data) {
        $budgetoverage = new BudgetOverageEntity($data['budgetoverage']);

        if ($budgetoverage->budgetoverage_id == null) {
            $budgetoverage->userprofile_id = $data['userprofile_id'];
            $budgetoverage->role_id        = $data['role_id'];
        }
        $budgetoverage->budgetoverage_period = \NP\util\Util::formatDateForDB(new \DateTime($budgetoverage->budgetoverage_period));

        $errors = $this->entityValidator->validate($budgetoverage);

        if (count($errors) == 0) {
            try {
                $this->budgetOverageGateway->save($budgetoverage);
            } catch(\Exception $e) {
                // Add a global error to the error array
                $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
            }
        }

        return array(
            'success'    => (count($errors)) ? false : true,
            'errors'     => $errors,
        );
    }

    /**
     * Delete budget overage record by id
     *
     * @param $id
     * @return bool
     */
    public function budgetOverageDelete($id) {
        $success = true;

        try {
            $this->budgetOverageGateway->commit();
        } catch(\Exception $e) {
            $success = false;
        }

        return $success;
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