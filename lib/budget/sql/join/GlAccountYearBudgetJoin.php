<?php

namespace NP\budget\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from GLACCOUNTYEAR to BUDGET table
 *
 * @author Thomas Messier
 */
class GlAccountYearBudgetJoin extends Join {
	
	public function __construct($cols=array('budget_id','budget_period','budget_amount','oracle_actual'), $type=Select::JOIN_INNER, $toAlias='b', $fromAlias='gy') {
		$this->setTable(array($toAlias=>'budget'))
			->setCondition("{$fromAlias}.glaccountyear_id = {$toAlias}.glaccountyear_id")
			->setCols($cols)
			->setType($type);
	}
	
}