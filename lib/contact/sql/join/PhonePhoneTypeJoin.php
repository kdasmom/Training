<?php

namespace NP\contact\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PHONE to PHONETYPE table
 *
 * @author Thomas Messier
 */
class PhonePhoneTypeJoin extends Join {
	
	public function __construct($phonetype_name='main', $cols=array('phonetype_name'), $type=Select::JOIN_LEFT, $toAlias='pht', $fromAlias='ph') {
		// Check the phone type since we're inserting in SQL to make sure it's safe
		if (!in_array($phonetype_name, array('Main','Home','Work','Other','Cell','Fax'))) {
			throw new \NP\core\Exception('Argument $phonetype_name is invalid');
		}
		
		$this->setTable(array($toAlias=>'phonetype'))
			->setCondition("{$fromAlias}.phonetype_id = {$toAlias}.phonetype_id AND {$toAlias}.phonetype_name = '{$phonetype_name}'")
			->setCols($cols)
			->setType($type);
	}
	
}