<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class GetCountRulePropertiesSubselect extends Select {
	public function __construct() {
		parent::__construct();

		$this->count(true, 'wfruletarget_id')
			->from(['WFtarget' => 'wfruletarget'])
			->join(new join\WFRuleTargetProperty(['property_id', 'property_name'], Select::JOIN_INNER, 'p', 'WFtarget'))
			->where(
				Where::get()
					->equals('WFtarget.wfrule_id', 'WF.wfrule_id')
					->notEquals('p.property_status', 0)
			);
	}
}