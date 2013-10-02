<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_INDEX to USERPROFILE table for Exception By
 *
 * @author Thomas Messier
 */
class ImageIndexExceptionByJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='ue', $fromAlias='img') {
		if ($cols === null) {
			$cols = array(
				'exception_by_userprofile_id'       => 'userprofile_id',
				'exception_by_userprofile_username' => 'userprofile_username'
			);
		}
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.Image_Index_Exception_by = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}