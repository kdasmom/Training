<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the UTILITYACCOUNT table
 *
 * @author Thomas Messier
 */
class UtilityAccountGateway extends AbstractGateway {
    protected $pk = 'UtilityAccount_Id';

    /**
     * 
     */
    public function findById($id, $cols=null) {
         $select = Select::get()->columns($cols)
                            ->from(['ua' => 'utilityaccount'])
                            ->join(new sql\join\UtilityAccountUtilityJoin())
                            ->join(new sql\join\UtilityUtilityTypeJoin())
                            ->join(new sql\join\UtilityVendorsiteJoin())
                            ->join(new sql\join\VendorsiteVendorJoin())
                            ->join(new sql\join\UtilityAccountPropertyJoin())
                            ->join(new sql\join\UtilityAccountGlAccountJoin())
                            ->join(new sql\join\UtilityAccountUnitJoin())
                            ->where('ua.utilityaccount_id = ?');

        $res = $this->adapter->query($select, array($id));

        return $res[0];
    }

    public function findByVendor($vendorsite_id, $property_id, $utilitytype_id, $glaccount_id, $sort) {
        $select = new Select();

        $where = ['vs.vendorsite_id'=>'?'];
        $params = [$vendorsite_id];

        if ($property_id) {
            $where['pr.property_id'] = '?';
            $params[] = $property_id;
        }
        if ($utilitytype_id) {
            $where['ut.utilitytype_id'] = '?';
            $params[] = $utilitytype_id;
        }
        if ($glaccount_id) {
            $where['ua.glaccount_id'] = '?';
            $params[] = $glaccount_id;
        }

        $select->from(['ua' => 'utilityaccount'])
            ->join(new sql\join\UtilityAccountUtilityJoin())
            ->join(new sql\join\UtilityUtilityTypeJoin())
            ->join(new sql\join\UtilityVendorsiteJoin())
            ->join(new sql\join\VendorsiteVendorJoin())
            ->join(new sql\join\UtilityAccountPropertyJoin())
            ->join(new sql\join\UtilityAccountGlAccountJoin())
            ->join(new sql\join\UtilityAccountUnitJoin())
            ->where($where)
            ->order($sort);
        
        // If paging is needed
        return $this->adapter->query($select, $params);
    }

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
        $result = $this->adapter->query($select);

        for ($i = 0; $i < count($result); $i++) {
            $result[$i]['utilityaccount_name'] = 
                $result[$i]['vendor_name'].
                '('.$result[$i]['vendor_id_alt'].') - '.
                $result[$i]['property_name'].
                '('.$result[$i]['property_id_alt'].')'.
                ' - Acct: '.$result[$i]['utilityaccount_accountnumber']
            ;
            if (!empty($result[$i]['utilityaccount_metersize'])) {
                $result[$i]['utilityaccount_name'] .= ' - Meter: '.$result[$i]['utilityaccount_metersize'];
            } 
        }
        return $result;
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

?>