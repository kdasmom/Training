<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICE to INVOICEHOLD table
 *
 * @author Thomas Messier
 */
class InvoiceInvoiceHoldJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='ih', $fromAlias='i') {
		$this->setTable(array($toAlias=>'invoicehold'))
			->setCondition("{$fromAlias}.invoice_id = {$toAlias}.invoice_id")
			->setCols($cols)
			->setType($type);
	}
	
}