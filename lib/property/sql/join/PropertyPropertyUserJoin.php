<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PROPERTY to PROPERTYUSERPROFILE table
 *
 * @author Thomas Messier
 */
class PropertyPropertyUserJoin extends Join {
	
	public function __construct($cols=array('userprofile_id'), $type=Select::JOIN_INNER, $toAlias='pu', $fromAlias='pr') {
		$this->setTable(array($toAlias=>'propertyuserprofile'))
			->setCondition("{$fromAlias}.property_id = {$toAlias}.property_id")
			->setCols($cols)
			->setType($type);
	}
	
}