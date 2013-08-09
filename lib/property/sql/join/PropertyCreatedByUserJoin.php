<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from property to userprofile table
 *
 * @author Thomas Messier
 */
class PropertyCreatedByUserJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='u', $fromAlias='p') {
		if ($cols === null) {
			$cols = array(
				'created_by_userprofile_id'=>'userprofile_id',
				'created_by_userprofile_username'=>'userprofile_username'
			);
		}
		
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}