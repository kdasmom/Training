<?php

namespace NP\system\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from AUDITLOG to USERPROFILE table for delgation user
 *
 * @author Thomas Messier
 */
class AuditLogDelegationUserJoin extends Join {
	
	public function __construct($cols=array('userprofile_username'), $type=Select::JOIN_LEFT, $toAlias='ud', $fromAlias='al') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}