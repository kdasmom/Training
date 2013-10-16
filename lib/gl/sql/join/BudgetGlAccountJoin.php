<?php

namespace NP\gl\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from BUDGET to GLACCOUNT table
 *
 * @author Thomas Messier
 */
class BudgetGlAccountJoin extends Join {
	
	public function __construct($cols=array('glaccount_name'), $type=Select::JOIN_INNER, $toAlias='g', $fromAlias='b') {
		$this->setTable(array($toAlias=>'glaccount'))
			->setCondition("{$fromAlias}.glaccount_id = {$toAlias}.glaccount_id")
			->setCols($cols)
			->setType($type);
	}
	
}