<?php

namespace NP\invoice;

use NP\core\AbstractService;
use NP\system\SecurityService;
//use \NP\db\gateways\InvoiceItemGateway;

class InvoiceService extends AbstractService {
	
	protected $securityService, $invoiceGateway, $invoiceItemGateway;
	
	public function __construct(SecurityService $securityService, InvoiceGateway $invoiceGateway, InvoiceItemGateway $invoiceItemGateway) {
		$this->securityService = $securityService;
		$this->invoiceGateway = $invoiceGateway;
		$this->invoiceItemGateway = $invoiceItemGateway;
	}
	
	public function get($invoice_id) {
		return $this->invoiceGateway->findById($invoice_id);
	}
	
	public function getInvoiceLines($invoice_id) {
		return $this->invoiceItemGateway->getByInvoice($invoice_id);
	}
	
	public function getAssociatedPOs($invoice_id) {
		return $this->invoiceGateway->findAssociatedPOs($invoice_id);
	}
	
	public function getForwards($invoice_id) {
		return $this->invoiceGateway->findForwards($invoice_id);
	}
	
	public function findOpenInvoices($propertyFilterType, $propertyFilterSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$userprofile_id = $this->securityService->getUserId();
		$delegated_to_userprofile_id = $this->securityService->getDelegatedUserId();
		
		return $this->invoiceGateway->findOpenInvoices($userprofile_id, $delegated_to_userprofile_id, $propertyFilterType, $propertyFilterSelection, $pageSize, $page, $sort);
	}
	
	public function findRejectedInvoices($propertyFilterType, $propertyFilterSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$userprofile_id = $this->securityService->getUserId();
		$delegated_to_userprofile_id = $this->securityService->getDelegatedUserId();
		
		return $this->invoiceGateway->findRejectedInvoices($userprofile_id, $delegated_to_userprofile_id, $propertyFilterType, $propertyFilterSelection, $pageSize, $page, $sort);
	}
	
}

?>