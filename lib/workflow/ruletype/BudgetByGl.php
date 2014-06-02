<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * BudgetByGl rule type
 *
 * @author Thomas Messier
 */
class BudgetByGl extends AbstractRuleType implements RuleTypeInterface {
	
	public function isActive(\NP\workflow\WorkflowableInterface $entity, \NP\workflow\WFRuleEntity $rule) {
		$suppressBudgetGl = '0';

		if ($entity instanceOf \NP\invoice\InvoiceEntity) {
			$suppressBudgetGl = $this->configService->get('WORKFLOW_onlyPO_BudgetGLCode', '0');
			$itemField        = 'invoiceitem_id';
			$periodField      = 'invoiceitem_period';
		} else if ($entity instanceOf \NP\po\PurchaseOrderEntity) {
			$itemField   = 'poitem_id';
			$periodField = 'poitem_period';
		}

		if ($suppressBudgetGl == '0' && array_key_exists($entity->glaccount_id, $scope)) {
			$budgetInfo = $this->entityService->getMonthlyLineBudgetInfo(
				$entity->property_id,
				$entity->glaccount_id,
				$entity->getPeriod(),
				'account'
			);
			$variance   = ($budgetInfo['month_actual'] + $budgetInfo['month_invoice'] + $budgetInfo['month_po']) - $budgetInfo['month_budget'];

			$overage_amount = $this->getOverage($entity->glaccount_id, $entity->property_id, $entity->$periodField);

			if ($overage_amount === null) {
				$gl             = $this->gatewayManager->get('GlAccountGateway')->findById($entity->glaccount_id, []);
				$overage_amount = $this->getOverage(
					$gl['glaccount_category_id'],
					$entity->property_id,
					$entity->$periodField
				);
			}

			if (empty($overage_amount)) {
				$overage_amount = 0;
			}

			$compare_amount += $rule->wfrule_number + $overage_amount;

			if (
				$this->valueExceedsThreshold(
					$rule->wfrule_operand,
					$compare_amount,
					$rule->wfrule_number_end,
					$variance
				)
			) {
				return true;
			}
		}

		return false;
	}

	public function getOverage($glaccount_id, $property_id, $period) {
		return $this->gatewayManager->get('BudgetOverageGateway')->findValue(
			[
				'glaccount_id'         => '?',
				'property_id'          => '?',
				'budgetoverage_period' => '?'
			],
			[$glaccount_id, $property_id, $period],
			'budgetoverage_amount'
		);
	}

	public function getDescription() {
		return 'Budget exceeds approved limit.';
	}
}

?>