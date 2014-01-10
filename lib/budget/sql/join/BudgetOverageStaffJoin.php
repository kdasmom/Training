<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 1/10/14
 * Time: 5:22 PM
 */

namespace NP\budget\sql\join;


use NP\core\db\Join;
use NP\core\db\Select;

class BudgetOverageStaffJoin extends Join {
	public function __construct($cols=[], $type=Select::JOIN_INNER, $toAlias='s', $fromAlias='ur') {
		$this->setTable(array($toAlias=>'staff'))
			->setCondition("{$fromAlias}.tablekey_id = {$toAlias}.staff_id")
			->setCols($cols)
			->setType($type);
	}
} 