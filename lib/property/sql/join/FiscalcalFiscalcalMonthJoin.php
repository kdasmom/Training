<?php

namespace NP\property\sql\join;

use NP\core\db\Join;
use NP\core\db\Select;

/**
 * Join from FISCALCAL to FISCALCALMONTH table
 *
 * @author Thomas Messier
 */
class FiscalcalFiscalcalMonthJoin extends Join {
	
	public function __construct($month=null, $cols=array(), $type=Select::JOIN_INNER, $toAlias='fm', $fromAlias='f') {
		if ($month === null) {
			$now = new \DateTime();
			$month = $now->format('n');
		}

		$this->setTable(array($toAlias=>'fiscalcalmonth'))
			->setCondition("{$fromAlias}.fiscalcal_id = {$toAlias}.fiscalcal_id AND fm.fiscalcalmonth_num = {$month}")
			->setCols($cols)
			->setType($type);
	}
	
}