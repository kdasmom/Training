<?php

namespace NP\vendor\sql;

use NP\core\db\Select;

class PropertyIdForUserSelect extends Select {
    public function __construct($statuses, $userprofile_id) {
        parent::__construct();

        $this
            ->columns(['property_id'])
            ->from(['pu' => 'PROPERTYUSERPROFILE'])
            ->join(['p' => 'Property'], 'pu.property_id = p.property_id', [], \NP\core\db\Select::JOIN_INNER)
        ;
        
        $where01 = new \NP\core\db\Where();
        $where01
            ->equals('pu.userprofile_id', $userprofile_id)
            ->in('p.property_status', $statuses) // NULL, 1
        ;
        $this->where($where01);
    }
}