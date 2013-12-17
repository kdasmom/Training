<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class SearchSelect extends Select {
    public function __construct($asp_client_id, $orderby = 'WF.wfrule_name') {
        parent::__construct();

        $this
            ->columns([
                'wfrule_name',
                'wfrule_status',
                'wfrule_id',
                'wfrule_datetm'
            ])
            ->from(['WF' => 'wfrule'])
                ->join(new join\WFRuleWFRuleTypeJoin2())
                ->join(new join\WFRuleUserprofileJoin())
            ->order($orderby)
        ;

        $where = Where::get()
            ->equals('WF.asp_client_id', $asp_client_id)
            ->in('WF.wfrule_status', '\'active\', \'new\', \'deactive\'')
        ;
        $this->where($where);
    }
}