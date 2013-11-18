<?php

namespace NP\vendor\sql;

use NP\core\db\Select;

class UtilityAccountsByCriteriaSelect extends Select {
    public function __construct($userprofile_id, $delegation_to_userprofile_id, $utilityaccount_accountnumber) {
        parent::__construct();

        $this
            ->columns([
                'utilityaccount_id',
                'utilityaccount_metersize',
                'utilityaccount_accountnumber'
            ])
            ->from(['ua' => 'utilityaccount'])
                ->join(['u' => 'utility'], 'ua.utility_id = u.utility_id', [], \NP\core\db\Select::JOIN_INNER)
                ->join(['vs' => 'vendorsite'], 'u.vendorsite_id = vs.vendorsite_id', ['vendorsite_id'], \NP\core\db\Select::JOIN_INNER)
                ->join(['v' => 'vendor'], 'vs.vendor_id = v.vendor_id', ['vendor_name', 'vendor_id_alt'], \NP\core\db\Select::JOIN_INNER)
                ->join(['p' => 'property'], 'ua.property_id = p.property_id', ['property_id', 'property_name', 'property_id_alt'], \NP\core\db\Select::JOIN_INNER)
            ->order('v.vendor_name, p.property_name, ua.utilityaccount_accountnumber, ua.utilityaccount_metersize')
        ;

        $select01 = new \NP\core\db\Select();
        if ($userprofile_id != $delegation_to_userprofile_id) {
            $select01 = new PropertyIdForUserSelect('1', $userprofile_id);
        } else {
            $select01 = new PropertyIdForDelegationSelect($userprofile_id, $delegation_to_userprofile_id);
        }

        $select02 = new \NP\core\db\Select();
        $select02
            ->column('property_id')
            ->from('propertyusercoding')
            ->where(
                \NP\core\db\Where::get()
                    ->equals('userprofile_id', $userprofile_id)
            )
        ;

        $where01 = new \NP\core\db\Where();
        $where01
            ->equals('utilityaccount_accountnumber', $utilityaccount_accountnumber)
            ->equals('utilityaccount_active', 1)
            ->nest('OR')
                ->in('ua.property_id', $select01)
                ->in('ua.property_id', $select02)
            ->unnest()
        ;
        $this->where($where01);
    }
}