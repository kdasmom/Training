<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICE to VENDORSITE table
 *
 * @author Thomas Messier
 */
class InvoiceVendorsiteJoin extends Join {
	
	public function __construct($cols=array('vendor_id','vendorsite_id'), $type=Select::JOIN_INNER, $toAlias='vs', $fromAlias='i') {
		$this->setTable(array($toAlias=>'vendorsite'))
			->setCondition("{$fromAlias}.paytablekey_id = {$toAlias}.vendorsite_id")
			->setCols($cols)
			->setType($type);
	}
	
}