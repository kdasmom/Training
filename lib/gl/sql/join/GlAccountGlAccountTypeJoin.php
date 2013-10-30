<?php

namespace NP\gl\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from GLACCOUNT to GLACCOUNTTYPE table
 *
 * @author Thomas Messier
 */
class GlAccountGlAccountTypeJoin extends Join {
	
	public function __construct($cols=array('glaccounttype_name'), $type=Select::JOIN_INNER, $toAlias='gt', $fromAlias='g') {
		$this->setTable(array($toAlias=>'glaccounttype'))
			->setCondition("{$fromAlias}.glaccounttype_id = {$toAlias}.glaccounttype_id")
			->setCols($cols)
			->setType($type);
	}
	
}