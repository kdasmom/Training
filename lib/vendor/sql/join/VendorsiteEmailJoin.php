<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDORSITE to EMAIL table
 *
 * @author Thomas Messier
 */
class VendorsiteEmailJoin extends Join {
	
	public function __construct(
		$emailtype_name=null,
		$cols=null,
		$type=Select::JOIN_LEFT,
		$toAlias='em',
		$fromAlias='vs'
	) {
		$condition = "{$fromAlias}.vendorsite_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'vendorsite'";
		if ($emailtype_name !== null) {
			$condition .= " AND {$toAlias}.emailtype_id = (
				SELECT emailtype_id FROM emailtype WHERE emailtype_name = '{$emailtype_name}'
			)";
		}

		$this->setTable(array($toAlias=>'email'))
			->setCondition($condition)
			->setCols($cols)
			->setType($type);
	}
	
}