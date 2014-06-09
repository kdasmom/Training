<?php

namespace NP\budget;

use NP\core\AbstractService;
use NP\property\FiscalCalService;
use NP\util\SoapService;
use NP\util\Util;

/**
 * Service class for operations related to Budgets
 *
 * @author Thomas Messier
 */
class BudgetService extends AbstractService {

    protected $soapService, $fiscalCalService;

    public function __construct(SoapService $soapService, FiscalCalService $fiscalCalService) {
        $this->soapService      = $soapService;
        $this->fiscalCalService = $fiscalCalService;
    }

    /**
     * 
     */
    public function createBudget($property_id, $glaccount_id, $period, $budget, $actual) {
        $errors = [];
        $this->budgetGateway->beginTransaction();
        
        try {
            $propPeriod = $this->fiscalCalService->getAccountingPeriod($property_id);
            $year = intVal($period->format('Y'));

            $glaccountyear = $this->glAccountYearGateway->findSingle(
                ['property_id' => '?','glaccount_id' => '?','glaccountyear_year' => '?'],
                [$property_id, $glaccount_id, $year],
                ['glaccountyear_id']
            );

            if ($glaccountyear === null) {
                $status = 'active';
                if ($year != intVal($propPeriod->format('Y'))) {
                    $status = 'inactive';
                }

                $glYear = new \NP\budget\GlAccountYearEntity([
                    'property_id'          => $property_id,
                    'glaccount_id'         => $glaccount_id,
                    'glaccountyear_year'   => $year,
                    'glaccountyear_status' => $status
                ]);

                $this->glAccountYearGateway->save($glYear);
                $glaccountyear['glaccountyear_id'] = $glYear->glaccountyear_id;
            }

            $budget = $this->budgetGateway->findSingle(
                ['glaccountyear_id' => '?', 'budget_period' => '?'],
                [$glaccountyear['glaccountyear_id'], \NP\util\Util::formatDateForDB($period)],
                ['budget_id']
            );

            if ($budget === null) {
                $budgetObj = new \NP\budget\BudgetEntity([
                    'glaccountyear_id'   => $glaccountyear['glaccountyear_id'],
                    'glaccount_id'       => $glaccount_id,
                    'budget_period'      => $period,
                    'oracle_period_name' => substr($period->format('F'), 0, 3) . '-' . $period->format('y'),
                    'budget_amount'      => $budget,
                    'oracle_actual'      => $actual
                ]);

                $this->budgetGateway->save($budgetObj);
            }
        } catch(\Exception $e) {
            $errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
        }
        
        if (count($errors)) {
            $this->budgetGateway->rollback();
        } else {
            $this->budgetGateway->commit();
        }
        
        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
    }

    public function createMissingBudgets($entityType, $entity_id=null) {
        $this->budgetGateway->beginTransaction();

        try {
            $this->glAccountYearGateway->createMissingGlAccountYears($entityType, $entity_id);
            $this->budgetGateway->createMissingBudgets($entityType, $entity_id);

            $this->budgetGateway->commit();
        } catch(\Exception $e) {
            $this->budgetGateway->rollback();
            throw $e;
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
        $budgetoverage->budgetoverage_period = $data['budgetoverage_period'];
        $property_id = $data['budgetoverage']['property_id'];
        $glaccount_id = $data['budgetoverage']['glaccount_id'];

        $errors = $this->entityValidator->validate($budgetoverage);

        if (count($errors) == 0) {
            try {
                //make sure there is no repeat records
                $budgetOverageRecs = $this->budgetOverageGateway->find(
                [
                    'property_id'           => '?',
                    'glaccount_id'          =>  '?',
                    'budgetoverage_period'  =>  '?'
                ],
                [
                    $property_id, 
                    $glaccount_id, 
                    $budgetoverage->budgetoverage_period
                ]
        );
                if ($budgetOverageRecs) {
                   $errors = "repeatRec";
                }
                else {
                    $this->budgetOverageGateway->save($budgetoverage);
                }
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
           $this->budgetOverageGateway->find(
                [
                    'property_id'           => '?'
                ],
                [
                    $id
                ]
        );
        } catch(\Exception $e) {
            $success = false;
        }

        return $success;
    }

    public function getMonthlyLineBudgetInfo($property_id, $glaccount_id, $period, $type='account') {
        $gl     = $this->glAccountGateway->findById($glaccount_id);
        $period = \DateTime::createFromFormat(Util::getServerDateFormat(), $period);
        
        $data = [
            'property_name'  => $this->propertyGateway->findValue('property_id = ?', [$property_id], 'property_name'),
            'glaccount_name' => ($type == 'account') ? $gl['glaccount_name'] : $gl['glaccount_category'],
            'month'          => (int)$period->format('n')
        ];
        
        $data['package_type_name'] = $this->propertyGateway->findSingle(
            'pr.property_id = ?',
            [$property_id],
            [],
            null,
            [
                new \NP\property\sql\join\PropertyIntPkgJoin([]),
                new \NP\system\sql\join\IntPkgIntPkgTypeJoin()
            ]
        );
        $data['package_type_name'] = $data['package_type_name']['Integration_Package_Type_Display_Name'];

        $isCategory = ($type == 'category') ? true : false;
        $fn = ($isCategory) ? 'getCategoryBudgetByPeriod' : 'getAccountBudgetByPeriod';
        $glaccount_id = ($isCategory) ? $gl['glaccount_category_id'] : $gl['glaccount_id'];

        $period = Util::formatDateForDB($period);
        
        $budget = $this->budgetGateway->$fn($glaccount_id, $property_id, $period);

        $invoiceAmount = $this->invoiceGateway->getTotalAmountByBudget(
            $glaccount_id,
            $property_id,
            $period,
            null,
            $isCategory
        );

        $poAmount = $this->purchaseOrderGateway->getTotalAmountByBudget(
            $glaccount_id,
            $property_id,
            $period,
            null,
            $isCategory
        );

        $data['month_budget']  = $budget['budget_amount'];
        $data['month_actual']  = $budget['actual_amount'];
        $data['month_invoice'] = $invoiceAmount;
        $data['month_po']      = $poAmount;

        return $data;
    }

    public function getYearlyLineBudgetInfo($property_id, $glaccount_id, $period, $type='account') {
        $gl     = $this->glAccountGateway->findById($glaccount_id);
        $period = \DateTime::createFromFormat(Util::getServerDateFormat(), $period);
        
        $fiscalYear   = $this->fiscalCalService->getFiscalYear($property_id, $period);
        $start_period = Util::formatDateForDB($fiscalYear['start']);
        $end_period   = Util::formatDateForDB($fiscalYear['end']);

        $isCategory = ($type == 'category') ? true : false;
        $fn = ($isCategory) ? 'getCategoryBudgetByPeriod' : 'getAccountBudgetByPeriod';
        $glaccount_id = ($isCategory) ? $gl['glaccount_category_id'] : $gl['glaccount_id'];

        $budget = $this->budgetGateway->$fn($glaccount_id, $property_id, $start_period, $end_period);

        $data = [
            'property_name'  => $this->propertyGateway->findValue('property_id = ?', [$property_id], 'property_name'),
            'glaccount_name' => ($type == 'account') ? $gl['glaccount_name'] : $gl['glaccount_category'],
            'month'          => (int)$period->format('n')
        ];

        $invoiceAmount = $this->invoiceGateway->getTotalAmountByBudget(
            $glaccount_id,
            $property_id,
            $start_period,
            $end_period,
            $isCategory
        );

        $poAmount = $this->purchaseOrderGateway->getTotalAmountByBudget(
            $glaccount_id,
            $property_id,
            $start_period,
            $end_period,
            $isCategory
        );

        $data['year']         = $fiscalYear['year'];
        $data['year_budget']  = $budget['budget_amount'];
        $data['year_actual']  = $budget['actual_amount'];
        $data['year_invoice'] = $invoiceAmount;
        $data['year_po']      = $poAmount;

        return $data;
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