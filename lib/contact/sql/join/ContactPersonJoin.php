<?php

namespace NP\contact\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from CONTACT to PERSON table
 *
 * @author Thomas Messier
 */
class ContactPersonJoin extends Join {
	
	public function __construct($cols=array('person_id','person_firstname','person_middlename','person_lastname'), $type=Select::JOIN_LEFT, $toAlias='pe', $fromAlias='c') {
		$this->setTable(array($toAlias=>'person'))
			->setCondition("{$fromAlias}.person_id = {$toAlias}.person_id")
			->setCols($cols)
			->setType($type);
	}
	
}