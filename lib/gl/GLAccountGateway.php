<?php

namespace NP\gl;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Insert;
use NP\core\db\Update;
use NP\system\ConfigService;

use NP\core\db\Adapter;

/**
 * Gateway for the GL Account table
 *
 * @author Thomas Messier
 */
class GLAccountGateway extends AbstractGateway {

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

	/**
	 * Gets all GL accounts that belong to a specified integration package
	 *
	 * @param  int   $integration_package_id The integration package to get GL accounts for
	 * @return array                         Array of GL account records
	 */
	public function findByIntegrationPackage($integration_package_id) {
		$order = ($this->configService->get('PN.Budget.GLDisplayOrder') == 'Name') ? 'glaccount_name' : 'glaccount_number';
		$select = new Select();
		$select->from('glaccount')
				->whereEquals('integration_package_id', '?')
				->whereEquals('glaccount_usable', '?')
				->whereEquals('glaccount_status', '?')
				->whereIsNotNull('glaccounttype_id')
				->order($order);

		return $this->adapter->query($select, array($integration_package_id, 'Y', 'active'));
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
	 * Retrieves GL accounts
	 *
	 * @return array
	 */
	public function getGLAccounts() {
		$select = new Select();
		$select->from(array('g'=>'glaccount'))
			   ->order("g.glaccount_name");
		return $this->adapter->query($select);
	}
        
        /**
	 * Retrieves All EXIM GL accounts
	 *
	 * @return array
	 */
	public function getGLAccountsExim() {
		$select = new Select();
		$select->from(array('g'=>'exim_glaccount'))
			   ->order("g.glaccount_name");
		return $this->adapter->query($select);
	}

    public function glaccountExists($glaccount_number, $integration_package_id)
    {
        $query = new Select();
        $query->from('glaccount')
            ->column('glaccount_id')
            ->where('glaccount_number = ? AND integration_package_id = ? AND glaccounttype_id IS NOT NULL');
        $result = $this->adapter->query($query, array($glaccount_number, $integration_package_id));
        $result = !empty($result)?$result[0]['glaccount_id']:false;
        return $result;
    }

    public function updateTree($glaccountId, $newGlAccountId, $parentTreeId, $treeOrder, $exists)
    {
        if(!$exists) {
            //Insert data to TREE
            // INSERT INTO TREE (tree_parent, table_name, tablekey_id, tree_order) VALUES (@parent_tree_id, 'glaccount', @new_glaccount_id, @tree_order)
            $treeValues = array(
                'tree_parent' => $parentTreeId,
                'table_name'  => "'glaccount'",
                'tablekey_id' => $newGlAccountId,
                'tree_order'  => $treeOrder
            );
            $query = new Insert('tree', $treeValues);
        } else {
            //UPDATE tree SET tree_parent = @parent_tree_id, tree_order = @tree_order WHERE table_name = 'glaccount' AND tablekey_id = @glaccount_id;
            $values = array(
                'tree_parent' => $parentTreeId,
                'tree_order'  => $treeOrder
            );
            $where = array(
                'table_name'  => "'glaccount'",
                'tablekey_id' => $glaccountId,
            );
            $query = new Update('tree', $values, $where);
        }
        $this->adapter->query($query);
    }
        
    public function saveEximGLAccount($data) {
            $account = $data->toArray();
            $insert = new Insert();
            $insert->into('exim_glaccount');
            $cols = array(
                'exim_glaccountName',
                'exim_glaccountNumber',
                'exim_glaccountType',
                'exim_categoryName',
                'exim_integrationPackage'
            );
            $insert->columns($cols);
            $insert->values($account);
            $result = $this->adapter->query($insert);
            return $result;

    }

    public function getTreeOrder($parentTreeId)
    {
        $select = new Select();
        $select->from('tree')
            ->columns(array('tree_order' => new \NP\core\db\Expression('ISNULL(max(tree_order), 0)')))
            ->where("table_name = 'glaccount' AND tree_parent = ?");

        $result = $this->adapter->query($select, array($parentTreeId));
        if(count($result) > 0) {
            return (int)$result[0]['tree_order'] + 1;
        }
        return 1;
    }

    public function getTreeIdForCategory($glAccountCategoryId)
    {
        $select = new Select();
        $select->from('tree')
            ->columns(array('id' => 'tree_id'))
            ->where("table_name = 'glaccount' AND tablekey_id = ?");

        $result = $this->adapter->query($select, array($glAccountCategoryId));
        return $result[0]['id'];
    }

    public function getCategoryIdByName($categoryName, $integrationPackageId)
    {
        $select = new Select();
        $select->from('GLACCOUNT')
            ->columns(array('id' => 'glaccount_id'))
            ->where("glaccount_name = ?	AND glaccounttype_id IS NULL AND integration_package_id = ?");

        $result = $this->adapter->query($select, array($categoryName, $integrationPackageId));
        return (!empty($result[0]['id'])) ? $result[0]['id'] : null;
    }

    public function getAccountTypeIdByName($accountType)
    {
        $select = new Select();
        $select->from(array('g' => 'GLACCOUNTTYPE'))
            ->columns(array('id' => 'glaccounttype_id'))
            ->where("g.glaccounttype_name= ?");

        $result = $this->adapter->query($select, array($accountType));
        return (!empty($result[0]['id'])) ? $result[0]['id'] : null;
    }

    public function getIntegrationPackageIdByName($integrationPackageName)
    {
        $select = new Select();
        $select->from('integrationpackage')
            ->columns(array('id' => 'integration_package_id'))
            ->where("integration_package_name = ?");

        $result = $this->adapter->query($select, array($integrationPackageName));
        return (!empty($result[0]['id'])) ? $result[0]['id'] : null;
    }
	
}
