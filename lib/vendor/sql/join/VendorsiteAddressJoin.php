<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDORSITE to ADDRESS table
 *
 * @author Thomas Messier
 */
class VendorsiteAddressJoin extends Join {
	
	public function __construct(
		$cols=array('address_line1','address_line2','address_line3','address_city','address_state','address_zip','address_zipext','address_country'),
		$type=Select::JOIN_LEFT,
		$toAlias='adr',
		$fromAlias='vs'
	) {
		$this->setTable(array($toAlias=>'address'))
			->setCondition("{$fromAlias}.vendorsite_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'vendorsite'")
			->setCols($cols)
			->setType($type);
	}
	
}