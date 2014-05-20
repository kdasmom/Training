<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * ItemByDept rule type
 *
 * @author Thomas Messier
 */
class ItemByDept extends AbstractRuleType implements RuleTypeInterface {
	
	public function isActive(\NP\workflow\WorkflowableInterface $entity, \NP\workflow\WFRuleEntity $rule) {
		$scope = $rule->getScope();
		
		if (array_key_exists($entity->unit_id, $scope)) {
			if (
				$this->valueExceedsThreshold(
					$rule->wfrule_operand,
					$rule->wfrule_number,
					$rule->wfrule_number_end,
					$entity->getAmount()
				)
			) {
				return true;
			}
		}

		return false;
	}

	public function getDescription() {
		return '{entity} item exceeds approved limit for Department.';
	}
}

?>