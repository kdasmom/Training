<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from UTILITYACCOUNT to GLACCOUNT table
 *
 * @author Thomas Messier
 */
class UtilityAccountGlAccountJoin extends Join {
	
	public function __construct($cols=array('glaccount_name','glaccount_number'), $type=Select::JOIN_LEFT, $toAlias='g', $fromAlias='ua') {
		$this->setTable(array($toAlias=>'glaccount'))
			->setCondition("{$fromAlias}.glaccount_id = {$toAlias}.glaccount_id")
			->setCols($cols)
			->setType($type);
	}
	
}