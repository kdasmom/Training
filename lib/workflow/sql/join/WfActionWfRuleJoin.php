<?php

namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from WFACTION to WFRULE table
 *
 * @author Thomas Messier
 */
class WfActionWfRuleJoin extends Join {
	
	public function __construct($cols=[], $type=Select::JOIN_INNER, $toAlias='wr', $fromAlias='wa') {
		$this->setTable(array($toAlias=>'wfrule'))
			->setCondition("{$fromAlias}.wfrule_id = {$toAlias}.wfrule_id")
			->setCols($cols)
			->setType($type);
	}
	
}