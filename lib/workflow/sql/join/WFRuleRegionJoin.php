<?php
namespace NP\workflow\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

class WFRuleRegionJoin extends Join {
	public function __construct($cols = ['region_name'], $type = Select::JOIN_LEFT, $toAlias = 'r', $fromAlias = 'WF') {
		$this->setTable([$toAlias => 'REGION'])
			 ->setCondition("{$fromAlias}.region_id = {$toAlias}.region_id")
			 ->setCols($cols)
			 ->setType($type);
	}
}