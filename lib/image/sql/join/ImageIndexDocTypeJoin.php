<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_INDEX to IMAGE_DOCTYPE table for Deleted By
 *
 * @author Thomas Messier
 */
class ImageIndexDocTypeJoin extends Join {
	
	public function __construct($cols=array('image_doctype_name'), $type=Select::JOIN_LEFT, $toAlias='imgd', $fromAlias='img') {
		$this->setTable(array($toAlias=>'image_doctype'))
			->setCondition("{$fromAlias}.Image_Doctype_Id = {$toAlias}.image_doctype_id")
			->setCols($cols)
			->setType($type);
	}
	
}