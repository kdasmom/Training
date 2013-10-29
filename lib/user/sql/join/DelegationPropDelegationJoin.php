<?php

namespace NP\user\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from DELEGATIONPROP to DELEGATION table
 *
 * @author Thomas Messier
 */
class DelegationPropDelegationJoin extends Join {
	
	public function __construct($cols=array('delegation_id'), $toAlias='d', $fromAlias='dp') {
		$this->setTable(array($toAlias=>'delegation'))
			->setCondition("{$fromAlias}.delegation_id = {$toAlias}.delegation_id")
			->setCols($cols)
			->setType(Select::JOIN_LEFT);
	}
	
}