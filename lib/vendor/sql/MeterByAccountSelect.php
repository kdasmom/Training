<?php

namespace NP\vendor\sql;

use NP\core\db\Select;

class MeterByAccountSelect extends Select {
    public function __construct($account, $property_id = null, $vendorsite_id = null) {
        parent::__construct();

        $this
            ->distinct()
                ->column('utilityaccount_metersize')
            ->from(['ua' => 'utilityaccount'])
            ->join(['u' => 'utility'], 'ua.utility_id = u.utility_id', [], \NP\core\db\Select::JOIN_INNER)
            ->order('utilityaccount_metersize')
        ;

        $where = new \NP\core\db\Where();
        $where
            ->equals('ua.utilityaccount_accountnumber', $account)
        ;

        if (!empty($vendorsite_id)) {
            $where->equals('u.vendorsite_id', $vendorsite_id);
        }
        if (!empty($property_id)) {
            $where->equals('ua.property_id', $property_id);
        }

        $where
            ->notEquals('RTRIM(LTRIM(ISNULL(ua.utilityaccount_metersize, \'\')))', '\'\'')
            ->equals('ua.utilityaccount_active', 1)
        ;

        $this->where($where);
    }
}