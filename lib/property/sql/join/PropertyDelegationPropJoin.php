<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PROPERTY to DELEGATIONPROP table
 *
 * @author Thomas Messier
 */
class PropertyDelegationPropJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='dp', $fromAlias='pr') {
		$this->setTable(array($toAlias=>'delegationprop'))
			->setCondition("{$fromAlias}.property_id = {$toAlias}.property_id")
			->setCols($cols)
			->setType($type);
	}
	
}