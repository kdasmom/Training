<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_INDEX to PROPERTY table
 *
 * @author Thomas Messier
 */
class ImageIndexPropertyJoin extends Join {
	
	public function __construct($cols=array('property_id_alt','property_name'), $type=Select::JOIN_LEFT, $toAlias='pr', $fromAlias='img') {
		$this->setTable(array($toAlias=>'property'))
			->setCondition("{$fromAlias}.property_id = {$toAlias}.property_id")
			->setCols($cols)
			->setType($type);
	}
	
}