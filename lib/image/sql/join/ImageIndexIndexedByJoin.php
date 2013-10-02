<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_INDEX to USERPROFILE table for Indexed By
 *
 * @author Thomas Messier
 */
class ImageIndexIndexedByJoin extends Join {
	
	public function __construct($cols=null, $type=Select::JOIN_LEFT, $toAlias='ui', $fromAlias='img') {
		if ($cols === null) {
			$cols = array(
				'indexed_by_userprofile_id'       => 'userprofile_id',
				'indexed_by_userprofile_username' => 'userprofile_username'
			);
		}
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.image_index_indexed_by = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
	
}