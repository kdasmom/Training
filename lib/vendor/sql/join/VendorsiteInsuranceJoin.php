<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDORSITE to VENDOR table
 *
 * @author Thomas Messier
 */
class VendorsiteInsuranceJoin extends Join {
	
	public function __construct($cols=array('insurance_id'), $type=Select::JOIN_INNER, $toAlias='ins', $fromAlias='vs') {
		$this->setTable(array($toAlias=>'insurance'))
			->setCondition("{$fromAlias}.vendor_id = {$toAlias}.tablekey_id")
			->setCols($cols)
			->setType($type);
	}
	
}