<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDORSITE to PHONE table
 *
 * @author Thomas Messier
 */
class VendorsitePhoneJoin extends Join {
	
	public function __construct(
		$cols=array('phone_countrycode','phone_number','phone_ext','phonetype_id'),
		$type=Select::JOIN_LEFT,
		$toAlias='ph',
		$fromAlias='vs'
	) {
		$this->setTable(array($toAlias=>'phone'))
			->setCondition("{$fromAlias}.vendorsite_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'vendorsite'")
			->setCols($cols)
			->setType($type);
	}
	
}