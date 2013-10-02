<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDOR table to INTEGRATIONPACKAGE
 *
 * @author Thomas Messier
 */
class VendorIntPkgJoin extends Join {
	
	public function __construct($cols=array('integration_package_name'), $type=Select::JOIN_INNER, $toAlias='ipkg', $fromAlias='v') {
		$this->setTable(array($toAlias=>'integrationpackage'))
			->setCondition("{$fromAlias}.integration_package_id = {$toAlias}.integration_package_id")
			->setCols($cols)
			->setType($type);
	}
	
}