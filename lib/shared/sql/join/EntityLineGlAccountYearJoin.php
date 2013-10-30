<?php

namespace NP\shared\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from either INVOICEITEM or POITEM to GLACCOUNTYEAR table
 *
 * @author Thomas Messier
 */
class EntityLineGlAccountYearJoin extends Join {
	
	public function __construct($table, $cols=array('glaccountyear_id'), $type=Select::JOIN_LEFT, $toAlias='gy', $fromAlias=null) {
		if ($fromAlias === null) {
			$fromAlias = substr($table, 0, 1) . 'i';
		}
		$this->setTable(array($toAlias=>'glaccountyear'))
			->setCondition("
				{$toAlias}.property_id = {$fromAlias}.property_id
				AND {$toAlias}.glaccount_id = {$fromAlias}.glaccount_id
				AND {$toAlias}.glaccountyear_year = YEAR({$fromAlias}.{$table}_period)
			")
			->setCols($cols)
			->setType($type);
	}
	
}