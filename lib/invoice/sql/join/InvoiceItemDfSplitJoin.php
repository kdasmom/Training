<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEITEM to DFSPLIT table
 *
 * @author Thomas Messier
 */
class InvoiceItemDfSplitJoin extends Join {
	
	public function __construct($cols=array('dfsplit_name'), $type=Select::JOIN_LEFT, $toAlias='df', $fromAlias='ii') {
		$this->setTable(array($toAlias=>'dfsplit'))
			->setCondition("{$fromAlias}.dfsplit_id = {$toAlias}.dfsplit_id")
			->setCols($cols)
			->setType($type);
	}
	
}