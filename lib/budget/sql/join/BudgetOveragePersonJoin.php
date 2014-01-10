<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 1/10/14
 * Time: 5:25 PM
 */

namespace NP\budget\sql\join;


use NP\core\db\Join;
use NP\core\db\Select;

class BudgetOveragePersonJoin extends Join {
	public function __construct($cols=['person_firstname', 'person_lastname'], $type=Select::JOIN_INNER, $toAlias='p', $fromAlias='s') {
		$this->setTable(array($toAlias=>'person'))
			->setCondition("{$fromAlias}.person_id = {$toAlias}.person_id")
			->setCols($cols)
			->setType($type);
	}
} 