<?php

namespace NP\system\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from TREE to GLACCOUNT table
 *
 * @author Thomas Messier
 */
class TreeParentGlCategoryJoin extends Join {
	
	public function __construct($cols=array('glaccount_id','glaccount_name'), $type=Select::JOIN_INNER, $toAlias='g2', $fromAlias='tr2') {
		$this->setTable(array($toAlias=>'glaccount'))
			->setCondition("{$fromAlias}.tablekey_id = {$toAlias}.glaccount_id")
			->setCols($cols)
			->setType($type);
	}
	
}