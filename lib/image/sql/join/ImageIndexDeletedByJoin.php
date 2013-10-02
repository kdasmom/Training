<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_INDEX to USERPROFILE table for Deleted By
 *
 * @author Thomas Messier
 */
class ImageIndexDeletedByJoin extends Join {
	
	public function __construct($cols=array('userprofile_id','userprofile_username'), $type=Select::JOIN_LEFT, $toAlias='ud', $fromAlias='img') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.image_index_deleted_by = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}