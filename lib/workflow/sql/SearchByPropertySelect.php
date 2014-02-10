<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class SearchByPropertySelect extends Select {
    public function __construct($asp_client_id, $properties = []) {
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
					'wfrule_number'
                ])
            ->from(['WF' => 'wfrule'])
                ->join(new join\WFRuleWFRuleTypeJoin(['wfruletype_tablename', 'wfruletype_id', 'type_id_alt']))
                ->join(new join\WFRuleWFRuleTargetJoin())
                ->join(new join\WFRuleUserprofileJoin())
            ->order('WF.wfrule_name')
        ;

        $where = Where::get()
            ->in('WFT.tablekey_id', $properties)
            ->equals('WFT.table_name', 'property')
            ->equals('WF.asp_client_id', $asp_client_id)
            ->in('WF.wfrule_status', '(\'active\', \'new\', \'deactive\')')
        ;
        $this->where($where);
    }
}