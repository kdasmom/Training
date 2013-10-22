<?php

namespace NP\gl;

use NP\core\AbstractService;
use NP\core\db\Where;
use NP\system\TreeGateway;
use NP\system\IntegrationPackageGateway;
use NP\gl\GlAccountTypeGateway;
use NP\vendor\VendorGlAccountsGateway;
use NP\property\PropertyGlAccountGateway;
use NP\property\PropertyGateway;
use NP\vendor\VendorGateway;

/**
 * All operations that are closely related to GL accounts belong in this service
 *
 * @author Thomas Messier
 */
class GLService extends AbstractService {
    
    protected $securityService, $glAccountGateway, $treeGateway, $integrationPackageGateway,
            $vendorGlAccountsGateway, $propertyGlAccountGateway, $vendorGateway, $propertyGateway;

    public function __construct(GLAccountGateway $glAccountGateway, TreeGateway $treeGateway,
                                IntegrationPackageGateway $integrationPackageGateway,
                                GlAccountTypeGateway $glAccountTypeGateway,
                                VendorGlAccountsGateway $vendorGlAccountsGateway,
                                PropertyGlAccountGateway $propertyGlAccountGateway,
                                VendorGateway $vendorGateway,
                                PropertyGateway $propertyGateway) {
            $this->glAccountGateway          = $glAccountGateway;
            $this->treeGateway               = $treeGateway;
            $this->integrationPackageGateway = $integrationPackageGateway;
            $this->glAccountTypeGateway      = $glAccountTypeGateway;
            $this->vendorGlAccountsGateway   = $vendorGlAccountsGateway;
            $this->propertyGlAccountGateway  = $propertyGlAccountGateway;
            $this->vendorGateway             = $vendorGateway;
            $this->propertyGateway           = $propertyGateway;
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
        $res['vendors'] = $this->vendorGlAccountsGateway->find(
                                            array('vg.glaccount_id'=>'?'),
                                            array($id),
                                            'v.vendor_name',
                                            array('vendor_id')
                                        );
        $res['vendors'] = \NP\util\Util::valueList($res['vendors'], 'vendor_id');
        
        if ($this->configService->get('CP.PROPERTYGLACCOUNT_USE', 0) && $this->securityService->hasPermission(12)) {
            $res['properties'] = $this->propertyGlAccountGateway->find(
                                                                                    array('pg.glaccount_id'=>'?'),
                                                                                    array($id),
                                                                                    'p.property_name',
                                                                                    array('property_id')
                                                                            );
            $res['properties'] = \NP\util\Util::valueList($res['properties'], 'property_id');
        }
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
            'errors'  => $errors,
            'glaccount_id' => $glaccount->glaccount_id
        );
    }
        
    /**
     * save GL Account
     *
     * @param $data
     * @return array
     */
    public function saveGlAccount($data) {
        $errors  = array();
        $data['glaccount']['integration_package_id'] = ($data['glaccount']['integration_package_id'] == null) ? 1 : $data['glaccount']['integration_package_id']; 
        $data['glaccount']['glaccount_updatetm'] = \NP\util\Util::formatDateForDB();
        $rec = $this->glAccountGateway->getCategoryByName(
                  $data['glaccount_category'],
                  $data['glaccount']['integration_package_id']
              );
        $tree_id = $rec['tree_id'];

        
        $result = $this->save(
            array(
                'glaccount'   => $data['glaccount'],
                'tree_parent' => $tree_id
            ),
            'account'
        );

        // Set errors
        if (!$result['success']) {
            $errors = $result['errors'];
        }
        // If no errors, save vendors
        if (!count($errors)) {
                $success = $this->saveVendorAssignment($result['glaccount_id'], $data['vendors']);
                if (!$success) {
                        $errors[] = array(
                                        'field' => 'vendors',
                                        'msg'   => $this->localizationService->getMessage('vendorAssignmentError')
                                );
                }
        }
        // Save GL assignments if any
        if (array_key_exists('properties', $data) && is_array($data['properties'])) {
                $success = $this->savePropertyAssignment($result['glaccount_id'], $data['properties']);
                if (!$success) {
                        $errors[] = array(
                                        'field' => 'properties',
                                        'msg'   => $this->localizationService->getMessage('propertyAssignmentError')
                                );
                }
        }
        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors,
            'id'      => $result['glaccount_id']
        );
           
    }
    
    /**
     * save GL Category
     *
     * @param $data
     * @return array
     */
    public function saveGlCategory($data) {
        $errors  = array();
         
        $data['glaccount_updatetm'] = \NP\util\Util::formatDateForDB();
            
        if ($data['glaccount_id'] == null){
            $data['glaccount_number'] = $data['glaccount_name'];
            $data['glaccount_order'] = $this->glAccountGateway->getMaxOrder($data['glaccount_id']);
            $result = $this->save(
                array(
                    'glaccount'   => $data,
                    'tree_parent' => 0
                ),
                'category'
            );
        } else {
            $result = $this->glAccountGateway->update($data, 'glaccount_id = ?', array($data['glaccount_id']));
        }

        // Set errors
        if (!$result['success']) {
            $errors = $result['errors'];
        }
        
        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
           
    }
    /**
     * save order Category
     *
     * @param $data
     * @return array
     */
    public function saveOrderCategory($glaccount_id_list) {
        $errors  = array();
        $order = 1;
        foreach ($glaccount_id_list as $glaccount_id) {
            $glaccount['glaccount_order'] = $order++;
            
            $result = $this->glAccountGateway->update($glaccount, 'glaccount_id = ?', array($glaccount_id));
             
            if (!$result['success']) {
                $errorMsg = $this->localizationService->getMessage('orderCategoryError') . " {$glaccount_id}";
                $errors[] = $errorMsg;
            }
        }
        
        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
           
    }
    
    /**
    * Saves property assignments for a glaccount
    *
    * @param  int   $glaccount_id The ID for the glaccount we want to assign properties to
    * @param  array $property_id_list
    * @return boolean
    */
   public function savePropertyAssignment($glaccount_id, $property_id_list) {
           // Start a DB transaction
        $this->propertyGlAccountGateway->beginTransaction();

        $success = true;
        try {
                // Remove all property associations for this user
                $this->propertyGlAccountGateway->delete('glaccount_id = ?', array($glaccount_id));

                // Insert new property associations for this user
                foreach ($property_id_list as $property_id) {
                        $this->propertyGlAccountGateway->insert(array(
                                'glaccount_id' => $glaccount_id,
                                'property_id'  => $property_id
                        ));
                }

                // Commit the data
                $this->propertyGlAccountGateway->commit();
        } catch(\Exception $e) {
                // If there was an error, rollback the transaction
                $this->propertyGlAccountGateway->rollback();
                // Change success to indicate failure
                $success = false;
        }

        return $success;
   }
   
   /**
    * Saves vendor assignments for a glaccount
    *
    * @param  int   $glaccount_id The ID for the glaccount we want to assign vendors to
    * @param  array $vendor_id_list
    * @return boolean
    */
   public function saveVendorAssignment($glaccount_id, $vendor_id_list) {
           // Start a DB transaction
        $this->vendorGlAccountsGateway->beginTransaction();

        $success = true;
        try {
                // Remove all property associations for this user
                $this->vendorGlAccountsGateway->delete('glaccount_id = ?', array($glaccount_id));

                // Insert new property associations for this user
                foreach ($vendor_id_list as $vendor_id) {
                        $this->vendorGlAccountsGateway->insert(array(
                                'vendor_id'  => $vendor_id,
                                'glaccount_id' => $glaccount_id
                        ));
                }

                // Commit the data
                $this->vendorGlAccountsGateway->commit();
        } catch(\Exception $e) {
                // If there was an error, rollback the transaction
                $this->vendorGlAccountsGateway->rollback();
                // Change success to indicate failure
                $success = false;
        }

        return $success;
   }
   
   /**
    * Distribute To All Vendors for a glaccount_id_list
    *
    * @param  array $glaccount_id_list
    * @return boolean
    */
   public function distributeToAllVendors($glaccount_id_list) {
       $vendor_id_list = $this->vendorGateway->find(
                    null,
                    array(),
                    "vendor_id",
                    array('vendor_id')
               );
       $vendor_id_list = \NP\util\Util::valueList($vendor_id_list, 'vendor_id');
           
       foreach ($glaccount_id_list as $glaccount_id) {
            // Start a DB transaction
            $this->vendorGlAccountsGateway->beginTransaction();

            $success = true;
            try {
                    // Remove all property associations for this user
                    $this->vendorGlAccountsGateway->delete('glaccount_id = ?', array($glaccount_id));

                    // Insert new property associations for this user
                    foreach ($vendor_id_list as $vendor_id) {
                            $this->vendorGlAccountsGateway->insert(array(
                                    'vendor_id'  => $vendor_id,
                                    'glaccount_id' => $glaccount_id
                            ));
                    }

                    // Commit the data
                    $this->vendorGlAccountsGateway->commit();
            } catch(\Exception $e) {
                    // If there was an error, rollback the transaction
                    $this->vendorGlAccountsGateway->rollback();
                    // Change success to indicate failure
                    $success = false;
            }

            return $success;
       }
   }
   
   /**
    * Distribute To All Properties for a glaccount_id_list
    *
    * @param  array $glaccount_id_list
    * @return boolean
    */
   public function distributeToAllProperties($glaccount_id_list) {
       $propery_id_list = $this->propertyGateway->find(
                    null,
                    array(),
                    "property_id",
                    array('property_id')
        );
       $propery_id_list = \NP\util\Util::valueList($propery_id_list, 'property_id');
       
       foreach ($glaccount_id_list as $glaccount_id) {
            // Start a DB transaction
            $this->propertyGlAccountGateway->beginTransaction();

            $success = true;
            try {
                    // Remove all property associations for this user
                    $this->propertyGlAccountGateway->delete('glaccount_id = ?', array($glaccount_id));

                    // Insert new property associations for this user
                    foreach ($propery_id_list as $propery_id) {
                            $this->propertyGlAccountGateway->insert(array(
                                    'property_id'  => $propery_id,
                                    'glaccount_id' => $glaccount_id
                            ));
                    }

                    // Commit the data
                    $this->propertyGlAccountGateway->commit();
            } catch(\Exception $e) {
                    // If there was an error, rollback the transaction
                    $this->propertyGlAccountGateway->rollback();
                    // Change success to indicate failure
                    $success = false;
            }

            return $success;
       }
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
