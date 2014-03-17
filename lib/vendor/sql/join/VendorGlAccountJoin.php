<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDOR TO GLACCOUNT table
 *
 * @author Thomas Messier
 */
class VendorGlAccountJoin extends Join {
	
	public function __construct($cols=array('glaccount_id','glaccount_name','glaccount_number'), $type=Select::JOIN_LEFT, $toAlias='g', $fromAlias='v') {
		$this->setTable(array($toAlias=>'glaccount'))
			->setCondition("{$fromAlias}.default_glaccount_id = {$toAlias}.glaccount_id")
			->setCols($cols)
			->setType($type);
	}
	
}