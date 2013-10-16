<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEPAYMENT to INVOICEPAYMENT table for corresponding voided payment
 *
 * @author Thomas Messier
 */
class InvoicePaymentInvoicePaymentVoidJoin extends Join {
	
	public function __construct($cols=array('voided_invoicepayment_id'=>'invoicepayment_id'), $type=Select::JOIN_LEFT, $toAlias='ipv', $fromAlias='ip') {
		$this->setTable(array($toAlias=>'invoicepayment'))
			->setCondition("{$fromAlias}.invoicepayment_id = {$toAlias}.invoicepayment_voided_id")
			->setCols($cols)
			->setType($type);
	}
	
}