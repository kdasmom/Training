<?php

namespace NP\user\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from USERPROFILEROLE to STAFF table
 *
 * @author Thomas Messier
 */
class UserroleStaffJoin extends Join {
	
	public function __construct($cols=array('staff_id','person_id'), $toAlias='s', $fromAlias='ur') {
		$this->setTable(array($toAlias=>'staff'))
			->setCondition("{$fromAlias}.tablekey_id = {$toAlias}.staff_id")
			->setCols($cols)
			->setType(Select::JOIN_LEFT);
	}
	
}