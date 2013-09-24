<?php

namespace NP\budget;

use NP\system\BaseImportService;
use NP\system\IntegrationPackageGateway;
use NP\gl\GLAccountGateway;
use NP\property\PropertyGateway;

/**
 * Service class for operations related to Budgets
 *
 * @author Thomas Messier
 */
class BudgetService extends BaseImportService {

	protected $budgetGateway, $validator, $integrationPackageGateway, $glaccountGateway, $propertyGateway, $glAccountYearGateway;

	public function __construct(        
                BudgetGateway $budgetGateway,
                BudgetEntityValidator $validator,
                IntegrationPackageGateway $integrationPackageGateway,
                GLAccountGateway $glaccountGateway,
                PropertyGateway $propertyGateway,
                GlAccountYearGateway $glAccountYearGateway
                )
        {
                $this->budgetGateway = $budgetGateway;
                $this->validator = $validator;
                $this->integrationPackageGateway = $integrationPackageGateway;
                $this->glaccountGateway = $glaccountGateway;
                $this->propertyGateway = $propertyGateway;
                $this->glAccountYearGateway = $glAccountYearGateway;
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
        
    public function save(\ArrayObject $data, $entityClass)
    {
        $result = $this->integrationPackageGateway->find('integration_package_name = ?', array( $data['IntegrationPackage']));
        $integrationPackageId = $result[0]['integration_package_id'];
    
        $result = $this->glaccountGateway->find('glaccount_number = ?', array($data['GLAccount']));
        $glAccountId = $result[0]['glaccount_id'];
       
        $budget_period = $data['PeriodYear'] . '-' . $data['PeriodMonth'] . '-01 00:00:00.000';
        $budget_amount = $data['Amount'];
        $budget_status = 'Active';
        $budget_createddatetime = substr(date('Y-m-d H:i:s.u'), 0, -3);
        
        $result = $this->propertyGateway->find('property_id_alt = ?', array($data['BusinessUnit']));
        $propertyId = $result[0]['property_id'];
        

        $result =$this->glAccountYearGateway->find('glaccount_id = ? AND glaccountyear_year = ? AND property_id = ?', array($glAccountId, (int)$data['PeriodYear'], $propertyId));
        $glAccountYearId = $result[0]['glaccountyear_id'];
        
        $entityData = array(
            'glaccount_id' => $glAccountId,
            'budget_period' => $budget_period,
            'budget_status' => $budget_status,
            'budget_createddatetime' => $budget_createddatetime,
            'budget_amount' => $budget_amount,
            'glaccountyear_id' => $glAccountYearId
        );

       $entity = new $entityClass($entityData);
       $errors = $this->validate($entity);

    // I

        // If the data is valid, save it
        if (count($errors) == 0) {
            // Begin transaction
            $this->budgetGateway->beginTransaction();

            try {
                // Save the glaccount record
                $this->budgetGateway->save($entity);
                
            } catch(\Exception $e) {
                // Add a global error to the error array
                $errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e), 'extra'=>null);
            }
        }

        if (count($errors)) {
            $this->budgetGateway->rollback();
        } else {
            $this->budgetGateway->commit();
        }
    }

    public function saveActual(\ArrayObject $data, $entityClass) {
        $result = $this->integrationPackageGateway->find('integration_package_name = ?', array( $data['IntegrationPackage']));
        $integrationPackageId = $result[0]['integration_package_id'];
    
        $result = $this->glaccountGateway->find('glaccount_number = ?', array($data['GLAccount']));
        $glAccountId = $result[0]['glaccount_id'];
       
        $actual_period = $data['PeriodYear'] . '-' . $data['PeriodMonth'] . '-01 00:00:00.000';
        $actual_amount = $data['Amount'];
        $actual_status = 'Active';
        $actual_createddatetime = substr(date('Y-m-d H:i:s.u'), 0, -3);
        
        $result = $this->propertyGateway->find('property_id_alt = ?', array($data['BusinessUnit']));
        $propertyId = $result[0]['property_id'];
        

        $result =$this->glAccountYearGateway->find('glaccount_id = ? AND glaccountyear_year = ? AND property_id = ?', array($glAccountId, (int)$data['PeriodYear'], $propertyId));
        $glAccountYearId = $result[0]['glaccountyear_id'];
        
        $entityData = array(
            'glaccount_id' => $glAccountId,
            'budget_period' => $actual_period,
            'budget_status' => $actual_status,
            'budget_createddatetime' => $actual_createddatetime,
            'oracle_actual' => $actual_amount,
            'glaccountyear_id' => $glAccountYearId
        );

       $entity = new BudgetEntity($entityData);
       $errors = $this->validate($entity);

        // If the data is valid, save it
        if (count($errors) == 0) {
            // Begin transaction
            $this->budgetGateway->beginTransaction();

            try {
                // Save the glaccount record
                $this->budgetGateway->save($entity);
                
            } catch(\Exception $e) {
                // Add a global error to the error array
                $errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e), 'extra'=>null);
            }
        }

        if (count($errors)) {
            $this->budgetGateway->rollback();
        } else {
            $this->budgetGateway->commit();
        }
    }
}