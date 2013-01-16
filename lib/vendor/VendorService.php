<?php

namespace NP\vendor;

use NP\core\AbstractService;

class VendorService extends AbstractService {
	
	protected $vendorGateway;
	
	public function __construct(VendorGateway $vendorGateway) {
		$this->vendorGateway = $vendorGateway;
	}
	
	public function getForComboBox($vendor_name, $property_id) {
		return $this->vendorGateway->getForComboBox($vendor_name, $property_id);
	}
	
}

?>