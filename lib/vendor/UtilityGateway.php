<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Yura Rodchyn (rodchyn) rodchyn@gmail.com
 * Date: 8/26/13
 * Time: 4:43 PM
 * To change this template use File | Settings | File Templates.
 */

namespace NP\vendor;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Expression;

class UtilityGateway extends AbstractGateway {
    protected $pk         = 'Utility_Id';
    protected $tableAlias = 'ut';

    public function findUtilVendors($pageSize=null, $page=null, $sort='vendor_name') {
        $select = Select::get()->distinct()
                            ->columns(array())
                            ->from(['ut'=>'utility'])
                            ->join(new sql\join\UtilityVendorsiteJoin())
                            ->join(new sql\join\VendorsiteVendorJoin())
                            ->order($sort);

        // If paging is needed
        if ($pageSize !== null) {
            return $this->getPagingArray($select, array(), $pageSize, $page, new Expression('v.vendor_id'));
        } else {
            return $this->adapter->query($select);
        }
    }

    /**
     * Retreive utility by vendor id
     *
     * @param int $vendor_id
     * @return mixed
     */
    public function findByVendorId($vendor_id) {
        $select = Select::get()->distinct()
                            ->columns(array('UtilityType_Id','Property_Id','Vendorsite_Id','periodic_billing_flag','period_billing_cycle'))
                            ->from(['ut'=>'utility'])
                            ->join(new sql\join\UtilityVendorsiteJoin())
                            ->join(new sql\join\VendorsiteVendorJoin())
                            ->join(new sql\join\UtilityPhoneJoin())
                            ->join(new sql\join\UtilityContactJoin())
                            ->join(new \NP\contact\sql\join\ContactPersonJoin())
                            ->where(['vs.vendor_id' => $vendor_id]);

        $utilitites = $this->adapter->query($select);

        return $utilitites[0];
    }

    /**
     * Retreive utility by vendorsite id
     *
     * @param int $vendorsiteId
     * @return array|bool
     */
    public function findByVendorsiteId($vendorsiteId) {
        $select = new Select();

        $select->from(['u' => 'utility'])
            ->where(['u.vendorsite_id' => '?']);

        return $this->adapter->query($select, [$vendorsiteId]);
    }

    /**
     * Retrieve assigned types for the vendor
     *
     * @param id $vendorsite_id
     * @return array|bool
     */
    public function findAssignedUtilityTypes($vendorsite_id) {
        $select = new Select();
        $select->from(['u' => 'utility'])
            ->columns(['utilitytype_id'])
            ->where(['u.vendorsite_id' => $vendorsite_id]);

        return $this->adapter->query($select);
    }

    /**
     * Retrieve assigned vendor by utility
     *
     * @param $utility_id
     * @return mixed
     */
    public function findAssignedVendor($utility_id) {
        $select = new Select();

        $select->from(['u' => 'utility'])
            ->join(['vs' => 'vendorsite'], 'vs.vendorsite_id = u.vendorsite_id', ['vendor_id', 'vendorsite_id'])
            ->join(['v' => 'vendor'], 'v.vendor_id = vs.vendor_id', ['vendor_name', 'vendor_id_alt'])
            ->where(['u.utility_id' => $utility_id])
            ->columns([]);

        $vendor = $this->adapter->query($select);

        return $vendor[0];
    }

    /**
     * Retrieve utility by vendorsite_id and utilitytype_id
     *
     * @param $vendorsite_id
     * @param $type_id
     * @return mixed
     */
    public function findByVendorsiteIDAndType($vendorsite_id, $type_id) {
        $select = new Select();

        $select->from('utility')
            ->where(['utilitytype_id' => '?', 'vendorsite_id' => '?']);

        $res = $this->adapter->query($select, [$type_id, $vendorsite_id]);
        if (count($res)) {
            return $res[0];
        } else {
            return null;
        }
    }
}
