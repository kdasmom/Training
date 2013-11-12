<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from UTILITYTYPE to UTILITYCOLUMN_USAGETYPE table
 *
 * @author Thomas Messier
 */
class UtilityTypeUtilityColumnUsageTypeJoin extends Join {
	
	public function __construct($cols=['UtilityColumn_UsageType_Id','UtilityColumn_UsageType_Name'], $type=Select::JOIN_LEFT, $toAlias='ucut', $fromAlias='utt') {
		$this->setTable(array($toAlias=>'utilitycolumn_usagetype'))
			->setCondition("{$fromAlias}.UtilityType_Id = {$toAlias}.UtilityType_Id")
			->setCols($cols)
			->setType($type);
	}
	
}