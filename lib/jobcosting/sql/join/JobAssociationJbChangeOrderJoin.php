<?php

namespace NP\jobcosting\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from JBJOBASSOCIATION to JBCHANGEORDER table
 *
 * @author Thomas Messier
 */
class JobAssociationJbChangeOrderJoin extends Join {
	
	public function __construct($cols=array('jbchangeorder_name','jbchangeorder_desc'), $type=Select::JOIN_LEFT, $toAlias='jbco', $fromAlias='jb') {
		$this->setTable(array($toAlias=>'jbchangeorder'))
			->setCondition("{$fromAlias}.jbchangeorder_id = {$toAlias}.jbchangeorder_id")
			->setCols($cols)
			->setType($type);
	}
	
}