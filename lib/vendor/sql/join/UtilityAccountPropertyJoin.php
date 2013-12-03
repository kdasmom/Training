<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from UTILITYACCOUNT to PROPERTY table
 *
 * @author Thomas Messier
 */
class UtilityAccountPropertyJoin extends Join {
	
	public function __construct($cols=array('property_id_alt','property_name','property_status'), $type=Select::JOIN_INNER, $toAlias='pr', $fromAlias='ua') {
		$this->setTable(array($toAlias=>'property'))
			->setCondition("{$fromAlias}.property_id = {$toAlias}.property_id")
			->setCols($cols)
			->setType($type);
	}
	
}