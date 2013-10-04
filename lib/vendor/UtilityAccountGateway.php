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
}

?>