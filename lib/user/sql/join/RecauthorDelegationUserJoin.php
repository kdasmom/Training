<?php

namespace NP\user\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from RECAUTHOR to USERPROFILE table for delegated user
 *
 * @author Thomas Messier
 */
class RecauthorDelegationUserJoin extends Join {
	
	public function __construct($cols=array('delegation_to_userprofile_username'=>'userprofile_username'), $toAlias='ud', $fromAlias='ra') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.delegation_to_userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType(Select::JOIN_LEFT);
	}
	
}