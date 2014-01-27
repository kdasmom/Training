<?php

namespace NP\system\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from TREE table to parent item in TREE table
 *
 * @author Thomas Messier
 */
class TreeTreeParentJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='tr2', $fromAlias='tr') {
		$this->setTable(array($toAlias=>'tree'))
			->setCondition("{$fromAlias}.tree_parent = {$toAlias}.tree_id")
			->setCols($cols)
			->setType($type);
	}
	
}