<?php

namespace NP\gl;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\system\ConfigService;

use NP\core\db\Adapter;

/**
 * Gateway for the GL Account table
 *
 * @author Thomas Messier
 */
class GlAccountGateway extends AbstractGateway {
    protected $tableAlias = 'g';

    /**
     * @var \NP\system\ConfigService The config service singleton
     */
    protected $configService;
    
    /**
     * Setter function required by DI to set the config service via setter injection
     * @param \NP\system\ConfigService $configService
     */
    public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

    public function setSecurityService(\NP\security\SecurityService $securityService) {
        $this->securityService = $securityService;
    }

    public function getDefaultSortOrder() {
        return ($this->configService->get('PN.Budget.GLDisplayOrder') == 'Name') ? 'glaccount_name' : 'glaccount_number';
    }

    /**
     * @param  int    $vendorsite_id
     * @param  int    $property_id
     * @param  string $glaccount_keyword
     * @return array
     */
    public function findForInvoiceItemComboBox($vendorsite_id, $property_id, $glaccount_keyword='') {
        $usePropGL = $this->configService->get('CP.PROPERTYGLACCOUNT_USE', 0);
        $glaccount_keyword .= '%';
        $params = array($vendorsite_id, $glaccount_keyword, $glaccount_keyword);
        
        $select = new Select();
        $select->from(array('g'=>'glaccount'))
                ->join(array('gt'=>'glaccounttype'),
                        'gt.glaccounttype_id = g.glaccounttype_id',
                        array())
                ->join(array('vg'=>'vendorglaccounts'),
                        'vg.glaccount_id = g.glaccount_id',
                        array())
                ->join(array('vs'=>'vendorsite'),
                        'vg.vendor_id = vs.vendor_id',
                        array())
                ->join(array('v'=>'vendor'),
                        'vs.vendor_id = v.vendor_id',
                        array());
        
        $where = "
            g.glaccount_status = 'active'
            AND vs.vendorsite_id = ?
            AND g.integration_package_id = v.integration_package_id
            AND g.glaccounttype_id <> 10
            AND (
                g.glaccount_name LIKE ?
                OR g.glaccount_number LIKE ?
            )
        ";
        
        if ($usePropGL) {
            $select->join(array('pg'=>'propertyglaccount'),
                        'g.glaccount_id = pg.glaccount_id',
                        array());
            
            $where .= " AND pg.property_id = ?";
            $params[] = $property_id;
        }
        
        $select->where($where);
        
        $sqlStr = $select->toString();
        
        if ( $this->configService->get("PN.Budget.FixedAssetSpecial", 0) ) {
            $select = new Select();
            $select->from(array('g'=>'glaccount'))
                    ->join(array('i'=>'integrationpackage'),
                        'g.integration_package_id = i.integration_package_id',
                        array())
                    ->where("
                        g.glaccount_number = (SELECT fixedasset_account FROM property WHERE property_id = ?)
                        AND g.glaccount_status = 'active'
                        AND (
                            g.glaccount_name LIKE ?
                            OR g.glaccount_number LIKE ?
                        )
                    ");
            
            $sqlStr .= ' UNION ' . $select->toString();
            $params[] = $property_id;
            $params[] = $glaccount_keyword;
            $params[] = $glaccount_keyword;
        }
        
        $sqlStr .= ' ORDER BY gt.glaccounttype_name,' . $this->configService->get("PN.Budget.GLCodeSort", "glaccount_number");
        
        return $this->adapter->query($sqlStr, $params);
    }
    
    /**
     * Retrieves GL accounts that a specific user has access to
     * 
     * @param  int    $userprofile_id
     * @return array
     */
    public function findUserGLAccounts($userprofile_id) {
        $select = new Select();
        $select->from(array('g'=>'glaccount'))
                ->where("
                    EXISTS (
                        SELECT *
                        FROM PROPERTYGLACCOUNT pg
                            inner join propertyuserprofile pu ON pg.property_id = pu.property_id
                        WHERE g.glaccount_id = pg.glaccount_id
                            AND pu.userprofile_id = ?
                    )
                ")
                ->order("g.glaccount_name");
    
        return $this->adapter->query($select, array($userprofile_id));
    }

    /**
     * Checks if a certain GL category already exists
     *
     * @param  string $glaccount_name
     * @param  int    $integration_package_id
     * @return boolean
     */
    public function getCategoryByName($glaccount_name, $integration_package_id) {
        $select = new Select();
        $select->from(array('g'=>'glaccount'))
                ->join(new sql\join\GlAccountTreeJoin(array('tree_id')))
                ->whereEquals('glaccount_name', '?')
                ->whereEquals('integration_package_id', '?')
                ->whereIsNull('glaccounttype_id');

		echo $select->toString();
        $res = $this->adapter->query($select, array($glaccount_name, $integration_package_id));

        return (count($res)) ? $res[0] : null;
    }

    /**
     * Gets the next number in the sequence for the glaccount_order field within a certain tree
     *
     * @param  int $tree_parent
     * @return int
     */
    public function getMaxOrder($tree_parent) {
        $select = new Select();
        $select->column(new Expression("ISNULL(MAX(g.glaccount_order), 1) + 1"), 'max_order')
                ->column(new Expression("COUNT(*) + 1 AS total"))
                ->from(array('g'=>'glaccount'))
                ->join(new sql\join\GlAccountTreeJoin())
                ->whereEquals('tr.tree_parent', '?');

        $res = $this->adapter->query($select, array($tree_parent));

        // Return whichever is bigger, the glaccount_order or the number of records
        return ($res[0]['max_order'] > $res[0]['total']) ? $res[0]['max_order'] : $res[0]['total'];
    }
    
    /**
     * 
     */
    public function findByVendorsite($vendorsite_id, $property_id=null, $keyword=null, $glaccount_id=null) {
        $usePropGL = $this->configService->get('CP.PROPERTYGLACCOUNT_USE', 0);
        
        $params = [];

        $select = Select::get()->columns(array())
                            ->from(['vs'=>'vendorsite'])
                            ->join(new \NP\vendor\sql\join\VendorsiteVendorGlJoin(array()))
                            ->join(new \NP\vendor\sql\join\VendorGlGlAccountJoin())
                            ->whereEquals('vs.vendorsite_id', '?');
        $params[] = $vendorsite_id;

        if ($usePropGL == 1) {
            if (is_numeric($property_id)) {
                $select->whereMerge(new sql\criteria\GlPropertyCriteria('vg'));
                $params[] = $property_id;
            } else {
                $select->whereMerge(
                    new sql\criteria\GlUserPropertyCriteria($this->securityService->getUserId(), 'vg')
                );
            }
        }

        if ($keyword !== null) {
            $select->whereNest('OR')
                    ->whereLike('g.glaccount_name', '?')
                    ->whereLike('g.glaccount_number', '?');
            $params[] = "{$keyword}%";
            $params[] = "{$keyword}%";
        }

        if ($glaccount_id !== null) {
            $select->whereEquals('g.glaccount_id', '?');
            $params[] = $glaccount_id;
        }

        $select->order($this->getDefaultSortOrder());

        return $this->adapter->query($select, $params);
    }
    /**
    * Override to retrieve more by default
    */
    public function getSelect() {
        $select = new sql\GLAccountSelect();
        $select->columnsAll()
                ->joinTree(['tree_id','tree_parent'])
                ->joinTree2()
                ->joinCategory(array('glaccount_category' => 'glaccount_name'))
                ->joinType(array('glaccounttype_id','glaccounttype_name'))
                ->joinUpdatedBy(array('glaccount_updateby' => 'userprofile_id', 'userprofile_username'));

        return $select;
    }
        
    /**
     * 
     */
    public function findByFilter($integration_package_id=null, $glaccount_from=null,$glaccount_to=null,$glaccount_status=null, $property_id=null, $glaccounttype_id=null, $glaccount_category=null, $pageSize=null, $page=1, $sort='glaccount_name') {
        $select = $this->getSelect()
                        ->join(new sql\join\GlAccountIntegrationPackageJoin())
                        ->order($sort);
        $params = array();
        
        if ($integration_package_id !== null && $integration_package_id != '') {
            $select->whereEquals('g.integration_package_id', '?');
            $params[] = $integration_package_id;
        }
        
        if ($glaccount_from !== null && $glaccount_from != '') {
            $select->whereGreaterThanOrEqual('g.glaccount_number', '?');
            $params[] = $glaccount_from;
        }

        if ($glaccount_to !== null && $glaccount_to != '') {
            $select->whereLessThanOrEqual('g.glaccount_number', '?');
            $params[] = $glaccount_to;
        }
        
        if ($glaccount_status !== null && $glaccount_status != '') {
            $select->whereEquals('g.glaccount_status', '?');
            $params[] = $glaccount_status;
        }

        if ($property_id !== null && $property_id != '') {
            $propSelect = new Select();
            $select->whereExists(
                $propSelect->from(array('pg'=>'propertyglaccount'))
                            ->whereEquals('g.glaccount_id', 'pg.glaccount_id')
                            ->whereEquals('pg.property_id', '?')
            );
            $params[] = $property_id;
        }

        if ($glaccounttype_id !== null && $glaccounttype_id != '') {
            $select->whereEquals('gt.glaccounttype_id', '?');
            $params[] = $glaccounttype_id;
        }

        if ($glaccount_category !== null && $glaccount_category != '') {
            $select->whereEquals('t2.tree_id', '?');
            $params[] = $glaccount_category;
        }

        // If paging is needed
        if ($pageSize !== null) {
            return $this->getPagingArray($select, $params, $pageSize, $page);
        } else {
            return $this->adapter->query($select, $params);
        }
    }
        
    /**
     * 
     */
    public function getCategories($integration_package_id=null) {
        $select = new Select();
        $select->columns(array('glaccount_id','integration_package_id','glaccount_name','glaccount_status','glaccount_category' =>'glaccount_name', 'glaccount_order'))
                ->from(array('g'=>'glaccount'))
                ->join(new sql\join\GlAccountTreeJoin(array('tree_id')))
                ->whereIsNull('glaccounttype_id')
                ->order('g.glaccount_order');

        $params = [];
        if ($integration_package_id !== null) {
            $select->whereEquals('g.integration_package_id', '?');
            $params[] = $integration_package_id;
        }

        return $this->adapter->query($select, $params);
    }


	public function findBudgetAmountByGlCategory($integration_package_id) {
		$select = new Select();
		$select->from(['g'=>'glaccount'])
			->join(new sql\join\GlAccountTreeJoin())
			->join(new sql\join\GlAccountIntegrationPackageJoin())
			->whereEquals('g.integration_package_id', '?')
			->whereIsNull('glaccounttype_id');

		return $this->adapter->query($select, [$integration_package_id]);
	}


	public function findBudgetAmountByGlCode($integration_package_id, $sort='glaccount_number') {
		$select = new Select();
		$select->from(['g'=>'glaccount'])
			->join(new sql\join\GlAccountTreeJoin())
			->join(new sql\join\GlAccountIntegrationPackageJoin())
			->whereEquals('g.integration_package_id', '?')
			->whereIsNotNull('g.glaccounttype_id')
			->order('g.'.$sort);

		return $this->adapter->query($select, [$integration_package_id]);
	}

}

?>