<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDORSITE to VENDOR table
 *
 * @author Thomas Messier
 */
class VendorsiteVendorJoin extends Join {
	
	public function __construct($cols=array('vendor_name,vendor_id_alt,vendor_status'), $type=Select::JOIN_INNER, $toAlias='v', $fromAlias='vs') {
		$this->setTable(array($toAlias=>'vendor'))
			->setCondition("{$fromAlias}.vendor_id = {$toAlias}.vendor_id")
			->setCols($cols)
			->setType($type);
	}
	
}