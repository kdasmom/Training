<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from property to itself for Bill To or Ship To property
 *
 * @author Thomas Messier
 */
class PropertyBillToShipToJoin extends Join {
	
	public function __construct($billOrShip='bill', $cols=null, $type=Select::JOIN_LEFT, $toAlias='p', $fromAlias='p') {
		if ($cols === null) {
			$cols = array(
				"default_{$billOrShip}to_property_name"   =>'property_name',
				"default_{$billOrShip}to_property_id_alt" =>'property_id_alt'
			);
		}
		$this->setTable(array("{$billOrShip}_{$toAlias}"=>'property'))
			->setCondition("{$fromAlias}.default_{$billOrShip}to_property_id = {$billOrShip}_{$toAlias}.property_id")
			->setCols($cols)
			->setType($type);
	}
	
}