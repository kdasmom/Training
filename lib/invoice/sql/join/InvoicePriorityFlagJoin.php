<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICE to PRIORITYFLAG table
 *
 * @author Thomas Messier
 */
class InvoicePriorityFlagJoin extends Join {
	
	public function __construct($cols=array('PriorityFlag_ID','PriorityFlag_Display'), $type=Select::JOIN_LEFT, $toAlias='pf', $fromAlias='i') {
		$this->setTable(array($toAlias=>'PriorityFlag'))
			->setCondition("{$fromAlias}.PriorityFlag_ID_Alt = {$toAlias}.PriorityFlag_ID_Alt")
			->setCols($cols)
			->setType($type);
	}
	
}