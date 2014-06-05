<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from RCTITEM to RECEIPT table
 *
 * @author Thomas Messier
 */
class RctItemReceiptJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='r', $fromAlias='ri') {
		$this->setTable(array($toAlias=>'receipt'))
			->setCondition("{$fromAlias}.receipt_id = {$toAlias}.receipt_id")
			->setCols($cols)
			->setType($type);
	}
	
}