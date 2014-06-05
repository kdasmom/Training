<?php

namespace NP\po\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from POITEM to RCTITEM table
 *
 * @author Thomas Messier
 */
class PoItemRctItemJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='ri', $fromAlias='pi') {
		$this->setTable(array($toAlias=>'rctitem'))
			->setCondition("{$fromAlias}.poitem_id = {$toAlias}.poitem_id")
			->setCols($cols)
			->setType($type);
	}
	
}