<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PURCHASEORDER to PROPERTY table
 *
 * @author Thomas Messier
 */
class PoShipToPropertyJoin extends Join {
	
	public function __construct($cols=array('ship_property_name'=>'property_name','ship_property_id_alt'=>'property_id_alt','ship_property_status'=>'property_status'), $type=Select::JOIN_LEFT, $toAlias='prship', $fromAlias='p') {
		$this->setTable(array($toAlias=>'property'))
			->setCondition("{$fromAlias}.Purchaseorder_ship_propertyID = {$toAlias}.property_id")
			->setCols($cols)
			->setType($type);
	}
	
}