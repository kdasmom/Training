<?php
namespace NP\workflow\sql;

use NP\core\db\Select;
use NP\core\db\Where;

class GetRuleRoutesSelect extends Select {
    public function __construct($ruleid, $asp_client_id) {
        parent::__construct();

        $this
            ->columns([
                'wfaction_receipient_tablename',
                'wfaction_receipient_tablekey_id',
                'wfaction_originator_tablename',
                'wfaction_originator_tablekey_id',
                'wfaction_id',
                'wfrule_id'
            ])
            ->from(['w' => 'wfaction'])
                ->join(
                    ['r' => 'role'],
                    'r.role_id=w.wfaction_receipient_tablekey_id and w.wfaction_receipient_tablename=\'role\'',
                    ['role_name'],
                    Select::JOIN_LEFT
                )
                ->join(
                    ['r2' => 'role'],
                    'r2.role_id=w.wfaction_originator_tablekey_id and w.wfaction_originator_tablename=\'role\'',
                    ['role_name_originator' => 'role_name'],
                    Select::JOIN_LEFT
                )
                ->join(
                    ['ur' => 'userprofilerole'],
                    'ur.userprofilerole_id =w.wfaction_receipient_tablekey_id and w.wfaction_receipient_tablename=\'userprofilerole\'', 
                    ['userprofilerole_id'], 
                    Select::JOIN_LEFT
                )
                ->join(
                    ['u' => 'userprofile'],
                    'u.userprofile_id=ur.userprofile_id AND u.asp_client_id='.$asp_client_id,
                    ['userprofile_status'],
                    Select::JOIN_LEFT
                )
                ->join(
                    ['s' => 'STAFF'],
                    'ur.tablekey_id = s.staff_id',
                    [],
                    Select::JOIN_LEFT
                )
                ->join(
                    ['ps' => 'PERSON'],
                    's.person_id = ps.person_id',
                    ['person_lastname', 'person_firstname', 'person_middlename'],
                    Select::JOIN_LEFT
                )


                ->join(
                    ['ur2' => 'userprofilerole'],
                    'ur2.userprofilerole_id =w.wfaction_originator_tablekey_id and w.wfaction_receipient_tablename=\'userprofilerole\'', 
                    [], 
                    Select::JOIN_LEFT
                )
                ->join(
                    ['s2' => 'STAFF'],
                    'ur2.tablekey_id = s2.staff_id',
                    [],
                    Select::JOIN_LEFT
                )
                ->join(
                    ['ps2' => 'PERSON'],
                    's2.person_id = ps2.person_id',
                    ['person_lastname_originator' => 'person_lastname', 'person_firstname_originator' => 'person_firstname', 'person_middlename_originator' => 'person_middlename'],
                    Select::JOIN_LEFT
                )
                ->join(
                    ['u2' => 'userprofile'],
                    'u2.userprofile_id=ur2.userprofile_id',
                    ['userprofile_status_originator' => 'userprofile_status'],
                    Select::JOIN_LEFT
                )

        ;
        $where = Where::get()
            ->equals('w.wfrule_id', $ruleid)
        ;
        $this->where($where);
    }
}