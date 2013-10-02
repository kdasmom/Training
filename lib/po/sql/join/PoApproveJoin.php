<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PURCHASEORDER to APPROVE table
 *
 * @author Thomas Messier
 */
class PoApproveJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='a', $fromAlias='p') {
		$this->setTable(array($toAlias=>'approve'))
			->setCondition("{$fromAlias}.purchaseorder_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'purchaseorder'")
			->setCols($cols)
			->setType($type);
	}
	
}