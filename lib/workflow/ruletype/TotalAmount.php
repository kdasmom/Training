<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * TotalAmount rule type
 *
 * @author Thomas Messier
 */
class TotalAmount extends AbstractRuleType implements RuleTypeInterface {
	
	public function isActive(\NP\workflow\WorkflowableInterface $entity, \NP\workflow\WFRuleEntity $rule) {
		return $this->valueExceedsThreshold(
			$rule->wfrule_operand,
			$rule->wfrule_number,
			$rule->wfrule_number_end,
			$entity->getAmount()
		);
	}

	public function getScope($wfrule_id) {
		return [];
	}

	public function isLineRule() {
		return false;
	}

	public function getDescription() {
		return '{entity} total exceeds amount.';
	}
}

?>