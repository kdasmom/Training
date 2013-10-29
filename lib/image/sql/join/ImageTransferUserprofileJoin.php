<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_TRANSFER to USERPROFILE table
 *
 * @author Thomas Messier
 */
class ImageTransferUserprofileJoin extends Join {
	
	public function __construct($cols=array(), $type=Select::JOIN_LEFT, $toAlias='uimgt', $fromAlias='imgt') {
		$this->setTable(array($toAlias=>'userprofile'))
			->setCondition("{$fromAlias}.transfer_srcTablekey_id = {$toAlias}.userprofile_id AND {$fromAlias}.transfer_srcTableName = 'userprofile'")
			->setCols($cols)
			->setType($type);
	}
	
}