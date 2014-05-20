<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PURCHASEORDER to POITEM table
 *
 * @author Thomas Messier
 */
class PurchaseorderPoItemJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='pi', $fromAlias='p') {
		$this->setTable(array($toAlias=>'poitem'))
			->setCondition("{$fromAlias}.purchaseorder_id = {$toAlias}.purchaseorder_id")
			->setCols($cols)
			->setType($type);
	}
	
}