<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICE to APPROVE table
 *
 * @author Thomas Messier
 */
class InvoiceApproveJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='a', $fromAlias='i') {
		$this->setTable(array($toAlias=>'approve'))
			->setCondition("{$fromAlias}.invoice_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'invoice'")
			->setCols($cols)
			->setType($type);
	}
	
}