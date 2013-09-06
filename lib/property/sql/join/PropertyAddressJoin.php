<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from property to region table
 *
 * @author Thomas Messier
 */
class PropertyAddressJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='adr', $fromAlias='pr') {
		$this->setTable(array($toAlias=>'address'))
			->setCondition("{$toAlias}.tablekey_id = {$fromAlias}.property_id AND {$toAlias}.table_name = 'property'")
			->setCols($cols)
			->setType($type);
	}
	
}