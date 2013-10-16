<?php

namespace NP\system\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from AUDITLOG to AUDITTYPE table
 *
 * @author Thomas Messier
 */
class AuditLogAuditTypeJoin extends Join {
	
	public function __construct($cols=array('audittype'), $type=Select::JOIN_INNER, $toAlias='at', $fromAlias='al') {
		$this->setTable(array($toAlias=>'audittype'))
			->setCondition("{$fromAlias}.audittype_id = {$toAlias}.audittype_id")
			->setCols($cols)
			->setType($type);
	}
	
}