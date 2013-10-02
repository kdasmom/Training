<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PURCHASEORDER to APPROVE table
 *
 * @author Thomas Messier
 */
class InvoiceVendorOneTimeJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_LEFT, $toAlias='vone', $fromAlias='i') {
		$this->setTable(array($toAlias=>'vendoronetime'))
			->setCondition("{$fromAlias}.invoice_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'invoice'")
			->setCols($cols)
			->setType($type);
	}
	
}