<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_INDEX to VENDORSITE table
 *
 * @author Thomas Messier
 */
class ImageIndexVendorsiteJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_LEFT, $toAlias='vs', $fromAlias='img', $fromField = 'Image_Index_VendorSite_Id') {
		$this->setTable(array($toAlias=>'vendorsite'))
			->setCondition("{$fromAlias}.{$fromField} = {$toAlias}.vendorsite_id")
			->setCols($cols)
			->setType($type);
	}
	
}