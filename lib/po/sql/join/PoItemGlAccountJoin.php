<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from POITEM to GLACCOUNT table
 *
 * @author Thomas Messier
 */
class PoItemGlAccountJoin extends Join {
	
	public function __construct($cols=array('glaccount_name','glaccount_number'), $type=Select::JOIN_INNER, $toAlias='g', $fromAlias='pi') {
		$this->setTable(array($toAlias=>'glaccount'))
			->setCondition("{$fromAlias}.glaccount_id = {$toAlias}.glaccount_id")
			->setCols($cols)
			->setType($type);
	}
	
}