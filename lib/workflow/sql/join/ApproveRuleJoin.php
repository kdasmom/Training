<?php

namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from APPROVE to WFRULE table
 *
 * @author Thomas Messier
 */
class ApproveRuleJoin extends Join {
	
	public function __construct($cols=array('wfrule_name'), $type=Select::JOIN_LEFT, $toAlias='wr', $fromAlias='a') {
		$this->setTable(array($toAlias=>'wfrule'))
			->setCondition("{$fromAlias}.wfrule_id = {$toAlias}.wfrule_id")
			->setCols($cols)
			->setType($type);
	}
	
}