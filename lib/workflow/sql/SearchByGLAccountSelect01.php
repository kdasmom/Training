<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class SearchByGLAccountSelect01 extends Select {
    public function __construct($asp_client_id, $accounts = []) {
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
                ->join(new join\WFRuleWFRuleScopeJoin(true))
                ->join(new join\WFRuleUserprofileJoin())
            ->order('WF.wfrule_name')
        ;

        $where = Where::get()
            ->in('WS.tablekey_id', $accounts)
            ->equals('WS.table_name', 'glaccount')
            ->equals('WF.asp_client_id', $asp_client_id)
            ->in('WF.wfrule_status', '(\'active\', \'new\', \'deactive\')')
        ;
        $this->where($where);
    }
}
/*
SELECT DISTINCT WF.wfrule_name, WF.wfrule_status, WF.wfrule_id, WT.wfruletype_name, wf.wfrule_datetm, u.userprofile_username
FROM wfrule WF 
    INNER JOIN wfruletype WT ON WT.wfruletype_id = WF.wfruletype_id
    INNER JOIN wfrulescope WS ON WF.wfrule_id = WS.wfrule_id AND WS.table_name = 'glaccount'

        INNER JOIN @linktable lnk ON lnk.MyVal = WS.tablekey_id AND WS.table_name = 'glaccount'
 
    LEFT JOIN userprofile u ON wf.wfrule_lastupdatedby = u.userprofile_id

WHERE 
    WF.asp_client_id = @in_asp_client_id
    AND WF.wfrule_status IN ('active','new','deactive')
*/