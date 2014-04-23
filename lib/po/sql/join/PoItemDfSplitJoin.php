<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from POITEM to DFSPLIT table
 *
 * @author Thomas Messier
 */
class PoItemDfSplitJoin extends Join {
	
	public function __construct($cols=array('dfsplit_name'), $type=Select::JOIN_LEFT, $toAlias='df', $fromAlias='pi') {
		$this->setTable(array($toAlias=>'dfsplit'))
			->setCondition("{$fromAlias}.dfsplit_id = {$toAlias}.dfsplit_id")
			->setCols($cols)
			->setType($type);
	}
	
}