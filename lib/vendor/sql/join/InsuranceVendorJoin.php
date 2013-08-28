<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INSURANCE table to VENDOR
 *
 * @author Thomas Messier
 */
class InsuranceVendorJoin extends Join {
	
	public function __construct($cols=array('vendor_id','vendor_name','vendor_id_alt','integration_package_id'), $type=Select::JOIN_INNER, $toAlias='v', $fromAlias='ins') {
		$this->setTable(array($toAlias=>'vendor'))
			->setCondition("{$fromAlias}.tablekey_id = {$toAlias}.vendor_id")
			->setCols($cols)
			->setType($type);
	}
	
}