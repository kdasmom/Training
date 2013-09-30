<?php

namespace NP\gl;

use NP\core\AbstractService;
use NP\core\db\Where;
use NP\vendor\VendorGlAccountsGateway;
use NP\core\validation\EntityValidator;

/**
 * All operations that are closely related to GL accounts belong in this service
 *
 * @author Thomas Messier
 */
class GLService extends AbstractService {
	
	/**
	 * @var \NP\gl\GLAccountGateway
	 */
	protected $glaccountGateway, $configService, $vendorGlAccountsGateway, $glaccountTypeGateway;
	
	/**
	 * @param \NP\gl\GLAccountGateway $glaccountGateway GLAccount gateway injected
	 */
	public function __construct(GLAccountGateway $glaccountGateway, VendorGlAccountsGateway $vendorGlAccountsGateway, GlAccountTypeGateway $glaccountTypeGateway) {
		$this->glaccountGateway = $glaccountGateway;
                $this->vendorGlAccountsGateway = $vendorGlAccountsGateway;
                $this->glaccountTypeGateway = $glaccountTypeGateway;
	}

	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}
	
        /**
	 * Returns all Category in the system
	 */
	public function getCategories() {
            return $this->glaccountGateway->find(
			'glaccount_order is not null',
			array(),
			'glaccount_number',
			array('glaccount_id','glaccount_number')
		);
	}
        
	/**
	 * Returns all GL Accounts in the system
	 */
	public function getAll() {
		$order = ($this->configService->get('PN.Budget.GLDisplayOrder') == 'Name') ? 'glaccount_name' : 'glaccount_number';

		return $this->glaccountGateway->find(
			null,
			array(),
			$order,
			array('glaccount_id','glaccount_number','glaccount_name')
		);
	}
        
        /**
	 * Retrieves all GL Accounts for grid GL Account Setup
	 *
	 * @return array
	 */
	public function getAllGLAccounts($glaccount_status='active', $pageSize=null, $page=null, $sort="glaccount_name") {
            $joins = array(
			new sql\join\GLAccountTypeJoin()
                );
              return $this->glaccountGateway->find(
			new sql\criteria\GlAccountStatusCriteria(),	// filter
			array($glaccount_status),			// params
			$sort,								// order by
			null,								// columns
			$pageSize,
			$page,
			$joins
		);
                
        }
        
        /**
	 * Retrieves all GL Accounts for grid GL Account Setup
	 *
	 * @return array
	 */
	public function getTypes() {
		return $this->glaccountTypeGateway->find(null, array(), "glaccounttype_name",  array('glaccounttype_id','glaccounttype_name'));
	}
        
        /**
	 * Retrieves all GL Accounts for grid GL Account Setup
	 *
	 * @return array
	 */
	public function getGLAccount($id) {
		$res = $this->glaccountGateway->findById($id);
		
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
		return $this->glaccountGateway->findForInvoiceItemComboBox($vendorsite_id, $property_id, $glaccount_keyword);
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

		return $this->glaccountGateway->find(
			Where::buildCriteria($wheres),
			$params,
			$this->glaccountGateway->getDefaultSortOrder(),
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

		return $this->glaccountGateway->find(
			Where::buildCriteria($wheres),
			$params,
			$this->glaccountGateway->getDefaultSortOrder(),
			array('glaccount_id','glaccount_number','glaccount_name')
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
            $this->glaccountGateway->beginTransaction();

            try {
                $this->glaccountGateway->save($glaccount);
                $this->glaccountGateway->commit();
            } catch(\Exception $e) {
                // If there was an error, rollback the transaction
                $this->glaccountGateway->rollback();
                // Add a global error to the error array
                $errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
            }
        }


        return array(
            'success'    => (count($errors)) ? false : true,
            'errors'     => $errors,
        );
    }
}

?>