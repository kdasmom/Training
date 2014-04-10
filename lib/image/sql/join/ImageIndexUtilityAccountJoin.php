<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_INDEX to UTILITYACCOUNT table
 *
 * @author Thomas Messier
 */
class ImageIndexUtilityAccountJoin extends Join {
 
	public function __construct($cols=array('UtilityAccount_AccountNumber','UtilityAccount_MeterSize'), $type=Select::JOIN_LEFT, $toAlias='ua', $fromAlias='img') {
		$this->setTable(array($toAlias=>'utilityaccount'))
			->setCondition("{$fromAlias}.utilityaccount_id = {$toAlias}.utilityaccount_id")
			->setCols($cols)
			->setType($type);
	}
	
}