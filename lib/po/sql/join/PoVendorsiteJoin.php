<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PURCHASEORDER to VENDORSITE table
 *
 * @author Thomas Messier
 */
class PoVendorsiteJoin extends Join {
	
	public function __construct($cols=array('vendor_id','vendorsite_id','vendorsite_status'), $type=Select::JOIN_INNER, $toAlias='vs', $fromAlias='p') {
		$this->setTable(array($toAlias=>'vendorsite'))
			->setCondition("{$fromAlias}.vendorsite_id = {$toAlias}.vendorsite_id")
			->setCols($cols)
			->setType($type);
	}
	
}