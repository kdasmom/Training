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
        ;

        $where = Where::get()
            ->equals('WFT.wfrule_id', $ruleid)
            ->notEquals('p.property_status', 0)
        ;
        $this->where($where);
    }
}
/*
--RECORDSET-2

	BEGIN
		SELECT wt.*
		FROM  wfruletarget wt
			INNER JOIN property p ON wt.tablekey_id = p.property_id
		WHERE wfrule_id=@in_wfrule_id
			AND p.property_status <> 0;
	END;
*/