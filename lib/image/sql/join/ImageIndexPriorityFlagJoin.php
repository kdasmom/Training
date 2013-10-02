<?php

namespace NP\image\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from IMAGE_INDEX to PRIORITYFLAG table
 *
 * @author Thomas Messier
 */
class ImageIndexPriorityFlagJoin extends Join {
	
	public function __construct($cols=array('PriorityFlag_ID','PriorityFlag_Display'), $type=Select::JOIN_LEFT, $toAlias='pf', $fromAlias='img') {
		$this->setTable(array($toAlias=>'PriorityFlag'))
			->setCondition("{$fromAlias}.PriorityFlag_ID_Alt = {$toAlias}.PriorityFlag_ID_Alt")
			->setCols($cols)
			->setType($type);
	}
	
}