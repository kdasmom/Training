<?php
namespace NP\workflow\ruletype;

use NP\core\GatewayManager;

/**
 * MtdBudgetPctByGlCategory rule type
 *
 * @author Thomas Messier
 */
class MtdBudgetPctByGlCategory extends MtdBudgetPctByGl implements RuleTypeInterface {
	protected $type = 'category';

	public function getDescription() {
		return '{entity} item exceeds MTD Budget % Overage limit for GL category';
	}
}

?>