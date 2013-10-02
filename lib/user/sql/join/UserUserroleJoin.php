<?php

namespace NP\user\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from USERPROFILE to USERPROFILEROLE table
 *
 * @author Thomas Messier
 */
class UserUserroleJoin extends Join {
	
	public function __construct($cols=array('userprofilerole_id'), $toAlias='ur', $fromAlias='u') {
		$this->setTable(array($toAlias=>'userprofilerole'))
			->setCondition("{$fromAlias}.userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType(Select::JOIN_LEFT);
	}
	
}