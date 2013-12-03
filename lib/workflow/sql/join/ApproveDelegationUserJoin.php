<?php

namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from APPROVE to USERPROFILE table for delegation user
 *
 * @author Thomas Messier
 */
class ApproveDelegationUserJoin extends Join {
	
	public function __construct($cols=['delegation_to_userprofile_username'=>'userprofile_username'], $type=Select::JOIN_LEFT, $toAlias='ud', $fromAlias='a') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.delegation_to_userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}