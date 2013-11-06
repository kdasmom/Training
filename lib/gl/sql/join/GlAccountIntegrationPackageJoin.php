<?php

namespace NP\gl\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from GLACCOUNT to INTEGRATIONPACKAGE table
 *
 * @author Thomas Messier
 */
class GlAccountIntegrationPackageJoin extends Join {
	
	public function __construct($cols=['integration_package_name'], $type=Select::JOIN_INNER, $toAlias='ipkg', $fromAlias='g') {
		$this->setTable(array($toAlias=>'integrationpackage'))
			->setCondition("{$fromAlias}.integration_package_id = {$toAlias}.integration_package_id")
			->setCols($cols)
			->setType($type);
	}
	
}