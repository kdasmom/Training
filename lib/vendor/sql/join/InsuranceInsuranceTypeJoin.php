<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INSURANCE table to INSURANCETYPE
 *
 * @author Thomas Messier
 */
class InsuranceInsuranceTypeJoin extends Join {
	
	public function __construct($cols=array('insurancetype_name'), $type=Select::JOIN_INNER, $toAlias='inst', $fromAlias='ins') {
		$this->setTable(array($toAlias=>'insurancetype'))
			->setCondition("{$fromAlias}.insurancetype_id = {$toAlias}.insurancetype_id")
			->setCols($cols)
			->setType($type);
	}
	
}