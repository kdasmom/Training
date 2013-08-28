<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from RECEIPT to APPROVE table
 *
 * @author Thomas Messier
 */
class ReceiptApproveJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='a', $fromAlias='r') {
		$this->setTable(array($toAlias=>'approve'))
			->setCondition("{$fromAlias}.receipt_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'receipt'")
			->setCols($cols)
			->setType($type);
	}
	
}