<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class GetRulePropertiesSelect extends Select {
    public function __construct($ruleid) {
        parent::__construct();

        $this
            ->columns([
                'tablekey_id'
            ])
            ->from(['WFT' => 'wfruletarget'])
                ->join(new join\WFRuleTargetProperty())
                ->join(new \NP\property\sql\join\PropertyRegionJoin(['region_name'], Select::JOIN_LEFT, 'r', 'p'))
        ;

        $where = Where::get()
            ->equals('WFT.wfrule_id', $ruleid)
            ->notEquals('p.property_status', 0)
        ;
        $this->where($where);
    }
}