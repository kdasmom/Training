<?php

namespace NP\system\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INTEGRATIONPACKAGE to INTEGRATIONPACAKGETYPE table
 *
 * @author Thomas Messier
 */
class IntPkgIntPkgTypeJoin extends Join {
	
	public function __construct($cols=array('Integration_Package_Type_Display_Name'), $type=Select::JOIN_INNER, $toAlias='ipkt', $fromAlias='ipk') {
		$this->setTable(array($toAlias=>'integrationpacakgetype'))
			->setCondition("{$fromAlias}.Integration_Package_Type_Id = {$toAlias}.Integration_Package_Type_Id")
			->setCols($cols)
			->setType($type);
	}
	
}