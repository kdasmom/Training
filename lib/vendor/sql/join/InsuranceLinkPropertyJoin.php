<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INSURANCE table to LINK_INSURANCE_PROPERTY
 *
 * @author Thomas Messier
 */
class InsuranceLinkPropertyJoin extends Join {
	
	public function __construct($cols=array('link_insurance_property_id','property_id'), $type=Select::JOIN_INNER, $toAlias='lip', $fromAlias='ins') {
		$this->setTable(array($toAlias=>'link_insurance_property'))
			->setCondition("{$fromAlias}.insurance_id = {$toAlias}.insurance_id")
			->setCols($cols)
			->setType($type);
	}
	
}