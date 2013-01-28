<?php

namespace NP\gl;

use NP\core\AbstractService;

class GLService extends AbstractService {
	
	protected $glaccountGateway;
	
	public function __construct(GLAccountGateway $glaccountGateway) {
		$this->glaccountGateway = $glaccountGateway;
	}
	
	public function getForInvoiceItemComboBox($vendorsite_id, $property_id, $glaccount_keyword='') {
		return $this->glaccountGateway->findForInvoiceItemComboBox($vendorsite_id, $property_id, $glaccount_keyword);
	}
	
}

?>