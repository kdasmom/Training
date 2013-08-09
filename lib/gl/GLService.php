<?php

namespace NP\gl;

use NP\core\AbstractService;
use NP\core\db\Where;

/**
 * All operations that are closely related to GL accounts belong in this service
 *
 * @author Thomas Messier
 */
class GLService extends AbstractService {
	
	/**
	 * @var \NP\gl\GLAccountGateway
	 */
	protected $glaccountGateway, $configService;
	
	/**
	 * @param \NP\gl\GLAccountGateway $glaccountGateway GLAccount gateway injected
	 */
	public function __construct(GLAccountGateway $glaccountGateway) {
		$this->glaccountGateway = $glaccountGateway;
	}

	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
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
}

?>