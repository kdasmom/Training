<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from POITEM to JBJOBASSOCIATION table
 *
 * @author Thomas Messier
 */
class PoItemJobAssociationJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='jb', $fromAlias='pi') {
		if ($cols === null) {
			$cols = array('jbcontract_id','jbchangeorder_id','jbjobcode_id','jbphasecode_id','jbcostcode_id',
							'jbassociation_retamt');
		}
		$this->setTable(array($toAlias=>'jbjobassociation'))
			->setCondition("{$fromAlias}.poitem_id = {$toAlias}.tablekey_id AND {$toAlias}.table_name = 'poitem'")
			->setCols($cols)
			->setType($type);
	}
	
}