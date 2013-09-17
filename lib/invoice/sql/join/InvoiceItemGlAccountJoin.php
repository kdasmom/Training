<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEITEM to GLACCOUNT table
 *
 * @author Thomas Messier
 */
class InvoiceItemGlAccountJoin extends Join {
	
	public function __construct($cols=array('glaccount_name','glaccount_number'), $type=Select::JOIN_INNER, $toAlias='g', $fromAlias='ii') {
		$this->setTable(array($toAlias=>'glaccount'))
			->setCondition("{$fromAlias}.glaccount_id = {$toAlias}.glaccount_id")
			->setCols($cols)
			->setType($type);
	}
	
}