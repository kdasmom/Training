<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from RECEIPT to VENDOR table
 *
 * @author Thomas Messier
 */
class ReceiptVendorJoin extends Join {
	
	public function __construct($cols=array('vendor_id_alt','vendor_name'), $type=Select::JOIN_INNER, $toAlias='v', $fromAlias='r') {
		$this->setTable(array($toAlias=>'vendor'))
			->setCondition("{$fromAlias}.vendor_id = {$toAlias}.vendor_id")
			->setCols($cols)
			->setType($type);
	}
	
}