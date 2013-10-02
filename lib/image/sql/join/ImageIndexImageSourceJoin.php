<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_INDEX to INVOICEIMAGESOURCE table
 *
 * @author Thomas Messier
 */
class ImageIndexImageSourceJoin extends Join {
	
	public function __construct($cols=array('invoiceimage_source_name'), $type=Select::JOIN_INNER, $toAlias='imgs', $fromAlias='img') {
		$this->setTable(array($toAlias=>'invoiceimagesource'))
			->setCondition("{$fromAlias}.Image_Index_Source_Id = {$toAlias}.invoiceimage_source_id")
			->setCols($cols)
			->setType($type);
	}
	
}