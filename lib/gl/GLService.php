<?php

namespace NP\gl;

use NP\core\AbstractService;
use NP\core\db\Where;
use NP\system\TreeGateway;
use NP\system\IntegrationPackageGateway;
use NP\gl\GlAccountTypeGateway;
use NP\vendor\VendorGlAccountsGateway;

/**
 * All operations that are closely related to GL accounts belong in this service
 *
 * @author Thomas Messier
 */
class GLService extends AbstractService {
    
    protected $securityService, $glAccountGateway, $treeGateway, $integrationPackageGateway,
            $vendorGlAccountsGateway;

    public function __construct(GLAccountGateway $glAccountGateway, TreeGateway $treeGateway,
                                IntegrationPackageGateway $integrationPackageGateway,
                                GlAccountTypeGateway $glAccountTypeGateway,
                                VendorGlAccountsGateway $vendorGlAccountsGateway) {
            $this->glAccountGateway          = $glAccountGateway;
            $this->treeGateway               = $treeGateway;
            $this->integrationPackageGateway = $integrationPackageGateway;
            $this->glAccountTypeGateway      = $glAccountTypeGateway;
            $this->vendorGlAccountsGateway   = $vendorGlAccountsGateway;
    }

    public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

    public function setSecurityService(\NP\security\SecurityService $securityService) {
        $this->securityService = $securityService;
    }
    
    /**
     * Returns all GL Accounts in the system
     */
    public function getAll() {
        $order = ($this->configService->get('PN.Budget.GLDisplayOrder') == 'Name') ? 'glaccount_name' : 'glaccount_number';

        return $this->glAccountGateway->find(
            null,
            array(),
            $order,
            array('glaccount_id','glaccount_number','glaccount_name')
        );
    }
    
    /**
     * Returns all Category in the system
     */
    public function getCategories() {
        return $this->glAccountGateway->getCategories();
    }
        
    /**
     * Retrieves all GL Accounts for grid GL Account Setup
     *
     * @return array
     */
    public function getAllGLAccounts($glaccount_from=null,$glaccount_to=null,$glaccount_status=null, $property_id=null, $glaccounttype_id=null, $glaccount_category=null, $pageSize=null, $page=1, $sort='glaccount_name') {
            return $this->glAccountGateway->findByFilter($glaccount_from, $glaccount_to, $glaccount_status, $property_id, $glaccounttype_id, $glaccount_category, $pageSize, $page, $sort);
    }
        
    /**
     * Retrieves all GL Accounts for grid GL Account Setup
     *
     * @return array
     */
    public function getTypes() {
        return $this->glAccountTypeGateway->find(
            null,
            array(),
            "glaccounttype_name",
             array('glaccounttype_id','glaccounttype_name')
        );
    }
        
    /**
     * Retrieves all GL Accounts for grid GL Account Setup
     *
     * @return array
     */
    public function getGLAccount($id) {
        $res = $this->glAccountGateway->findById($id);
        //$res['glaccount_category'] = $this->glaccountGateway->getCategoryByName($res['glaccount_name'], $res['integration_package_id']);
        $res['vendor_glaccounts'] = $this->vendorGlAccountsGateway->find(
                                            array('glaccount_id'=>'?'),
                                            array($id),
                                            'vendor_id',
                                            array('vendor_id')
                                        );

        $res['vendor_glaccounts'] = \NP\util\Util::valueList($res['vendor_glaccounts'], 'vendor_id');

        return $res;
    }
    
    /**
     * Retrieves records from GLAccount table that display in an invoice line item combo box matching a
     * specific vendor, property, and keyword (basically to be used by an autocomplete combo as someody
     * types into it)
     * 
     * @param  int    $vendorsite_id
     * @param  int    $property_id
     * @param  string $glaccount_keyword
     * @return array
     */
    public function getForInvoiceItemComboBox($vendorsite_id, $property_id, $glaccount_keyword='') {
        return $this->glAccountGateway->findForInvoiceItemComboBox($vendorsite_id, $property_id, $glaccount_keyword);
    }
    
    /**
     * Gets all GL accounts that belong to a specified integration package
     *
     * @param  int   $integration_package_id The integration package to get GL accounts for
     * @return array                         Array of GL account records
     */
    public function getByIntegrationPackage($integration_package_id, $glaccount_keyword=null) {
        $wheres = array(
            array(
                'integration_package_id' => '?',
                'glaccount_usable'       => '?',
                'glaccount_status'       => '?'
            ),
            new sql\criteria\GlIsCategoryCriteria()
        );
        $params = array($integration_package_id, 'Y', 'active');

        if ($glaccount_keyword !== null) {
            $wheres[] = new sql\criteria\GlKeywordCriteria();
            $keyword = $glaccount_keyword . '%';
            $params[] = $glaccount_keyword;
            $params[] = $glaccount_keyword;
        }

        return $this->glAccountGateway->find(
            Where::buildCriteria($wheres),
            $params,
            $this->glAccountGateway->getDefaultSortOrder(),
            array('glaccount_id','glaccount_number','glaccount_name')
        );
    }
    
    /**
     * Gets all GL accounts that are assigned to a specific property
     *
     * @param  int   $property_id The integration package to get GL accounts for
     * @return array              Array of GL account records
     */
    public function getByProperty($property_id, $keyword=null) {
        $wheres = array(
            array(
                'glaccount_usable'       => '?',
                'glaccount_status'       => '?'
            ),
            new sql\criteria\GlPropertyCriteria(),
            new sql\criteria\GlIsCategoryCriteria()
        );
        $params = array('Y', 'active', $property_id);

        if ($keyword !== null) {
            $wheres[] = new sql\criteria\GlKeywordCriteria();
            $keyword = $keyword . '%';
            $params[] = $keyword;
            $params[] = $keyword;
        }

        return $this->glAccountGateway->find(
            Where::buildCriteria($wheres),
            $params,
            $this->glAccountGateway->getDefaultSortOrder(),
            array('glaccount_id','glaccount_number','glaccount_name')
        );
    }

    public function getByVendorsite($vendorsite_id, $property_id=null, $keyword=null, $glaccount_id=null) {
        return $this->glAccountGateway->findByVendorsite($vendorsite_id, $property_id, $keyword, $glaccount_id);
    }

    /**
     * Saves a GL category
     *
     * @param array  $data
     * @param string $entityType Valid values are 'category' or 'account'
     */
    public function save($data, $entityType) {
        $className = '\NP\gl\GL' . ucfirst($entityType) . 'Entity';
        $glaccount = new $className($data['glaccount']);

        // Update some fields that aren't user generated
        if ($glaccount->glaccount_id === null) {
            $glaccount->glaccount_order = $this->glAccountGateway->getMaxOrder($data['tree_parent']);
        } else {
            $glaccount->glaccount_updateby = $this->securityService->getUserId();
        }

        $errors = $this->entityValidator->validate($glaccount);
        
        if (!count($errors)) {
            $this->glAccountGateway->beginTransaction();

            try {
                $this->glAccountGateway->save($glaccount);

                $this->treeGateway->saveByTableNameAndId(
                    'glaccount',
                    $glaccount->glaccount_id,
                    $data['tree_parent']
                );
            } catch(\Exception $e) {
                // Add a global error to the error array
                $errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e), 'extra'=>null);
            }

            if (count($errors)) {
                $this->glAccountGateway->rollback();
            } else {
                $this->glAccountGateway->commit();
            }
        }

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
    }
        
    /**
     * save GL Account
     *
     * @param $data
     * @return array
     */
    public function saveGlAccount($data) {
        $glaccount = new GLAccountEntity($data['glaccount']);

        $now = \NP\util\Util::formatDateForDB();

        if ($glaccount->glaccount_id == null) {
            $glaccount->glaccount_updateby = $data['glaccount_updateby'];
        }
        $validator = new EntityValidator();

        $validator->validate($glaccount);
        $errors = $validator->getErrors();

        if (count($errors) == 0) {
            $this->glAccountGateway->beginTransaction();

            try {
                $this->glAccountGateway->save($glaccount);
                $this->glAccountGateway->commit();
            } catch(\Exception $e) {
                // If there was an error, rollback the transaction
                $this->glAccountGateway->rollback();
                // Add a global error to the error array
                $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
            }
        }


        return array(
            'success'    => (count($errors)) ? false : true,
            'errors'     => $errors,
        );
    }

    /**
     * Saves a collection of categories imported using the import tool
     *
     * @param array $data
     */
    public function saveGLCategoryFromImport($data) {
        // Use this to store integration package IDs
        $intPkgs = array();
        $errors  = array();

        foreach ($data as $idx=>$row) {
            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $intPkg = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $intPkg[0]['integration_package_id'];
            }
            $row['integration_package_id'] = $intPkgs[$row['integration_package_name']];
            $row['glaccount_number']       = $row['glaccount_name'];

            $result = $this->save(
                array(
                    'glaccount'   => $row,
                    'tree_parent' => 0
                ),
                'category'
            );

            if (!$result['success']) {
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$idx}";
                $errors[] = $errorMsg;
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
    }

    public function saveGLCodeFromImport($data) {
        // Use this to store integration package IDs
        $intPkgs = array();
        // Use this to store account type IDs
        $accountTypes = array();
        // Use this to store account type IDs
        $categories = array();

        $errors  = array();

        // Loop through all the rows to import
        foreach ($data as $idx=>$row) {
            // If there's been no record with this integration package, we need to retrieve the ID for it
            if (!array_key_exists($row['integration_package_name'], $intPkgs)) {
                $rec = $this->integrationPackageGateway->find(
                    'integration_package_name = ?',
                    array($row['integration_package_name'])
                );
                $intPkgs[$row['integration_package_name']] = $rec[0]['integration_package_id'];
            }
            $row['integration_package_id'] = $intPkgs[$row['integration_package_name']];

            // If there's been no record with this account type, we need to retrieve the ID for it
            if (!array_key_exists($row['glaccounttype_name'], $accountTypes)) {
                $rec = $this->glAccountTypeGateway->find(
                    'glaccounttype_name = ?',
                    array($row['glaccounttype_name'])
                );
                $accountTypes[$row['glaccounttype_name']] = $rec[0]['glaccounttype_id'];
            }
            $row['glaccounttype_id'] = $accountTypes[$row['glaccounttype_name']];

            // If there's been no record with this category, we need to retrieve the ID for it
            if (!array_key_exists($row['category_name'], $categories)) {
                $rec = $this->glAccountGateway->getCategoryByName(
                    $row['category_name'],
                    $row['integration_package_id']
                );
                $categories[$row['category_name']] = $rec['tree_id'];
            }

            // Save the row
            $result = $this->save(
                array(
                    'glaccount'   => $row,
                    'tree_parent' => $categories[$row['category_name']]
                ),
                'account'
            );

            // Set errors
            if (!$result['success']) {
                $errorMsg = $this->localizationService->getMessage('importRecordSaveError') . " {$idx}";
                $errors[] = $errorMsg;
            }
        }

        $error = implode('<br />', $errors);
        return array(
            'success' => (count($errors)) ? false : true,
            'error'  => $error
        );
    }
}
