<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from UTILITY to UTILITYTYPE table
 *
 * @author Thomas Messier
 */
class UtilityUtilityTypeJoin extends Join {
	
	public function __construct($cols=array('UtilityType','universal_field_status'), $type=Select::JOIN_INNER, $toAlias='utt', $fromAlias='ut') {
		$this->setTable(array($toAlias=>'utilitytype'))
			->setCondition("{$fromAlias}.UtilityType_Id = {$toAlias}.UtilityType_Id")
			->setCols($cols)
			->setType($type);
	}
	
}