<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from property to INTEGRATIONPACKAGE table
 *
 * @author Thomas Messier
 */
class PropertyIntPkgJoin extends Join {
	
	public function __construct($cols=array('integration_package_name'), $type=Select::JOIN_INNER, $toAlias='ipk', $fromAlias='pr') {
		$this->setTable(array($toAlias=>'integrationpackage'))
			->setCondition("{$fromAlias}.integration_package_id = {$toAlias}.integration_package_id")
			->setCols($cols)
			->setType($type);
	}
	
}