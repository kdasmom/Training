<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from UTILITY to PHONE table
 *
 * @author Thomas Messier
 */
class UtilityPhoneJoin extends Join {
	
	public function __construct($cols=array('phone_id','phone_countrycode','phone_number','phone_ext'), $type=Select::JOIN_LEFT, $toAlias='ph', $fromAlias='ut') {
		$this->setTable(array($toAlias=>'phone'))
			->setCondition("{$fromAlias}.utility_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'utility'")
			->setCols($cols)
			->setType($type);
	}
	
}