<?php

namespace NP\jobcosting\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from JBJOBASSOCIATION to JBCOSTCODE table
 *
 * @author Thomas Messier
 */
class JobAssociationJbCostCodeJoin extends Join {
	
	public function __construct($cols=array('jbcostcode_name','jbcostcode_desc'), $type=Select::JOIN_LEFT, $toAlias='jbcc', $fromAlias='jb') {
		$this->setTable(array($toAlias=>'jbcostcode'))
			->setCondition("{$fromAlias}.jbcostcode_id = {$toAlias}.jbcostcode_id")
			->setCols($cols)
			->setType($type);
	}
	
}