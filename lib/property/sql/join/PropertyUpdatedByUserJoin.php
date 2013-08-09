<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from property to userprofile table
 *
 * @author Thomas Messier
 */
class PropertyUpdatedByUserJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='u2', $fromAlias='p') {
		if ($cols === null) {
			$cols = array(
				'updated_by_userprofile_id'=>'userprofile_id',
				'updated_by_userprofile_username'=>'userprofile_username'
			);
		}
		
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.last_updated_by = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}