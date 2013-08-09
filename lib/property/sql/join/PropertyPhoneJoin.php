<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from property to region table
 *
 * @author Thomas Messier
 */
class PropertyPhoneJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='ph', $fromAlias='p') {
		$this->setTable(array($toAlias=>'phone'))
			->setCondition("{$toAlias}.tablekey_id = {$fromAlias}.property_id AND {$toAlias}.table_name = 'property' AND {$toAlias}.phonetype_id = (SELECT phonetype_id FROM phonetype WHERE phonetype_name = 'Main')")
			->setCols($cols)
			->setType($type);
	}
	
}