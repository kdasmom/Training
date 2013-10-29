<?php

namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from APPROVE to APPROVETYPE table
 *
 * @author Thomas Messier
 */
class ApproveApproveTypeJoin extends Join {
	
	public function __construct($cols=array('approvetype_name'), $type=Select::JOIN_INNER, $toAlias='at', $fromAlias='a') {
		$this->setTable(array($toAlias=>'approvetype'))
			->setCondition("{$fromAlias}.approvetype_id = {$toAlias}.approvetype_id")
			->setCols($cols)
			->setType($type);
	}
	
}