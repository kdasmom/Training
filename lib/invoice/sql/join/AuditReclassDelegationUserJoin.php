<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from AUDITLOG to USERPROFILE table for delegation user
 *
 * @author Thomas Messier
 */
class AuditReclassDelegationUserJoin extends Join {
	
	public function __construct($cols=array('delegation_to_userprofile_username'=>'userprofile_username'), $type=Select::JOIN_LEFT, $toAlias='ud', $fromAlias='ar') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.delegation_to_userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}