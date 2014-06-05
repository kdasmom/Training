<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * ConvertedInvoice rule type
 *
 * @author Thomas Messier
 */
class ConvertedInvoice extends AbstractRuleType implements RuleTypeInterface {
	
	public function isActive(\NP\workflow\WorkflowableInterface $entity, \NP\workflow\WFRuleEntity $rule) {
		$gtw = $this->GatewayManager->get('InvoiceGateway');
		
		// Only process if an association to a PO exists
		if (!$gtw->hasPoAssociations($entity->invoice_id)) {
			return false;
		}

		return $this->valueExceedsThreshold(
			$rule->wfrule_operand,
			$rule->wfrule_number,
			$rule->wfrule_number_end,
			$entity->getAmount()
		);
	}

	public function isLineRule() {
		return false;
	}

	public function getDescription() {
		return 'Invoice total exceeds Dollar Amount.';
	}
}

?>