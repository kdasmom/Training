<?php

namespace NP\budget;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\gl\GLBudgetEntityValidator;
use NP\system\TreeGateway;

/**
 * Service class for operations related to Budgets
 *
 * @author Thomas Messier
 */
class BudgetService extends AbstractService {

	protected $budgetGateway, $glAccountYearGateway, $glBudgetEntityValidator;

	public function __construct(BudgetGateway $budgetGateway, GlAccountYearGateway $glAccountYearGateway, GLBudgetEntityValidator $validator) {
		$this->budgetGateway        = $budgetGateway;
		$this->glAccountYearGateway = $glAccountYearGateway;
                $this->glBudgetEntityValidator = $validator;
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
        
        public function save($data, $entityClass)
        {
            // Get entities
            $glAccount = $data['GLAccount'];
            $budget_period = $data['PeriodYear'] . '-' . $data['PeriodMonth'] . '-01 00:00:00.000';
            $budget_amount = $data['Amount'];
            $budget_status = 'Active';
            $budget_createddatetime = date('Y-m-d H:i:s.u');
            $glAccountId = $this->glBudgetEntityValidator->getGLAccountIdByName($glAccount);
            //TODO
            $propertyId = 427;
            $glAccountYearId =$this->glBudgetEntityValidator->getGLAccountYearIdByYear($glAccountId, (int)$data['PeriodYear'], $propertyId);
            $budget = array(
                'glaccount_id' => $glAccountId,
                'budget_period' => $budget_period,
                'budget_amount' => $budget_amount,
                'budget_status' => $budget_status,
                'budget_createddatetime' => $budget_createddatetime
            );

            $exists = $oldGlBudgetId = $this->glBudgetEntityValidator->glbudgetExists($glAccountYearId, $budget_period, $budget_status);
            if($exists) {
                $budget['budget_id'] = $oldGlBudgetId;
            }

            $glbudget     = new $entityClass($budget);

            // Run validation
            $validator = new EntityValidator();
            $validator->validate($glbudget);
            $errors    = $validator->getErrors();

            // If the data is valid, save it
            if (count($errors) == 0) {
                // Begin transaction
                $this->budgetGateway->beginTransaction();

                try {
                    // Save the glaccount record
                    $this->budgetGateway->save($glbudget);
                    $newGlBudgetId = $glbudget->budget_id;
                 
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

?>