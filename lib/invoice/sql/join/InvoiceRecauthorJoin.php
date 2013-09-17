<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICE to RECAUTHOR table
 *
 * @author Thomas Messier
 */
class InvoiceRecauthorJoin extends Join {
	
	public function __construct($cols=array('recauthor_id','userprofile_id'), $type=Select::JOIN_LEFT, $toAlias='ra', $fromAlias='i') {
		$this->setTable(array($toAlias=>'recauthor'))
			->setCondition("{$fromAlias}.invoice_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'invoice'")
			->setCols($cols)
			->setType($type);
	}
	
}