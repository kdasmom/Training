<?php

namespace NP\jobcosting\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from JBJOBASSOCIATION to JBJOBCODE table
 *
 * @author Thomas Messier
 */
class JobAssociationJbJobCodeJoin extends Join {
	
	public function __construct($cols=array('jbjobcode_name','jbjobcode_desc'), $type=Select::JOIN_LEFT, $toAlias='jbjc', $fromAlias='jb') {
		$this->setTable(array($toAlias=>'jbjobcode'))
			->setCondition("{$fromAlias}.jbjobcode_id = {$toAlias}.jbjobcode_id")
			->setCols($cols)
			->setType($type);
	}
	
}