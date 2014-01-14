<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from POITEM to INVOICEITEM table
 *
 * @author Thomas Messier
 */
class PoItemInvoiceItemJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='ii', $fromAlias='pi') {
		$this->setTable(array($toAlias=>'invoiceitem'))
			->setCondition("{$fromAlias}.poitem_id = {$toAlias}.reftablekey_id OR {$fromAlias}.reftablekey_id = {$toAlias}.invoiceitem_id")
			->setCols($cols)
			->setType($type);
	}
	
}