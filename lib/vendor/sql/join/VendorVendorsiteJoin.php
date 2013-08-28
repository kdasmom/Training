<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDOR to VENDORSITE table
 *
 * @author Thomas Messier
 */
class VendorVendorsiteJoin extends Join {
	
	public function __construct($cols=array('vendorsite_id'), $type=Select::JOIN_INNER, $toAlias='vs', $fromAlias='v') {
		$this->setTable(array($toAlias=>'vendorsite'))
			->setCondition("{$fromAlias}.vendor_id = {$toAlias}.vendor_id")
			->setCols($cols)
			->setType($type);
	}
	
}