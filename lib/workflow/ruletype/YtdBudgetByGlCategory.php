<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * YtdBudgetPctByGl rule type
 *
 * @author Thomas Messier
 */
class YtdBudgetByGlCategory extends YtdBudgetByGl implements RuleTypeInterface {
	protected $type = 'category';

	public function getDescription() {
		return '{entity} item exceeds YTD Budget Overage limit for GL category';
	}
}

?>