<?php

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the UTILITYTYPE table
 *
 * @author Thomas Messier
 */
class UtilityTypeGateway extends AbstractGateway {
    /**
     * Retrieve utilitytypes list by vendorsite id
     *
     * @param $vendorsite_id
     * @return array|bool
     */
    public function findByVendorsite_id($vendorsite_id) {
        $select = new Select();

        $select->from(['ut' => 'utilitytype'])
            ->join(['u' => 'utility'], 'ut.utilitytype_id = u.utilitytype_id', ['Utility_Id'])
            ->where(['u.vendorsite_id' => '?'])
            ->order('ut.utilitytype');

        return $this->adapter->query($select, [$vendorsite_id]);
    }
}

?>