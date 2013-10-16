<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from POITEM to PURCHASEORDER table
 *
 * @author Thomas Messier
 */
class PoItemPurchaseorderJoin extends Join {
	
	public function __construct($cols=array('purchaseorder_ref','purchaseorder_status'), $type=Select::JOIN_INNER, $toAlias='p', $fromAlias='pi') {
		$this->setTable(array($toAlias=>'purchaseorder'))
			->setCondition("{$fromAlias}.purchaseorder_id = {$toAlias}.purchaseorder_id")
			->setCols($cols)
			->setType($type);
	}
	
}