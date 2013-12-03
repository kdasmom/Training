<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDORSITE to VENDORGLACCOUNTS table
 *
 * @author Thomas Messier
 */
class VendorsiteVendorGlJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='vg', $fromAlias='vs') {
		$this->setTable(array($toAlias=>'vendorglaccounts'))
			->setCondition("{$fromAlias}.vendor_id = {$toAlias}.vendor_id")
			->setCols($cols)
			->setType($type);
	}
	
}