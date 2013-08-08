<?php

namespace NP\gl;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Insert;
use NP\core\db\Update;
use NP\locale\LocalizationService;
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

    protected $localizationService;

    protected $di;

	/**
	 * Setter function required by DI to set the config service via setter injection
	 * @param \NP\system\ConfigService $configService
	 */
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

    public function setLocalizationService(LocalizationService $localizationService)
    {
        $this->localizationService = $localizationService;
    }

    public function setDI(\Pimple $di)
    {
        $this->di = $di;
    }

    public function __get($key)
    {
        return $this->di[$key];
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

    public function validateImportEntity(&$row, &$errors)
    {
//        var_dump($row);
        // Get Id for field glaccounttype_id, integrationPackageId, glaccount_level
        $glaccounttype_id = $this->getAccountTypeIdByName($row['AccountType']);
        $integrationPackageId = $this->getIntegrationPackageIdByName($row['IntegrationPackageName']);
        $glaccount_level = $this->getCategoryIdByName($row['CategoryName'], $integrationPackageId);

        // Check the GLAccount Type in DB
        if (is_null($glaccounttype_id)) {
            $errors[] = array(
                'field' => 'exim_accountType',
                'msg'   => $this->localizationService->getMessage('importFieldAccountTypeError'),
                'extra' => null
            );
        }

        // Check the Integration Package Name in DB
        if (is_null($integrationPackageId)) {
            $errors[] = array(
                'field' => 'exim_integrationPackage',
                'msg'   => $this->localizationService->getMessage('importFieldIntegrationPackageNameError'),
                'extra' => null
            );
        }

        // Check the Category Name in DB
        if (is_null($glaccount_level)) {
            $errors[] = array(
                'field' => 'exim_categoryName',
                'msg'   => $this->localizationService->getMessage('importFieldCategoryNameError'),
                'extra' => null
            );
        }

        if (count($errors)) {
            $errorStrings = array();
            foreach($errors as $error) {
                $errorStrings[] = $error['msg'];
            }
            $row['validation_status'] = '<span style="color:red;"><img src="resources/images/buttons/inactivate.gif" /></span>';
            $row['validation_messages'] = join(', ', $errorStrings);
        } else {
            $row['validation_status'] = '<span style="color:green;"><img src="resources/images/buttons/activate.gif" /></span>';
            $row['validation_messages'] = '';
        }

    }

    public function save($data)
    {
        // TODO
        $userProfileId = $this->securityService->getUserId();

            // Get entities
            $accountNumber = $data->glaccount_number;
            $accountName = $data->glaccount_name;
            $integrationPackageName = $data->integration_package_name;
            $categoryName = $data->category_name;
            $accountTypeName = $data->account_type_name;

            $accountTypeId = $this->getAccountTypeIdByName($accountTypeName);
            $integrationPackageId = $this->getIntegrationPackageIdByName($integrationPackageName);
            $glAccountCategoryId = $this->getCategoryIdByName($categoryName, $integrationPackageId);
            $parentTreeId  = $this->TreeGateway->getTreeIdForCategory($glAccountCategoryId);
            $treeOrder = $this->TreeGateway->getTreeOrder($parentTreeId);
            $account = array(
                'glaccount_name' => $accountName,
                'glaccount_number' => $accountNumber,
                'glaccounttype_id' => $accountTypeId,
                'integration_package_id' => $integrationPackageId,
                'glaccount_updateby' => $userProfileId
            );

            $exists = $oldGlAccountId = $this->glaccountExists($accountNumber, $integrationPackageId);
            if($exists) {
                $account['glaccount_id'] = $oldGlAccountId;
            }

            $glaccount     = new GLAccountEntity($account);

            // Run validation
            $validator = new EntityValidator();
            $validator->validate($glaccount);
            $errors    = $validator->getErrors();

            // If the data is valid, save it
            if (count($errors) == 0) {
                // Begin transaction
                $this->beginTransaction();

                try {
                    // Save the glaccount record
                    parent::save($glaccount);
                    $newGlAccountId = $glaccount->glaccount_id;
                    $this->TreeGateway->updateTree($oldGlAccountId, $newGlAccountId, $parentTreeId, $treeOrder, $exists);

                } catch(\Exception $e) {
                    // Add a global error to the error array
                    $errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e), 'extra'=>null);
                }
            }

            if (count($errors)) {
                $this->rollback();
            } else {
                $this->commit();
            }
    }
}
