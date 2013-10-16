<?php

namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from WFRULE to WFACTION table
 *
 * @author Thomas Messier
 */
class WfRuleWfActionJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='wa', $fromAlias='wr') {
		$this->setTable(array($toAlias=>'wfaction'))
			->setCondition("{$fromAlias}.wfrule_id = {$toAlias}.wfrule_id")
			->setCols($cols)
			->setType($type);
	}
	
}