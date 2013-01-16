<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\system\PicklistGateway;

class PicklistService extends AbstractService {
	
	public function __construct(PicklistGateway $picklistGateway) {
		$this->picklistGateway = $picklistGateway;
	}
	
	public function find($picklist_table_display, $getActiveOnly=null, $invoicepayment_type_id=null) {
		return $this->picklistGateway->find($picklist_table_display, $getActiveOnly);
	}
}

?>