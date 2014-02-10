<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class SearchByUserSelect02 extends Select {
    public function __construct($asp_client_id, $users = []) {
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
                ->join(new join\WFRuleWFActionJoin())
                ->join(new join\WFRuleUserprofileJoin())
            ->order('WF.wfrule_name')
        ;

        $where = Where::get()
            ->in('WA.wfaction_receipient_tablekey_id', $users)
            ->equals('WA.wfaction_receipient_tablename', 'userprofilerole')
            ->equals('WF.asp_client_id', $asp_client_id)
            ->in('WF.wfrule_status', '(\'active\', \'new\', \'deactive\')')
        ;
        $this->where($where);
    }
}
/*
SELECT DISTINCT WF.wfrule_id, WF.wfrule_name, WF.wfrule_status, WT.wfruletype_name, wf.wfrule_datetm, u.userprofile_username
FROM wfrule WF
    INNER JOIN wfruletype WT ON WT.wfruletype_id = WF.wfruletype_id
    INNER JOIN wfaction WA ON WF.wfrule_id = WA.wfrule_id

    INNER JOIN @linktable lnk ON lnk.MyVal = WA.wfaction_receipient_tablekey_id  AND WA.wfaction_receipient_tablename = 'userprofilerole'

    LEFT JOIN userprofile u ON wf.wfrule_lastupdatedby = u.userprofile_id
WHERE 
    WF.asp_client_id = @in_asp_client_id
    AND WF.wfrule_status IN ('active','new','deactive')
*/