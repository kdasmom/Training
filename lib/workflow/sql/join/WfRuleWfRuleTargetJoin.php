<?php

namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from WFRULE to WFRULETARGET table
 *
 * @author Thomas Messier
 */
class WfRuleWfRuleTargetJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='wrta', $fromAlias='wr') {
		$this->setTable(array($toAlias=>'wfruletarget'))
			->setCondition("{$fromAlias}.wfrule_id = {$toAlias}.wfrule_id")
			->setCols($cols)
			->setType($type);
	}
	
}