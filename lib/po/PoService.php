<?php

namespace NP\po;

use NP\core\AbstractService;
use NP\security\SecurityService;
use NP\budget\BudgetService;

/**
 * Service class for operations related to Purchase Orders
 *
 * @author Thomas Messier
 */
class PoService extends AbstractService {

	protected $securityService, $budgetService;

	public function __construct(BudgetService $budgetService) {
		$this->budgetService = $budgetService;
	}

	public function setSecurityService(SecurityService $securityService) {
		$this->securityService = $securityService;
	}

	/**
	 * Get list of POs to approve
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $userprofile_id              The active user ID, can be a delegated account
	 * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of invoice records
	 */
	public function getPosToApprove($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->purchaseOrderGateway->findPosToApprove($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get list of released POs
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $userprofile_id              The active user ID, can be a delegated account
	 * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of invoice records
	 */
	public function getPosReleased($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->purchaseOrderGateway->findPosReleased($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get list of user's POs
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $userprofile_id              The active user ID, can be a delegated account
	 * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of invoice records
	 */
	public function getPosByUser($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->purchaseOrderGateway->findPosByUser($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get list of user's POs
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $userprofile_id              The active user ID, can be a delegated account
	 * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of invoice records
	 */
	public function getPosRejected($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->purchaseOrderGateway->findPosRejected($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	public function rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod) {
		$this->purchaseOrderGateway->beginTransaction();

		try {
			// Roll PO lines
			$this->poItemGateway->rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod);
			
			// Roll POs
			$this->purchaseOrderGateway->rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod);

			// Create new budgets if needed
			$this->budgetService->createMissingBudgets('po');

			// If dealing with a new year, update the GLACCOUNTYEAR records
			if ($newAccountingPeriod->format('Y') != $oldAccountingPeriod->format('Y')) {
				$this->budgetService->activateGlAccountYear($newAccountingPeriod->format('Y'));
			}

			$this->purchaseOrderGateway->commit();
		} catch(\Exception $e) {
			$this->purchaseOrderGateway->rollback();
		}
	}

}

?>