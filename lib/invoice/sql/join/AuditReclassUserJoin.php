<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from AUDITLOG to USERPROFILE table
 *
 * @author Thomas Messier
 */
class AuditReclassUserJoin extends Join {
	
	public function __construct($cols=array('userprofile_username'), $type=Select::JOIN_LEFT, $toAlias='u', $fromAlias='ar') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}