<?php

namespace NP\vendor\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from VENDOR table to itself by approval tracking
 *
 * @author Thomas Messier
 */
class VendorApprovalJoin extends Join {
	
	public function __construct($cols=array('approval_type'=>'vendor_ModificationType'), $type=Select::JOIN_INNER, $toAlias='vappr', $fromAlias='v') {
		$this->setTable(array($toAlias=>'vendor'))
			->setCondition("{$fromAlias}.approval_tracking_id = {$toAlias}.vendor_id")
			->setCols($cols)
			->setType($type);
	}
	
}