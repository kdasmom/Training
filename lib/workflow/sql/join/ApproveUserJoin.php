<?php

namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PURCHASEORDER to APPROVE table
 *
 * @author Thomas Messier
 */
class ApproveUserJoin extends Join {
	
	public function __construct($cols=array('userprofile_username'), $type=Select::JOIN_INNER, $toAlias='u', $fromAlias='a') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}