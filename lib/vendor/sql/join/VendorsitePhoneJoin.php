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
		$phonetype_name=null,
		$cols=array('phone_countrycode','phone_number','phone_ext','phonetype_id'),
		$type=Select::JOIN_LEFT,
		$toAlias='ph',
		$fromAlias='vs'
	) {
		$condition = "{$fromAlias}.vendorsite_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'vendorsite'";
		if ($phonetype_name !== null) {
			$condition .= " AND {$toAlias}.phonetype_id = (
				SELECT phonetype_id FROM phonetype WHERE phonetype_name = '{$phonetype_name}'
			)";
		}

		$this->setTable(array($toAlias=>'phone'))
			->setCondition($condition)
			->setCols($cols)
			->setType($type);
	}
	
}