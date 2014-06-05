<?php
namespace NP\workflow\ruletype;

/**
 * Interface for a workflow rule
 *
 * @author Thomas Messier
 */
interface RuleTypeInterface {
	public function isActive(\NP\workflow\WorkflowableInterface $obj, \NP\workflow\WFRuleEntity $rule);
	public function getScope($wfrule_id);
	public function isLineRule();
	public function getDescription();
}

?>