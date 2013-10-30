<?php

namespace NP\budget\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from BUDGETOVERAGE to GLACCOUNT table
 *
 * @author Thomas Messier
 */
class BudgetOverageGlAccountJoin extends Join {
	
	public function __construct($cols=array('glaccount_number','glaccount_name'), $type=Select::JOIN_INNER, $toAlias='g', $fromAlias='bo') {
		$this->setTable(array($toAlias=>'glaccount'))
			->setCondition("{$fromAlias}.glaccount_id = {$toAlias}.glaccount_id")
			->setCols($cols)
			->setType($type);
	}
	
}