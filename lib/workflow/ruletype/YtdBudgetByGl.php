<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * YtdBudgetPctByGl rule type
 *
 * @author Thomas Messier
 */
class YtdBudgetByGl extends AbstractRuleType implements RuleTypeInterface {
	protected $type = 'account';

	public function isActive(\NP\workflow\WorkflowableInterface $entity, \NP\workflow\WFRuleEntity $rule) {
		if (array_key_exists($entity->glaccount_id, $scope)) {
			$budgetInfo = $this->entityService->getYearlyLineBudgetInfo(
			$entity->property_id,
				$entity->glaccount_id,
				$entity->getPeriod(),
				$this->type
			);
			$variance   = ($budgetInfo['year_actual'] + $budgetInfo['year_invoice'] + $budgetInfo['year_po']) - $budgetInfo['year_budget'];

			if (
				$this->valueExceedsThreshold(
					$rule->wfrule_operand,
					$rule->wfrule_number,
					$rule->wfrule_number_end,
					$variance
				)
			) {
				return true;
			}
		}

		return false;
	}

	public function getDescription() {
		return '{entity} item exceeds YTD Budget Overage limit for GL code';
	}
}

?>