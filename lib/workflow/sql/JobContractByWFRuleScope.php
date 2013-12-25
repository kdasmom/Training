<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class JobContractByWFRuleScope extends Select {
    public function __construct($ruleid) {
        parent::__construct();

        $this
            ->columns([
                'jbcontract_desc',
                'jbcontract_name'
            ])
            ->from(['jb' => 'jbcontract'])
                ->join(['wf' => 'wfrulescope'], 'wf.table_name=\'jbcontract\' and wf.tablekey_id=jb.jbcontract_id', [], Select::JOIN_INNER)
        ;

        $where = Where::get()
            ->equals('wf.wfrule_id', $ruleid)
        ;
        $this->where($where);
    }
}