<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\property\PropertyContext;
use NP\property\sql\PropertyFilterSelect;

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

    public function getMeterSizesByAccount($userprofile_id, $delegation_to_userprofile_id,
                                        $UtilityAccount_AccountNumber) {
        $params = [$UtilityAccount_AccountNumber];

        $select = Select::get()
                        ->distinct()
                        ->column('UtilityAccount_MeterSize')
                        ->from(['ua'=>'utilityaccount'])
                        ->whereEquals('ua.utilityaccount_active', 1)
                        ->whereEquals('ua.UtilityAccount_AccountNumber', '?')
                        ->whereNotEquals('ua.UtilityAccount_MeterSize', "''")
                        ->whereIsNotNull('ua.UtilityAccount_MeterSize')
                        ->order('ua.UtilityAccount_MeterSize');

        $this->addPropertyFilterToSelect($select, $userprofile_id, $delegation_to_userprofile_id);

        if ($userprofile_id == $delegation_to_userprofile_id) {
            $params[] = $userprofile_id;
        }

        return $this->adapter->query($select, $params);
    }

    public function getAccountNumbersByUser($userprofile_id, $delegation_to_userprofile_id) {
        $params = [];
        $select = Select::get()
                        ->distinct()
                        ->column('UtilityAccount_AccountNumber')
                        ->from(['ua'=>'utilityaccount'])
                        ->whereEquals('ua.utilityaccount_active', 1)
                        ->order('ua.utilityaccount_accountnumber');

        $this->addPropertyFilterToSelect($select, $userprofile_id, $delegation_to_userprofile_id);

        if ($userprofile_id == $delegation_to_userprofile_id) {
            $params[] = $userprofile_id;
        }

        return $this->adapter->query($select, $params);
    }

    public function getAccountsByUser($userprofile_id, $delegation_to_userprofile_id,
                                    $UtilityAccount_AccountNumber=null, $UtilityAccount_MeterSize=null) {
        $params = [];
        $select = Select::get()
                        ->from(['ua'=>'utilityaccount'])
                        ->join(new sql\join\UtilityAccountPropertyJoin())
                        ->join(new sql\join\UtilityAccountUtilityJoin([]))
                        ->join(new sql\join\UtilityVendorsiteJoin())
                        ->join(new sql\join\VendorsiteVendorJoin())
                        ->join(new sql\join\UtilityUtilityTypeJoin())
                        ->whereEquals('ua.utilityaccount_active', 1)
                        ->order('ua.utilityaccount_accountnumber');

        $this->addPropertyFilterToSelect($select, $userprofile_id, $delegation_to_userprofile_id);

        if ($userprofile_id == $delegation_to_userprofile_id) {
            $params[] = $userprofile_id;
        }

        if ($UtilityAccount_AccountNumber !== null) {
            $select->whereEquals('ua.UtilityAccount_AccountNumber', '?');
            $params[] = $UtilityAccount_AccountNumber;
        }

        if ($UtilityAccount_MeterSize !== null) {
            $select->whereEquals('ua.UtilityAccount_MeterSize', '?');
            $params[] = $UtilityAccount_MeterSize;
        }

        return $this->adapter->query($select, $params);
    }

    private function addPropertyFilterToSelect($select, $userprofile_id, $delegation_to_userprofile_id) {
        $select->whereNest('OR')
                ->whereIn(
                    'ua.property_id',
                    new PropertyFilterSelect(
                        new PropertyContext(
                            $userprofile_id,
                            $delegation_to_userprofile_id,
                            'all',
                            null
                        )
                    )
                );
        if ($userprofile_id == $delegation_to_userprofile_id) {
            $select->whereIn(
                'ua.property_id',
                Select::get()
                        ->column('property_id')
                        ->from('propertyusercoding')
                        ->whereEquals('userprofile_id', '?')
            );
        }

        $select->whereUnnest();

        return $select;
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
