<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICE to INVOICEITEM table
 *
 * @author Thomas Messier
 */
class InvoiceInvoiceItemJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='ii', $fromAlias='i') {
		$this->setTable(array($toAlias=>'invoiceitem'))
			->setCondition("{$fromAlias}.invoice_id = {$toAlias}.invoice_id")
			->setCols($cols)
			->setType($type);
	}
	
}