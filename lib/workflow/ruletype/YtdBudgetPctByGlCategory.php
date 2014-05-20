<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * YtdBudgetPctByGlCategory rule type
 *
 * @author Thomas Messier
 */
class YtdBudgetPctByGlCategory extends YtdBudgetPctByGl implements RuleTypeInterface {
	protected $type = 'category';

	public function getDescription() {
		return '{entity} item exceeds YTD Budget % Overage limit for GL category';
	}
}

?>