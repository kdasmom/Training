<?php

namespace NP\budget;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;

/**
 * Service class for operations related to Budgets
 *
 * @author Thomas Messier
 */
class BudgetService extends AbstractService {

	protected $budgetGateway, $glAccountYearGateway, $budgetOverageGateway;

	public function __construct(BudgetGateway $budgetGateway, GlAccountYearGateway $glAccountYearGateway,
								BudgetOverageGateway $budgetOverageGateway) {
		$this->budgetGateway        = $budgetGateway;
		$this->glAccountYearGateway = $glAccountYearGateway;
		$this->budgetOverageGateway = $budgetOverageGateway;
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
        return $this->budgetOverageGateway->findByPropertyId($property_id, $pageSize, $page);
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

        $validator = new EntityValidator();

        $validator->validate($budgetoverage);
        $errors = $validator->getErrors();

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

}

?>