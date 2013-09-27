<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/24/13
 * Time: 11:52 AM
 */

namespace NP\utility;


use NP\core\AbstractGateway;
use NP\core\db\Delete;
use NP\core\db\Select;
use NP\core\db\Adapter;
use NP\core\db\Insert;

class UtilityGateway extends AbstractGateway {

    public function __construct(Adapter $adapter) {
        parent::__construct($adapter);
    }

    /**
     * Retreive Utility Vendors list
     *
     * @param null $pageSize
     * @param null $page
     * @param string $order
     * @return array|bool
     */
    public function findVendors($pageSize = null, $page = null, $order = "vendor_name") {
        $select = new Select();
        $select->distinct()
                ->from(['u' => 'utility'])
                ->join(
                    ['vs' => 'vendorsite'],
                    'vs.vendorsite_id = u.vendorsite_id',
                    []
                )
                ->join(
                    ['v' => 'vendor'],
                    'v.vendor_id = vs.vendor_id',
                    ['vendor_id', 'vendor_name', 'vendor_status']
                )
                ->order($order)
                ->limit($pageSize)
                ->offset($pageSize*($page - 1));

        return $this->adapter->query($select);
    }


    /**
     * Retreive utility by vendor id
     *
     * @param int $vendor_id
     * @return mixed
     */
    public function findByVendorId($vendor_id) {
        $select = new Select();
        $select->from(['u' => 'utility'])
            ->join(
                ['vs' => 'vendorsite'],
                'u.vendorsite_id = vs.vendorsite_id',
                []
            )
            ->where(['vs.vendor_id' => $vendor_id]);

        $utilitites  =$this->adapter->query($select);

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
        return $res[0];
    }


}