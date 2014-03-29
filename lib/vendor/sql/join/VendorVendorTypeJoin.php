<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDOR to VENDORTYPE table
 *
 * @author Thomas Messier
 */
class VendorVendorTypeJoin extends Join {
	
	public function __construct($cols=array('vendortype_code','vendortype_name'), $type=Select::JOIN_INNER, $toAlias='vt', $fromAlias='v') {
		$this->setTable(array($toAlias=>'vendortype'))
			->setCondition("{$fromAlias}.vendortype_id = {$toAlias}.vendortype_id")
			->setCols($cols)
			->setType($type);
	}
	
}