<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * YtdBudgetPctByGl rule type
 *
 * @author Thomas Messier
 */
class YtdBudgetPctByGl extends AbstractRuleType implements RuleTypeInterface {
	protected $type = 'account';

	public function isActive(\NP\workflow\WorkflowableInterface $entity, \NP\workflow\WFRuleEntity $rule) {
		if (array_key_exists($entity->glaccount_id, $scope)) {
			$budgetInfo = $this->entityService->getYearlyLineBudgetInfo(
				$entity->property_id,
				$entity->glaccount_id,
				$entity->getPeriod(),
				$this->type
			);
			$open_total = $budgetInfo['year_actual'] + $budgetInfo['year_invoice'] + $budgetInfo['year_po'];

			$overage = $open_total - $budgetInfo['year_budget'];

			$compare_amount     = ($rule->wfrule_number / 100) * $budgetInfo['year_budget'];
			$compare_amount_end = ($rule->wfrule_number_end / 100) * $budgetInfo['year_budget'];

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
		return '{entity} item exceeds YTD Budget % Overage limit for GL code';
	}
}

?>