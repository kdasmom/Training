<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * TotalAmount rule type
 *
 * @author Thomas Messier
 */
class ItemByGlCategory extends AbstractRuleType implements RuleTypeInterface {
	
	public function isActive(\NP\workflow\WorkflowableInterface $entity, \NP\workflow\WFRuleEntity $rule) {
		$scope = $rule->getScope();
		
		$gl = $this->gatewayManager->get('GlAccountGateway')->findById($entity->glaccount_id, []);

		if (array_key_exists($gl['glaccount_category_id'], $scope)) {
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
		return '{entity} item exceeds approved limit for GL Category.';
	}
}

?>