<?php

namespace NP\budget\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from BUDGETOVERAGE to ROLE table
 *
 * @author Thomas Messier
 */
class BudgetOverageRoleJoin extends Join {
	
	public function __construct($cols=array('role_name'), $type=Select::JOIN_INNER, $toAlias='r', $fromAlias='bo') {
		$this->setTable(array($toAlias=>'role'))
			->setCondition("{$fromAlias}.role_id = {$toAlias}.role_id")
			->setCols($cols)
			->setType($type);
	}
	
}