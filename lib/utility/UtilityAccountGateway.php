<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 9/26/13
 * Time: 12:41 AM
 */

namespace NP\utility;


use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the UTILITYACCOUNT table
 *
 * @author
 */
class UtilityAccountGateway extends AbstractGateway {

    public function getAll($vendorid, $propertyid, $utilitytypeid, $glaccountid, $pageSize, $page, $order) {

        $select = new Select();

        $where = [];
        $params = [];
        if ($vendorid) {
            $where['v.vendor_id'] =  '?';
            $params[] = $vendorid;
        }
        if ($propertyid) {
            $where['p.property_id'] = '?';
            $params[] = $propertyid;
        }
        if ($utilitytypeid) {
            $where['u.utilitytype_id'] = '?';
            $params[] = $utilitytypeid;
        }
        if ($glaccountid) {
            $where['ua.glaccount_id'] = '?';
            $params[] = $glaccountid;
        }

        $select->from(['ua' => 'utilityaccount'])
            ->join(['u' => 'utility'], 'u.utility_id = ua.utility_id', [])
            ->join(['ut' => 'utilitytype'], 'ut.utilitytype_id = u.utilitytype_id', ['utilitytype'])
            ->join(['vs' => 'vendorsite'], 'vs.vendorsite_id = u.vendorsite_id', [])
            ->join(['v' => 'vendor'], 'v.vendor_id = vs.vendor_id', ['vendor_id', 'vendor_name'])
            ->join(['p' => 'property'], 'p.property_id = ua.property_id', ['property_name'])
            ->join(['gl' => 'glaccount'], 'gl.glaccount_id = ua.glaccount_id', ['glaccount_name'], Select::JOIN_LEFT)
            ->join(['un' => 'unit'], 'un.unit_id = ua.unit_id', ['unit_number'], Select::JOIN_LEFT)
            ->order($order)
            ->limit($pageSize)
            ->offset($pageSize*($page - 1))
            ->where($where);
//        print ($select->toString());
        return $this->adapter->query($select, $params);
    }
}