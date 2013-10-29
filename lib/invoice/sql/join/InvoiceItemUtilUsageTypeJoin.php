<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEITEM to GLACCOUNT table
 *
 * @author Thomas Messier
 */
class InvoiceItemUtilUsageTypeJoin extends Join {
	
	public function __construct($cols=array('UtilityColumn_UsageType_Id','UtilityColumn_UsageType_Name'), $type=Select::JOIN_LEFT, $toAlias='ucut', $fromAlias='ii') {
		$this->setTable(array($toAlias=>'utilitycolumn_usagetype'))
			->setCondition("{$fromAlias}.utilitycolumn_usagetype_id = {$toAlias}.UtilityColumn_UsageType_Id")
			->setCols($cols)
			->setType($type);
	}
	
}