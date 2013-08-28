<?php

namespace NP\user\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from RECAUTHOR to USERPROFILE table
 *
 * @author Thomas Messier
 */
class RecauthorUserprofileJoin extends Join {
	
	public function __construct($cols=array('userprofile_username'), $toAlias='u', $fromAlias='ra') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType(Select::JOIN_LEFT);
	}
	
}