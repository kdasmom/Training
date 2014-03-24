<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class SearchByRoleSelect01 extends Select {
	public function __construct($asp_client_id, $roles = [], $order = 'WF.wfrule_name') {
		parent::__construct();

		$this->distinct()
				->columns([
					'wfrule_name',
					'wfrule_status',
					'wfrule_id',
					'wfrule_datetm',
					'wfrule_operand',
					'wfrule_string',
					'wfrule_number_end',
					'wfrule_number',
					'count_properties' => new GetCountRulePropertiesSubselect()
				])
			->from(['WF' => 'wfrule'])
				->join(new join\WFRuleWFRuleTypeJoin(['wfruletype_name', 'wfruletype_tablename', 'wfruletype_id', 'type_id_alt'], Select::JOIN_INNER, 'WT', 'WF'))
				->join(new join\WFRuleWFActionJoin([], Select::JOIN_INNER, 'wa', 'WF'))
				->join(new join\WFRuleUserprofileJoin())
			->order($order);

		$where = Where::get();

		if (count($roles)) {
			$where->in('WA.wfaction_originator_tablekey_id', $roles);
		}

		$where->equals('WA.wfaction_originator_tablename', "'role'")
			->equals('WF.asp_client_id', $asp_client_id)
			->in('WF.wfrule_status', "'active','new','deactive'");

		$this->where($where);
	}
}