<?php

namespace NP\shared\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from either INVOICEITEM or POITEM to BUDGET table
 *
 * @author Thomas Messier
 */
class EntityLineBudgetJoin extends Join {
	
	public function __construct($table, $cols=array('budget_id','budget_amount','oracle_actual'), $type=Select::JOIN_LEFT, $toAlias='b', $fromEntityAlias=null, $fromGlYearAlias='gy') {
		if ($fromEntityAlias === null) {
			$fromEntityAlias = substr($table, 0, 1) . 'i';
		}
		$this->setTable(array($toAlias=>'budget'))
			->setCondition("
				{$toAlias}.glaccountyear_id = {$fromGlYearAlias}.glaccountyear_id
				AND {$toAlias}.budget_period = {$fromEntityAlias}.{$table}_period
			")
			->setCols($cols)
			->setType($type);
	}
	
}