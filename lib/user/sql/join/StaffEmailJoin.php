<?php

namespace NP\user\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from STAFF to EMAIL table
 *
 * @author Thomas Messier
 */
class StaffEmailJoin extends Join {
	
	public function __construct($cols=array('email_id','email_address'), $toAlias='ea', $fromAlias='s') {
		$this->setTable(array($toAlias=>'email'))
			->setCondition("{$fromAlias}.staff_id = {$toAlias}.tablekey_id AND ea.table_name = 'email'")
			->setCols($cols)
			->setType(Select::JOIN_LEFT);
	}
	
}