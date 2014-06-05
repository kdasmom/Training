<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * YearlyBudgetByGlCategory rule type
 *
 * @author Thomas Messier
 */
class YearlyBudgetByGlCategory extends YearlyBudgetByGl implements RuleTypeInterface {
	protected $type = 'category';
}

?>