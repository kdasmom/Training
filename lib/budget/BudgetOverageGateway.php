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
    protected $tableAlias = 'bo';

    public function findByPropertyId($property_id, $pageSize=null, $page=null, $sort="property_name") {
        $where = array('pr.property_status' => 1);

        if ($property_id) {
            $where['bo.property_id'] = '?';
        }

        return $this->find(
            $where,
            array($property_id),
            $sort,
            null,
            $pageSize,
            $page,
            array(
                new sql\join\BudgetOverageUserJoin(),
                new sql\join\BudgetOverageRoleJoin(),
                new sql\join\BudgetOveragePropertyJoin(),
                new sql\join\BudgetOverageGlAccountJoin(),
                new sql\join\BudgetOverageUserprofileRoleJoin(),
				new sql\join\BudgetOverageStaffJoin(),
				new sql\join\BudgetOveragePersonJoin()
            )
        );
    }
}
?>