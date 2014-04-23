<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleHourJoin extends Join {
	public function __construct($cols = [], $type = Select::JOIN_INNER, $toAlias = 'WFH', $fromAlias = 'WF') {
		$this->setTable([$toAlias => 'wfrulehour'])
			 ->setCondition("{$fromAlias}.wfrule_id = {$toAlias}.wfrule_id")
			 ->setCols($cols)
			 ->setType($type);
	}
}