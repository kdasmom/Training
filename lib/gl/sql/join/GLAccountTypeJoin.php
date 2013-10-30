<?php

namespace NP\gl\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from glaccount to GLACCOUNTTYPE table
 *
 * @author Aliaksandr Zubik
 */
class GLAccountTypeJoin extends Join {
	
	public function __construct($cols=array('glaccounttype_name'), $type=Select::JOIN_INNER, $toAlias='gt', $fromAlias='g') {
		$this->setTable(array($toAlias=>'glaccounttype'))
			->setCondition("{$fromAlias}.glaccounttype_id = {$toAlias}.glaccounttype_id")
			->setCols($cols)
			->setType($type);
	}
	
}