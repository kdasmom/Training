<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 1/10/14
 * Time: 5:30 PM
 */

namespace NP\budget\sql\join;


use NP\core\db\Join;
use NP\core\db\Select;

class BudgetOverageUserprofileRoleJoin extends Join {
	public function __construct($cols=[], $type=Select::JOIN_INNER, $toAlias='ur', $fromAlias='u') {
		$this->setTable(array($toAlias=>'userprofilerole'))
			->setCondition("{$fromAlias}.userprofile_id = {$toAlias}.userprofile_id")
			->setCols($cols)
			->setType($type);
	}
} 