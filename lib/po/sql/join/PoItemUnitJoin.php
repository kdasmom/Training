<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from POITEM to UNIT table
 *
 * @author Thomas Messier
 */
class PoItemUnitJoin extends Join {
	
	public function __construct($cols=array('unit_id_alt','unit_number'), $type=Select::JOIN_LEFT, $toAlias='unt', $fromAlias='pi') {
		$this->setTable(array($toAlias=>'unit'))
			->setCondition("{$fromAlias}.unit_id = {$toAlias}.unit_id")
			->setCols($cols)
			->setType($type);
	}
	
}