<?php

namespace NP\gl;

use NP\core\validation\EntityValidator;
use NP\core\db\Insert;
use NP\security\SecurityService;
use NP\system\ImportService;
use NP\system\TreeGateway;

/**
 * All operations that are closely related to GL accounts belong in this service
 *
 * @author Thomas Messier
 */
class GLService extends ImportService {
	
	/**
	 * @var \NP\gl\GLAccountGateway
	 */
	protected $glaccountGateway;

    /**
     * @var TreeGateway
     */
    protected $treeGateway;

	/**
	 * @param GLAccountGateway $glaccountGateway GLAccount gateway injected
     * @param TreeGateway $treeGateway
	 */
	public function __construct(GLAccountGateway $glaccountGateway, TreeGateway $treeGateway) {
		$this->glaccountGateway = $glaccountGateway;
        $this->treeGateway = $treeGateway;
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

    protected function validate(&$data)
    {
        foreach ($data as $key => $rowFromCSVFile) {
            // Get entities
            $glaccount     = new GLAccountEntity($rowFromCSVFile);

            // Run validation
            $validator = new EntityValidator();
            $validator->validate($glaccount);
            $errors    = $validator->getErrors();

            // Get Id for field glaccounttype_id, integrationPackageId, glaccount_level
            $glaccounttype_id = $this->glaccountGateway->getAccountTypeIdByName($rowFromCSVFile['account_type_name']);
            $integrationPackageId = $this->glaccountGateway->getIntegrationPackageIdByName($rowFromCSVFile['integration_package_name']);
            $glaccount_level = $this->glaccountGateway->getCategoryIdByName($rowFromCSVFile['category_name'], $integrationPackageId);

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
                $data[$key]['validation_status'] = '<span style="color:red;"><img src="resources/images/buttons/inactivate.gif" /></span>';
                $data[$key]['validation_messages'] = join(', ', $errorStrings);
            } else {
                $data[$key]['validation_status'] = '<span style="color:green;"><img src="resources/images/buttons/activate.gif" /></span>';
                $data[$key]['validation_messages'] = '';
            }
        }
    }



}
