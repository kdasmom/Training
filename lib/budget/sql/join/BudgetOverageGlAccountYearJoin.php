<?php

namespace NP\budget\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from BUDGETOVERAGE to GLACCOUNT table
 *
 * @author Thomas Messier
 */
class BudgetOverageGlAccountYearJoin extends Join {
	
	public function __construct($cols=[], $type=Select::JOIN_LEFT, $toAlias='gy', $fromAlias='bo') {
		$this->setTable(array($toAlias=>'glaccountyear'))
			->setCondition("{$fromAlias}.glaccount_id = {$toAlias}.glaccount_id AND {$fromAlias}.property_id = {$toAlias}.property_id AND YEAR({$fromAlias}.budgetoverage_period) = {$toAlias}.glaccountyear_year")
			->setCols($cols)
			->setType($type);
	}
	
}