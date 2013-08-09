<?php

namespace NP\user\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from STAFF to PERSON table
 *
 * @author Thomas Messier
 */
class StaffPersonJoin extends Join {
	
	public function __construct($cols=array('person_firstname','person_lastname'), $toAlias='pe', $fromAlias='s') {
		$this->setTable(array($toAlias=>'person'))
			->setCondition("{$fromAlias}.person_id = {$toAlias}.person_id")
			->setCols($cols)
			->setType(Select::JOIN_LEFT);
	}
	
}