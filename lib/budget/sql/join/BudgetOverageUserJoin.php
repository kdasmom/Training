<?php

namespace NP\budget\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from BUDGETOVERAGE to USERPROFILE table
 *
 * @author Thomas Messier
 */
class BudgetOverageUserJoin extends Join {
	
	public function __construct($cols=array('userprofile_username'), $type=Select::JOIN_INNER, $toAlias='u', $fromAlias='bo') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}