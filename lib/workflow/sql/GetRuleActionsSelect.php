<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class GetRuleActionsSelect extends Select {
    public function __construct($ruleid, $asp_client_id) {
        parent::__construct();

        $this
            ->columns([
                'wfrule_id'
            ])
            ->from(['WF' => 'wfrule'])
                ->join(new join\WFRuleWFRuleTypeJoin2([
                    'wfruletype_name', 
                    'wfruletype_tablename',
                    'type_id_alt'
                ], Select::JOIN_LEFT))
                ->join(new join\WFRuleWFActionJoin2([
                    'wfaction_receipient_tablename',
                    'wfaction_receipient_tablekey_id',
                    'wfaction_originator_tablename',
                    'wfaction_originator_tablekey_id'
                ], Select::JOIN_LEFT))
        ;

        $where = Where::get()
            ->equals('WF.wfrule_id', $ruleid)
            ->equals('WF.asp_client_id', $asp_client_id)
        ;
        $this->where($where);
    }
}