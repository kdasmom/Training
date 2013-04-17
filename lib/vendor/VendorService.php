<?php

namespace NP\vendor;

use NP\core\AbstractService;

/**
 * Service class for operations related to vendors
 *
 * @author Thomas Messier
 */
class VendorService extends AbstractService {
	
	/**
	 * @var NP\vendor\VendorGateway
	 */
	protected $vendorGateway;
	
	/**
	 * @param NP\vendor\VendorGateway $vendorGateway VendorGateway object injected
	 */
	public function __construct(VendorGateway $vendorGateway) {
		$this->vendorGateway = $vendorGateway;
	}
	
	/**
	 * Retrieves vendor records for the vendor autocomplete when creating catalogs
	 *
	 * @param  string $keyword Keyword to use to search for a vendor
	 * @return array           Array of vendor records
	 */
	public function getForCatalogDropDown($keyword) {
		return $this->vendorGateway->getForCatalogDropDown($keyword);
	}
	
}

?>