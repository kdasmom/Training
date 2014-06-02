<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * MtdBudgetPctByGl rule type
 *
 * @author Thomas Messier
 */
class MtdBudgetPctByGl extends AbstractRuleType implements RuleTypeInterface {
	protected $type = 'account';

	public function isActive(\NP\workflow\WorkflowableInterface $entity, \NP\workflow\WFRuleEntity $rule) {
		if (array_key_exists($entity->glaccount_id, $scope)) {
			$budgetInfo = $this->entityService->getMonthlyLineBudgetInfo(
				$entity->property_id,
				$entity->glaccount_id,
				$entity->getPeriod(),
				$this->type
			);
			$open_total = $budgetInfo['month_actual'] + $budgetInfo['month_invoice'] + $budgetInfo['month_po'];

			$overage = $open_total - $budgetInfo['month_budget'];

			$compare_amount     = ($rule->wfrule_number / 100) * $budgetInfo['month_budget'];
			$compare_amount_end = ($rule->wfrule_number_end / 100) * $budgetInfo['month_budget'];

			if (
				$this->valueExceedsThreshold(
					$rule->wfrule_operand,
					$compare_amount,
					$compare_amount_end,
					$overage
				)
			) {
				return true;
			}
		}

		return false;
	}

	public function getDescription() {
		return '{entity} item exceeds MTD Budget % Overage limit for GL code';
	}
}

?>