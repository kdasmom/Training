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

    public function saveUtilityTypesRelations($utility_id, $types) {
//        delete assigned types
        $delete = new Delete();
        $delete->from('utilitytypes')
            ->where(['utility_id' => $utility_id]);
        $this->adapter->query($delete);
//        save types
        $insert = new Insert();
        foreach ($types as $type) {
            $insert->into('utilitytypes')
                ->columns(array('utility_id', 'utilitytype_id'))
                ->values(array('utility_id' => $utility_id, 'utilitytype_id' => $type));
            $this->adapter->query($insert);
        }
    }

}