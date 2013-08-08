<?php

namespace NP\gl;

use NP\core\validation\EntityValidator;
use NP\core\db\Insert;
use NP\core\Config;
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
}
