<?php

namespace NP\jobcosting\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from JBJOBASSOCIATION to JBPHASECODE table
 *
 * @author Thomas Messier
 */
class JobAssociationJbPhaseCodeJoin extends Join {
	
	public function __construct($cols=array('jbphasecode_name','jbphasecode_desc'), $type=Select::JOIN_LEFT, $toAlias='jbpc', $fromAlias='jb') {
		$this->setTable(array($toAlias=>'jbphasecode'))
			->setCondition("{$fromAlias}.jbphasecode_id = {$toAlias}.jbphasecode_id")
			->setCols($cols)
			->setType($type);
	}
	
}