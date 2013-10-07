<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from UTILITY to VENDORSITE table
 *
 * @author Thomas Messier
 */
class UtilityVendorsiteJoin extends Join {
	
	public function __construct($cols=array('vendor_id'), $type=Select::JOIN_INNER, $toAlias='vs', $fromAlias='ut') {
		$this->setTable(array($toAlias=>'vendorsite'))
			->setCondition("{$fromAlias}.vendorsite_id = {$toAlias}.vendorsite_id")
			->setCols($cols)
			->setType($type);
	}
	
}