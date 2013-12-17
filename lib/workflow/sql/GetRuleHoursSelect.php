<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class GetRuleHoursSelect extends Select {
    public function __construct($ruleid, $asp_client_id) {
        parent::__construct();

        $this
            ->columns([
                'runhour'
            ])
            ->from(['WFH' => 'wfrulehour'])
                ->join(new join\WFRuleHourWFRule())
        ;

        $where = Where::get()
            ->equals('WF.wfrule_id', $ruleid)
            ->equals('WF.asp_client_id', $asp_client_id)
        ;
        $this->where($where);
    }
}
/*
--RECORDSET-6
	BEGIN
		SELECT wfh.runhour
		FROM wfrulehour wfh INNER JOIN wfrule wf ON wf.wfrule_id=wfh.wfrule_id
		WHERE wfh.wfrule_id=@in_wfrule_id AND wf.asp_client_id=@in_asp_client_id

	END;

*/