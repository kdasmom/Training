<?php

namespace NP\jobcosting\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from JBJOBASSOCIATION to JBCONTRACT table
 *
 * @author Thomas Messier
 */
class JobAssociationJbContractJoin extends Join {
	
	public function __construct($cols=array('jbcontract_name','jbcontract_desc','jbcontract_status'), $type=Select::JOIN_LEFT, $toAlias='jbct', $fromAlias='jb') {
		$this->setTable(array($toAlias=>'jbcontract'))
			->setCondition("{$fromAlias}.jbcontract_id = {$toAlias}.jbcontract_id")
			->setCols($cols)
			->setType($type);
	}
	
}