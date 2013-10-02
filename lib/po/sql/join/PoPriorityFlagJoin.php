<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PURCHASEORDER to PriorityFlag table
 *
 * @author Thomas Messier
 */
class PoPriorityFlagJoin extends Join {
	
	public function __construct($cols=array('PriorityFlag_ID','PriorityFlag_Display'), $type=Select::JOIN_LEFT, $toAlias='pf', $fromAlias='p') {
		$this->setTable(array($toAlias=>'PriorityFlag'))
			->setCondition("{$fromAlias}.PriorityFlag_ID_Alt = {$toAlias}.PriorityFlag_ID_Alt")
			->setCols($cols)
			->setType($type);
	}
	
}