<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICE to INVOICEPAYMENTTYPE table
 *
 * @author Thomas Messier
 */
class InvoiceInvoicePaymentTypeJoin extends Join {
	
	public function __construct($cols=['invoicepayment_type'], $type=Select::JOIN_LEFT, $toAlias='ipt', $fromAlias='i') {
		$this->setTable(array($toAlias=>'invoicepaymenttype'))
			->setCondition("{$fromAlias}.invoicepayment_type_id = {$toAlias}.invoicepayment_type_id")
			->setCols($cols)
			->setType($type);
	}
	
}