<?php

namespace NP\gl\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from GLACCOUNT to GLACCOUNTYEAR table
 *
 * @author Thomas Messier
 */
class GlAccountGlAccountYearJoin extends Join {
	
	public function __construct($cols=array('glaccountyear_id'), $type=Select::JOIN_INNER, $toAlias='gy', $fromAlias='g') {
		$this->setTable(array($toAlias=>'glaccountyear'))
			->setCondition("{$fromAlias}.glaccount_id = {$toAlias}.glaccount_id")
			->setCols($cols)
			->setType($type);
	}
	
}