<?php

namespace NP\invoice\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from INVOICEITEM to JBJOBASSOCIATION table
 *
 * @author Thomas Messier
 */
class InvoiceItemJobAssociationJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='jb', $fromAlias='ii') {
		if ($cols === null) {
			$cols = array('jbcontract_id','jbchangeorder_id','jbjobcode_id','jbphasecode_id','jbcostcode_id',
							'jbassociation_retamt');
		}
		$this->setTable(array($toAlias=>'jbjobassociation'))
			->setCondition("{$fromAlias}.invoiceitem_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'invoiceitem'")
			->setCols($cols)
			->setType($type);
	}
	
}