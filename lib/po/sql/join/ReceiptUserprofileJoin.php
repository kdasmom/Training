<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from RECEIPT to USERPROFILE table
 *
 * @author Thomas Messier
 */
class ReceiptUserprofileJoin extends Join {
	
	public function __construct($cols=['userprofile_username'], $type=Select::JOIN_LEFT, $toAlias='uprct', $fromAlias='r') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}