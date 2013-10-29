<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_TRANSFER to VENDORSITE table
 *
 * @author Thomas Messier
 */
class ImageTransferVendorsiteJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_LEFT, $toAlias='vsimgt', $fromAlias='imgt') {
		$this->setTable(array($toAlias=>'vendorsite'))
			->setCondition("{$fromAlias}.transfer_srcTablekey_id = {$toAlias}.vendorsite_id AND {$fromAlias}.transfer_srcTableName = 'vendorsite'")
			->setCols($cols)
			->setType($type);
	}
	
}