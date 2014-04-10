<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDORSITE to VENDORFAVORITE table
 *
 * @author Thomas Messier
 */
class VendorsiteVendorFavoriteJoin extends Join {
	
	public function __construct($cols=[], $type=Select::JOIN_INNER, $toAlias='vf', $fromAlias='vs') {
		$this->setTable(array($toAlias=>'vendorfavorite'))
			->setCondition("{$fromAlias}.vendorsite_id = {$toAlias}.vendorsite_id")
			->setCols($cols)
			->setType($type);
	}
	
}