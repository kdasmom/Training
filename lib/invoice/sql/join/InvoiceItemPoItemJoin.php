<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEITEM to POITEM table
 *
 * @author Thomas Messier
 */
class InvoiceItemPoItemJoin extends Join {
	
	public function __construct($cols=array('poitem_id','poitem_amount','purchaseorder_id'), $type=Select::JOIN_LEFT, $toAlias='pi', $fromAlias='ii') {
		$this->setTable(array($toAlias=>'poitem'))
			->setCondition("{$fromAlias}.invoiceitem_id = {$toAlias}.reftablekey_id OR {$fromAlias}.reftablekey_id = {$toAlias}.poitem_id")
			->setCols($cols)
			->setType($type);
	}
	
}