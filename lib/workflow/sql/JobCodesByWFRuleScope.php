<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class JobCodesByWFRuleScope extends Select {
	public function __construct($ruleid) {
		parent::__construct();

		$this->columns(['jbjobcode_id', 'jbjobcode_desc', 'jbjobcode_name'])
			->from(['jb' => 'jbjobcode'])
			->join(['wf' => 'wfrulescope'], 'wf.table_name=\'jbjobcode\' and wf.tablekey_id=jb.jbjobcode_id', [], Select::JOIN_INNER);

		$where = Where::get()->equals('wf.wfrule_id', $ruleid);
		$this->where($where);
	}
}