<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from UTILITY to UTILITYACCOUNT table
 *
 * @author Thomas Messier
 */
class UtilityUtilityAccountJoin extends Join {
	
	public function __construct($cols=[], $type=Select::JOIN_INNER, $toAlias='ua', $fromAlias='ut') {
		$this->setTable(array($toAlias=>'utilityaccount'))
			->setCondition("{$fromAlias}.Utility_Id = {$toAlias}.Utility_Id")
			->setCols($cols)
			->setType($type);
	}
	
}