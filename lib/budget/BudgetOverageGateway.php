<?php

namespace NP\budget;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;

/**
 * Gateway for the BUDGETOVERAGE table
 *
 * @author
 */
class BudgetOverageGateway extends AbstractGateway {

    public function __construct(Adapter $adapter) {
        parent::__construct($adapter);
    }

    public function findByPropertyId($property_id, $sort = 'property_name') {
        $select = new Select();
        $where = [
            'p.property_status' => 1
        ];

        if ($property_id) {
            $where['bo.property_id'] = $property_id;
        }
        $select->from(array('bo'=>'budgetoverage'))
            ->join(array('u' => 'userprofile'),
                'bo.userprofile_id = u.userprofile_id',
                array('userprofile_id','userprofile_username'))
            ->join(array('r' => 'role'),
                'bo.role_id = r.role_id',
                array('role_id','role_name'))
            ->join(array('p' => 'property'),
                'bo.property_id = p.property_id',
                array('property_id', 'property_name'))
            ->join(array('gl' => 'glaccount'),
                'bo.glaccount_id = gl.glaccount_id',
                array('glaccount_id','glaccount_name'))
            ->where($where)
            ->order($sort);

        return $this->adapter->query($select);
    }
}
?>