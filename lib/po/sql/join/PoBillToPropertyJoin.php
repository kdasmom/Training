<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PURCHASEORDER to PROPERTY table
 *
 * @author Thomas Messier
 */
class PoBillToPropertyJoin extends Join {
	
	public function __construct($cols=array('bill_property_name'=>'property_name','bill_property_id_alt'=>'property_id_alt','bill_property_status'=>'property_status'), $type=Select::JOIN_LEFT, $toAlias='prbill', $fromAlias='p') {
		$this->setTable(array($toAlias=>'property'))
			->setCondition("{$fromAlias}.Purchaseorder_bill_propertyID = {$toAlias}.property_id")
			->setCols($cols)
			->setType($type);
	}
	
}