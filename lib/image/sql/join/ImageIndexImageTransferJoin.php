<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_INDEX to IMAGE_TRANSFER table
 *
 * @author Thomas Messier
 */
class ImageIndexImageTransferJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_LEFT, $toAlias='imgt', $fromAlias='img') {
		$this->setTable(array($toAlias=>'image_transfer'))
			->setCondition("{$fromAlias}.image_index_id = {$toAlias}.invoiceimage_id")
			->setCols($cols)
			->setType($type);
	}
	
}