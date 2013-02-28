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
	 * Retrieves vendor records based on some criteria. This function is used by autocomplete combos
	 *
	 * @param  string $vendor_name           Complete or partial vendor name
	 * @param  int    $property_id           Property ID
	 * @return array                         Array of vendor records
	 */
	public function getForComboBox($vendor_name, $property_id) {
		return $this->vendorGateway->getForComboBox($vendor_name, $property_id);
	}
	
}

?>