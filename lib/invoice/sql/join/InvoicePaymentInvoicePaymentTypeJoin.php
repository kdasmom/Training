<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEPAYMENT to INVOICEPAYMENTTYPE table
 *
 * @author Thomas Messier
 */
class InvoicePaymentInvoicePaymentTypeJoin extends Join {
	
	public function __construct($cols=array('invoicepayment_type'), $type=Select::JOIN_LEFT, $toAlias='ipt', $fromAlias='ip') {
		$this->setTable(array($toAlias=>'invoicepaymenttype'))
			->setCondition("{$fromAlias}.invoicepayment_type_id = {$toAlias}.invoicepayment_type_id")
			->setCols($cols)
			->setType($type);
	}
	
}