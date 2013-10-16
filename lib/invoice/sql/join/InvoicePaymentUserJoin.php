<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEPAYMENT to USERPROFILE table
 *
 * @author Thomas Messier
 */
class InvoicePaymentUserJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_LEFT, $toAlias='u', $fromAlias='ip') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.invoicepayment_paid_by = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}