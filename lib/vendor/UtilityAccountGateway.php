<?php

namespace NP\vendor;

use NP\core\AbstractGateway;

/**
 * Gateway for the UTILITYACCOUNT table
 *
 * @author Thomas Messier
 */
class UtilityAccountGateway extends AbstractGateway {
    protected $pk = 'UtilityAccount_Id';

    public function getMeterByAccount($account, $property_id = null, $vendorsite_id = null) {
        $select = new sql\MeterByAccountSelect(
            $account,
            $property_id,
            $vendorsite_id
        );
        return $this->adapter->query($select);
    }

    public function getAccountNumbers($userprofile_id, $delegation_to_userprofile_id) {
        $select01 = new \NP\core\db\Select();
        if ($userprofile_id == $delegation_to_userprofile_id) {
            $select01 = new sql\PropertyIdForUserSelect('null, 1', $userprofile_id);
        } else {
            $select01 = new sql\PropertyIdForDelegationSelect($userprofile_id, $delegation_to_userprofile_id);
        }

        $select03 = new \NP\core\db\Select();
        $select03
            ->distinct()
                ->column('utilityAccount_accountNumber')
            ->from('utilityaccount')
            ->order('utilityAccount_accountNumber')
        ;

        $select04 = new \NP\core\db\Select();
        $select04
            ->column('property_id')
            ->from('propertyusercoding')
            ->where(
                \NP\core\db\Where::get()
                    ->equals('userprofile_id', $userprofile_id)
            )
        ;

        $where03 = new \NP\core\db\Where();
        $where03
            ->equals('utilityaccount_active', 1)
            ->nest('OR')
                ->in('property_id', $select01)
                ->in('property_id', $select04)
            ->unnest()
        ;

        $select03->where($where03);

        return $this->adapter->query($select03);
    }

    public function getUtilityAccountsByCriteria($userprofile_id, $delegation_to_userprofile_id, $utilityaccount_accountnumber) {
        $select = new sql\UtilityAccountsByCriteriaSelect(
            $userprofile_id,
            $delegation_to_userprofile_id,
            $utilityaccount_accountnumber
        );
        return $this->adapter->query($select);
/*
			ua.utilityaccount_id,
			ua.utilityaccount_metersize,
			vs.vendorsite_id,
			p.property_id,
			v.vendor_name + ' (' + v.vendor_id_alt + ') - ' + p.property_name + ' (' + p.property_id_alt + ')' 
					+ ' - Acct: ' + ua.utilityaccount_accountnumber + 
					CASE
						WHEN ISNULL(ua.utilityaccount_metersize, '') <> '' THEN ' - Meter: ' + ua.utilityaccount_metersize
						ELSE ''
					END AS utilityaccount_name

 */
     //   return $this->adapter->query($select02);
    }

    public function getUtilityAccountDetails($utilityaccount_accountnumber) {
        $select = new \NP\core\db\Select();
        $select
            ->columns([])
            ->from(['ua' => 'utilityaccount'])
                ->join(['u' => 'utility'], 'ua.utility_id = u.utility_id', [], \NP\core\db\Select::JOIN_INNER)
                ->join(['vs' => 'vendorsite'], 'u.vendorsite_id = vs.vendorsite_id', ['vendorsite_id'], \NP\core\db\Select::JOIN_INNER)
                ->join(['v' => 'vendor'], 'vs.vendor_id = v.vendor_id', ['vendor_name', 'vendor_id_alt'], \NP\core\db\Select::JOIN_INNER)
                ->join(['p' => 'property'], 'ua.property_id = p.property_id', ['property_id', 'property_name', 'property_id_alt'], \NP\core\db\Select::JOIN_INNER)
            ->where(
                \NP\core\db\Where::get()
                    ->equals('ua.utilityaccount_accountnumber', $utilityaccount_accountnumber)
            )
            ->limit(1)
        ;
        return $this->adapter->query($select);
    }
}