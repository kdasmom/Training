<?php

namespace NP\catalog\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VC to PROPERTY table
 *
 * @author Thomas Messier
 */
class VcLinkVcVendorJoin extends Join {
	
	public function __construct($cols=[], $type=Select::JOIN_INNER, $toAlias='lvp', $fromAlias='vc') {
		$this->setTable(array($toAlias=>'link_vc_property'))
			->setCondition("{$fromAlias}.vc_id = {$toAlias}.vc_id")
			->setCols($cols)
			->setType($type);
	}
	
}