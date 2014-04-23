<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class SearchByVendorSelect extends Select {
	public function __construct($asp_client_id, $vendors = [], $order = 'WF.wfrule_name') {
		parent::__construct();

		$this
			->distinct()
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
				->join(new join\WFRuleWFRuleScopeJoin())
				->join(new join\WFRuleVendorJoin())
				->join(new join\WFRuleUserprofileJoin())
			->order($order);

		$where = Where::get();

		if (count($vendors)) {
			$where->in('WS.tablekey_id', implode(',', $vendors));
		}

		$where->equals('WS.table_name', "'vendor'")
			  ->equals('WF.asp_client_id', $asp_client_id)
			  ->in('WF.wfrule_status', "'active','new','deactive'");

		$this->where($where);
	}
}