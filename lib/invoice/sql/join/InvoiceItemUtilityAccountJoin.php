<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEITEM to UTILITYACCOUNT table
 *
 * @author Thomas Messier
 */
class InvoiceItemUtilityAccountJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='ua', $fromAlias='ii') {
		if ($cols === null) {
			$cols = array('UtilityAccount_Id','UtilityAccount_AccountNumber','UtilityAccount_MeterSize');
		}
		$this->setTable(array($toAlias=>'utilityaccount'))
			->setCondition("{$fromAlias}.utilityaccount_id = {$toAlias}.UtilityAccount_Id")
			->setCols($cols)
			->setType($type);
	}
	
}