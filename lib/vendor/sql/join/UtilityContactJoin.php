<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from UTILITY to CONTACT table
 *
 * @author Thomas Messier
 */
class UtilityContactJoin extends Join {
	
	public function __construct($cols=array('contact_id'), $type=Select::JOIN_LEFT, $toAlias='c', $fromAlias='ut') {
		$this->setTable(array($toAlias=>'contact'))
			->setCondition("{$fromAlias}.utility_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'utility'")
			->setCols($cols)
			->setType($type);
	}
	
}