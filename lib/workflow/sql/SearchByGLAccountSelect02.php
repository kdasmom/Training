<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class SearchByGLAccountSelect02 extends Select {
    public function __construct($asp_client_id, $accounts = []) {
        parent::__construct();

        $this
            ->distinct()
                ->columns([
                    'wfrule_name',
                    'wfrule_status',
                    'wfrule_id',
                    'wfrule_datetm'
                ])
            ->from(['WF' => 'wfrule'])
                ->join(new join\WFRuleWFRuleTypeJoin())
                ->join(new join\WFRuleWFRuleScopeJoin(true))
                ->join(new join\WFRuleTree01Join())
                ->join(new join\WFRuleTree02Join())
                ->join(new join\WFRuleUserprofileJoin())
            ->order('WF.wfrule_name')
        ;

        $where = Where::get()
            ->in('t2.tablekey_id', $accounts)
            ->equals('t2.table_name', 'glaccount')
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
INNER JOIN tree t1 ON WS.tablekey_id = t1.tablekey_id AND t1.table_name = 'glaccount' 
INNER JOIN tree t2 ON t1.tree_id = t2.tree_parent 

			INNER JOIN @linktable lnk ON t2.tablekey_id = lnk.MyVal AND t2.table_name = 'glaccount'

LEFT JOIN userprofile u ON wf.wfrule_lastupdatedby = u.userprofile_id
WHERE 
    WF.wfrule_status IN ('active','new','deactive')
ORDER BY WF.wfrule_name
*/