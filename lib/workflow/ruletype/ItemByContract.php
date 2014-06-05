<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * ItemByContract rule type
 *
 * @author Thomas Messier
 */
class ItemByContract extends AbstractRuleType implements RuleTypeInterface {
	
	public function isActive(\NP\workflow\WorkflowableInterface $entity, \NP\workflow\WFRuleEntity $rule) {
		$scope = $rule->getScope();

		if (array_key_exists($entity->rawLoadedData['jbcontract_id'], $scope)) {
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
		return '{entity} item exceeds approved limit for job contract.';
	}
}

?>