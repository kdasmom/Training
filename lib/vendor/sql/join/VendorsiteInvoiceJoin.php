<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDORSITE and INVOICEITEM table
 *
 * @author Thomas Messier
 */
class VendorsiteInvoiceJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_INNER, $toAlias='i', $fromAlias='vs') {
		$this->setTable(array($toAlias=>'invoice'))
			->setCondition("{$fromAlias}.vendorsite_id = {$toAlias}.paytablekey_id")
			->setCols($cols)
			->setType($type);
	}
	
}