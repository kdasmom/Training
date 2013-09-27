<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 2:19 PM
 */

namespace NP\utility;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;

/**
 * Gateway for the UTILITYTYPE table
 *
 * @author
 */
class UtilityTypeGateway extends AbstractGateway {

    public function __construct(Adapter $adapter) {
        parent::__construct($adapter);

    }

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
