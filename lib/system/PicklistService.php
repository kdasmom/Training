<?php

namespace NP\system;

use NP\core\AbstractService;

/**
 * Service class for operations related to pick lists
 *
 * @author Thomas Messier
 */
class PicklistService extends AbstractService {
	/**
	 * @var NP\system\PicklistGateway
	 */
	protected $picklistGateway;

	/**
	 * @param NP\system\PicklistGateway $picklistGateway PicklistGateway object injected
	 */
	public function __construct(PicklistGateway $picklistGateway) {
		$this->picklistGateway = $picklistGateway;
	}
	
	/**
	 * Retrieves pick list data for various pick list types
	 *
	 * @param  string  $picklist_table_display 
	 * @param  boolean $getActiveOnly          Whether to get only active records or all records (optional); defaults to false
	 * @param  int     $invoicepayment_type_id 
	 * @return array   An array of records
	 */
	public function find($picklist_table_display, $getActiveOnly=false, $invoicepayment_type_id=null) {
		return $this->picklistGateway->find($picklist_table_display, $getActiveOnly);
	}
}

?>