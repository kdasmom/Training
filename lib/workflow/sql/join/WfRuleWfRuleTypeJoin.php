<?php

namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from WFRULE to WFRULETYPE table
 *
 * @author Thomas Messier
 */
class WfRuleWfRuleTypeJoin extends Join {
	
	public function __construct($cols=array('wfruletype_id','wfruletype_name'), $type=Select::JOIN_INNER, $toAlias='wrt', $fromAlias='wr') {
		$this->setTable(array($toAlias=>'wfruletype'))
			->setCondition("{$fromAlias}.wfruletype_id = {$toAlias}.wfruletype_id")
			->setCols($cols)
			->setType($type);
	}
	
}