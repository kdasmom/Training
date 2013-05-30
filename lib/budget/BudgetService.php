<?php

namespace NP\budget;

use NP\core\AbstractService;

/**
 * Service class for operations related to Budgets
 *
 * @author Thomas Messier
 */
class BudgetService extends AbstractService {

	protected $budgetGateway, $glAccountYearGateway;

	public function __construct(BudgetGateway $budgetGateway, GlAccountYearGateway $glAccountYearGateway) {
		$this->budgetGateway        = $budgetGateway;
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

}

?>