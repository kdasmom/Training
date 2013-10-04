<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDORGLACCOUNTS TO GLACCOUNT table
 *
 * @author Thomas Messier
 */
class VendorGlGlAccountJoin extends Join {
	
	public function __construct($cols=array('glaccount_id','glaccount_name','glaccount_number'), $type=Select::JOIN_INNER, $toAlias='g', $fromAlias='vg') {
		$this->setTable(array($toAlias=>'glaccount'))
			->setCondition("{$fromAlias}.glaccount_id = {$toAlias}.glaccount_id")
			->setCols($cols)
			->setType($type);
	}
	
}