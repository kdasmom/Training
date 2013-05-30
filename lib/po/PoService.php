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

	protected $securityService, $purchaseorderGateway, $poItemGateway, $budgetService;

	public function __construct(PurchaseorderGateway $purchaseorderGateway, PoItemGateway $poItemGateway,
								BudgetService $budgetService) {
		$this->purchaseorderGateway = $purchaseorderGateway;
		$this->poItemGateway        = $poItemGateway;
		$this->budgetService        = $budgetService;
	}

	public function setSecurityService(SecurityService $securityService) {
		$this->securityService = $securityService;
	}

	public function rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod) {
		$this->purchaseorderGateway->beginTransaction();

		try {
			// Roll PO lines
			$this->poItemGateway->rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod);
			
			// Roll POs
			$this->purchaseorderGateway->rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod);

			// Create new budgets if needed
			$this->budgetService->createMissingBudgets('po');

			// If dealing with a new year, update the GLACCOUNTYEAR records
			if ($newAccountingPeriod->format('Y') != $oldAccountingPeriod->format('Y')) {
				$this->budgetService->activateGlAccountYear($newAccountingPeriod->format('Y'));
			}

			$this->purchaseorderGateway->commit();
		} catch(\Exception $e) {
			$this->purchaseorderGateway->rollback();
		}
	}

}

?>