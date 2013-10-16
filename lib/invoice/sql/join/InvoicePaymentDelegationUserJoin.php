<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEPAYMENT to USERPROFILE table
 *
 * @author Thomas Messier
 */
class InvoicePaymentDelegationUserJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_LEFT, $toAlias='ud', $fromAlias='ip') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.invoicepayment_paid_by_delegation_to = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}