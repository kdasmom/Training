<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEITEM to INVOICE table
 *
 * @author Thomas Messier
 */
class InvoiceItemInvoiceJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='i', $fromAlias='ii') {
		$this->setTable(array($toAlias=>'invoice'))
			->setCondition("{$fromAlias}.invoice_id = {$toAlias}.invoice_id")
			->setCols($cols)
			->setType($type);
	}
	
}