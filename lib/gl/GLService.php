<?php

namespace NP\gl;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\system\BaseImportService;
use NP\system\TreeGateway;

/**
 * All operations that are closely related to GL accounts belong in this service
 *
 * @author Thomas Messier
 */
class GLService extends BaseImportService {
	
    /**
     * @var \NP\gl\GLAccountGateway
     */
    protected $glaccountGateway;

    protected $treeGateway;

    protected $GLAccountEntityValidator;
	
	/**
	 * @param \NP\gl\GLAccountGateway $glaccountGateway GLAccount gateway injected
	 */
	public function __construct(GLAccountGateway $glaccountGateway, TreeGateway $treeGateway, GLAccountEntityValidator $validator) {
            $this->glaccountGateway = $glaccountGateway;
            $this->treeGateway = $treeGateway;
            $this->GLAccountEntityValidator = $validator;
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
		return $this->glaccountGateway->findForInvoiceItemComboBox($vendorsite_id, $property_id, $glaccount_keyword);
	}
	
	/**
	 * Gets all GL accounts that belong to a specified integration package
	 *
	 * @param  int   $integration_package_id The integration package to get GL accounts for
	 * @return array                         Array of GL account records
	 */
	public function getByIntegrationPackage($integration_package_id) {
		return $this->glaccountGateway->findByIntegrationPackage($integration_package_id);
	}

    public function save(\ArrayObject $data, $entityClass)
    {
        // Get entities
        $accountNumber = $data['AccountNumber'];
        $accountName = $data['GLAccountName'];
        $categoryName = $data['CategoryName'];
        $accountTypeName = $data['AccountType'];
        $integrationPackageName = $data['IntegrationPackageName'];
        $glaccount_updateby = $data['glaccount_updateby'];
        $accountTypeId = $this->GLAccountEntityValidator->getAccountTypeIdByName($accountTypeName);
        $integrationPackageId = $this->GLAccountEntityValidator->getIntegrationPackageIdByName($integrationPackageName);
        $glAccountCategoryId = $this->GLAccountEntityValidator->getCategoryIdByName($categoryName, $integrationPackageId);
        $parentTreeId  = $this->treeGateway->getTreeIdForCategory($glAccountCategoryId);
        $treeOrder = $this->treeGateway->getTreeOrder($parentTreeId);
        $account = array(
            'glaccount_name' => $accountName,
            'glaccount_number' => $accountNumber,
            'glaccounttype_id' => $accountTypeId,
            'integration_package_id' => $integrationPackageId,
            'glaccount_updateby' => $glaccount_updateby
        );

        $exists = $oldGlAccountId = $this->GLAccountEntityValidator->glaccountExists($accountNumber, $integrationPackageId);
        if($exists) {
            $account['glaccount_id'] = $oldGlAccountId;
        }

        $glaccount     = new $entityClass($account);

        // Run validation
        $errors    = $this->validate($glaccount);

        // If the data is valid, save it
        if (count($errors) == 0) {
            // Begin transaction
            $this->glaccountGateway->beginTransaction();

            try {
                // Save the glaccount record
                $this->glaccountGateway->save($glaccount);
                $newGlAccountId = $glaccount->glaccount_id;
                $this->treeGateway->updateTree($oldGlAccountId, $newGlAccountId, $parentTreeId, $treeOrder, $exists);

            } catch(\Exception $e) {
                // Add a global error to the error array
                $errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e), 'extra'=>null);
            }
        }

        if (count($errors)) {
            $this->glaccountGateway->rollback();
        } else {
            $this->glaccountGateway->commit();
        }
    }
}
