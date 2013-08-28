<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from PROPERTY to FISCALCAL table
 *
 * @author Thomas Messier
 */
class PropertyFiscalcalJoin extends Join {
	
	public function __construct($year=null, $cols=array(), $type=Select::JOIN_INNER, $toAlias='f', $fromAlias='p') {
		if ($year === null) {
			$now = new \DateTime();
			$year = $now->format('Y');
		}

		$this->setTable(array($toAlias=>'fiscalcal'))
			->setCondition("{$fromAlias}.property_id = {$toAlias}.property_id AND f.fiscalcal_year = {$year}")
			->setCols($cols)
			->setType($type);
	}
	
}