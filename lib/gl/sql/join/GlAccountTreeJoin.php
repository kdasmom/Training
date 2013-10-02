<?php

namespace NP\gl\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from GLACCOUNT to TREE table
 *
 * @author Thomas Messier
 */
class GlAccountTreeJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='tr', $fromAlias='g') {
		$this->setTable(array($toAlias=>'tree'))
			->setCondition("{$fromAlias}.glaccount_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'glaccount'")
			->setCols($cols)
			->setType($type);
	}
	
}