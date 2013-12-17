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
                    'wfrule_datetm'
                ])
            ->from(['WF' => 'wfrule'])
                ->join(new join\WFRuleWFRuleTypeJoin())
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
/* properties =
INNER JOIN @linktable lnk ON lnk.MyVal = WFT.tablekey_id AND WFT.table_name = 'property'

    INSERT INTO @linktable 
    SELECT property_id FROM property
/*
SELECT DISTINCT WF.wfrule_name, WF.wfrule_status, WF.wfrule_id, WT.wfruletype_name, wf.wfrule_datetm, u.userprofile_username
FROM wfrule WF 
INNER JOIN wfruletype WT ON WT.wfruletype_id = WF.wfruletype_id
INNER JOIN wfruletarget WFT ON WF.wfrule_id = WFT.wfrule_id
INNER JOIN @linktable lnk ON lnk.MyVal = WFT.tablekey_id AND WFT.table_name = 'property'
LEFT JOIN userprofile u ON wf.wfrule_lastupdatedby = u.userprofile_id
WHERE 
    WF.asp_client_id = @in_asp_client_id
    AND WF.wfrule_status IN ('active','new','deactive')
ORDER BY WF.wfrule_name
*/