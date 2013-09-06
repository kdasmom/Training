<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from property to region table
 *
 * @author Thomas Messier
 */
class PropertyRegionJoin extends Join {
	
	public function __construct($cols=array('region_name'), $type=Select::JOIN_INNER, $toAlias='rg', $fromAlias='pr') {
		$this->setTable(array($toAlias=>'region'))
			->setCondition("{$fromAlias}.region_id = {$toAlias}.region_id")
			->setCols($cols)
			->setType($type);
	}
	
}