<?php

namespace NP\budget;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Join;

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
                new sql\join\BudgetOverageGlAccountYearJoin(),
                new Join(
                    ['b'=>'budget'],
                    'gy.glaccountyear_id = b.glaccountyear_id AND bo.budgetoverage_period = b.budget_period',
                    ['budget_amount'],
                    Select::JOIN_LEFT),
                new \NP\gl\sql\join\GlAccountTreeJoin(),
                new \NP\system\sql\join\TreeTreeParentJoin(),
                new \NP\system\sql\join\TreeParentGlCategoryJoin([
                    'category_name' => 'glaccount_name'
                ]),
                new \NP\user\sql\join\UserUserroleJoin(),
				new \NP\user\sql\join\UserroleStaffJoin(),
				new \NP\user\sql\join\StaffPersonJoin()
            )
        );
    }
}
?>