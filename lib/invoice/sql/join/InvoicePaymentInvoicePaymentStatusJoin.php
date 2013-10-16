<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEPAYMENT to INVOICEPAYMENTSTATUS table
 *
 * @author Thomas Messier
 */
class InvoicePaymentInvoicePaymentStatusJoin extends Join {
	
	public function __construct($cols=array('invoicepayment_status'), $type=Select::JOIN_INNER, $toAlias='ips', $fromAlias='ip') {
		$this->setTable(array($toAlias=>'invoicepaymentstatus'))
			->setCondition("{$fromAlias}.invoicepayment_status_id = {$toAlias}.invoicepayment_status_id")
			->setCols($cols)
			->setType($type);
	}
	
}