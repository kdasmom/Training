<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 11/13/13
 * Time: 5:09 PM
 */

namespace NP\property\sql\join;


use NP\core\db\Join;
use NP\core\db\Select;

class PropertyPropertyShipToJoin extends Join {
	public function __construct($cols=array('default_ship_to_property' => 'property_name'), $type=Select::JOIN_INNER, $toAlias='pr1', $fromAlias='pr') {
		$this->setTable(array($toAlias=>'property'))
			->setCondition("{$fromAlias}.property_id = {$toAlias}.property_id")
			->setCols($cols)
			->setType($type);
	}
} 