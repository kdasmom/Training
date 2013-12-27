<?php

namespace NP\vendor\sql;

use NP\core\db\Select;

class PropertyIdForDelegationSelect extends Select {
    public function __construct($userprofile_id, $delegation_to_userprofile_id) {
        parent::__construct();

        $this
            ->columns([])
            ->from(['d' => 'delegation'])
            ->join(['dp' => 'delegationprop'], 'd.delegation_id = dp.delegation_id', ['property_id'], \NP\core\db\Select::JOIN_INNER)
        ;

        $select02 = new \NP\core\db\Select();
        $select02
            ->from(['pu' => 'PROPERTYUSERPROFILE'])
            ->where(
                \NP\core\db\Where::get()
                    ->equals('pu.property_id', 'dp.property_id')
                    ->equals('pu.userprofile_id', 'd.userprofile_id')
            )
        ;

        $where01 = new \NP\core\db\Where();
        $where01
            ->equals('d.userprofile_id', $userprofile_id)
            ->equals('d.delegation_to_userprofile_id', $delegation_to_userprofile_id)
            ->equals('d.delegation_status', 1)
            ->lessThanOrEqual('d.delegation_startdate', '\''.date('Y-m-d H:i:s').'\'')
            ->greaterThan('d.delegation_stopdate', '\''.date('Y-m-d H:i:s').'\'')
            ->exists($select02)
        ;

        $this->where($where01);
    }
}