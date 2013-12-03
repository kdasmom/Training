<?php

namespace NP\system\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from AUDITLOG to AUDITACTIVITY table
 *
 * @author Thomas Messier
 */
class AuditLogAuditActivityJoin extends Join {
	
	public function __construct($cols=array('auditactivity'), $type=Select::JOIN_INNER, $toAlias='aa', $fromAlias='al') {
		$this->setTable(array($toAlias=>'auditactivity'))
			->setCondition("{$fromAlias}.auditactivity_id = {$toAlias}.auditactivity_id")
			->setCols($cols)
			->setType($type);
	}
	
}