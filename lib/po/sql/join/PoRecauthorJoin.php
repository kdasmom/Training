<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PURCHASEORDER to RECAUTHOR table
 *
 * @author Thomas Messier
 */
class PoRecauthorJoin extends Join {
	
	public function __construct($cols=array('recauthor_id'), $type=Select::JOIN_LEFT, $toAlias='ra', $fromAlias='p') {
		$this->setTable(array($toAlias=>'recauthor'))
			->setCondition("{$fromAlias}.purchaseorder_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'purchaseorder'")
			->setCols($cols)
			->setType($type);
	}
	
}