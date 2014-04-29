<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class GetRuleSelect extends Select {
    public function __construct($ruleid, $asp_client_id) {
        parent::__construct();

        $this->columns([
			'wfrule_id',
			'wfrule_name',
			'wfrule_status',
			'wfrule_operand',
			'wfrule_number',
			'wfrule_number_end',
			'wfrule_string',
			'wfrule_datetm',
			'wfruletype_id',
			'region_id'
		])
		->from(['WF' => 'wfrule'])
			->join(	new join\WFRuleWFRuleTypeJoin2(['wfruletype_name','wfruletype_tablename','type_id_alt'], Select::JOIN_LEFT) )
			->join( new join\WFRuleUserprofileJoin() )
			->join( new join\WFRuleHourJoin(['runhour'], Select::JOIN_LEFT) )
			->join( new join\WFRuleRegionJoin() )
		->order('WF.wfrule_name');

        $where = Where::get()
            ->equals('WF.wfrule_id', $ruleid)
            ->equals('WF.asp_client_id', $asp_client_id)
        ;
        $this->where($where);
    }
}