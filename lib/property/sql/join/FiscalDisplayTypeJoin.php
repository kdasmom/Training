<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 11/13/13
 * Time: 4:36 PM
 */

namespace NP\property\sql\join;


use NP\core\db\Join;
use NP\core\db\Select;

class FiscalDisplayTypeJoin extends Join {
	public function __construct($type=Select::JOIN_INNER, $toAlias='pr', $fromAlias='fdt') {

		$this->setTable(array($fromAlias=>'fiscaldisplaytype'))
			->setCondition("{$fromAlias}.fiscaldisplaytype_id = {$toAlias}.fiscaldisplaytype_value")
			->setCols(['fiscaldisplaytype_name'])
			->setType($type);
	}
} 