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

}

?>