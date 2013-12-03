<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from UTILITYACCOUNT to UTILITY table
 *
 * @author Thomas Messier
 */
class UtilityAccountUtilityJoin extends Join {
	
	public function __construct($cols=array('Vendorsite_Id','UtilityType_Id'), $type=Select::JOIN_INNER, $toAlias='ut', $fromAlias='ua') {
		$this->setTable(array($toAlias=>'utility'))
			->setCondition("{$fromAlias}.Utility_Id = {$toAlias}.Utility_Id")
			->setCols($cols)
			->setType($type);
	}
	
}