<?php

namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from APPROVE to BUDGET table
 *
 * @author Thomas Messier
 */
class ApproveBudgetJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_LEFT, $toAlias='b', $fromAlias='a') {
		$this->setTable(array($toAlias=>'budget'))
			->setCondition("{$fromAlias}.budget_id = {$toAlias}.budget_id")
			->setCols($cols)
			->setType($type);
	}
	
}