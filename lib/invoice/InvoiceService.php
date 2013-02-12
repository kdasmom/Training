<?php

namespace NP\invoice;

use NP\core\AbstractService;
use NP\system\SecurityService;

/**
 * Service class for operations related to Invoices
 *
 * @author Thomas Messier
 */
class InvoiceService extends AbstractService {
	/**
	 * @var NP\system\SecurityService
	 */
	protected $securityService;
	
	/**
	 * @var NP\invoice\InvoiceGateway
	 */
	protected $invoiceGateway;
	
	/**
	 * @var NP\invoice\InvoiceItemGateway
	 */
	protected $invoiceItemGateway;
	
	/**
	 * @var NP\invoice\InvoiceValidator
	 */
	protected $invoiceValidator;
	
	/**
	 * @param NP\system\SecurityService     $securityService    SecurityService object injected by Zend Di
	 * @param NP\invoice\InvoiceGateway     $invoiceGateway     InvoiceGateway object injected by Zend Di
	 * @param NP\invoice\InvoiceItemGateway $invoiceItemGateway InvoiceItemGateway object injected by Zend Di
	 * @param NP\invoice\InvoiceValidator   $invoiceValidator   InvoiceValidator object injected by Zend Di
	 */
	public function __construct(SecurityService $securityService, InvoiceGateway $invoiceGateway, 
								InvoiceItemGateway $invoiceItemGateway, InvoiceValidator $invoiceValidator) {
		$this->securityService = $securityService;
		$this->invoiceGateway = $invoiceGateway;
		$this->invoiceItemGateway = $invoiceItemGateway;
		$this->invoiceValidator = $invoiceValidator;
	}
	
	/**
	 * Retrieves a record for the specified invoice ID
	 *
	 * @param  int   $invoice_id ID of the invoice to be retrieved
	 * @return array
	 */
	public function get($invoice_id) {
		return $this->invoiceGateway->findById($invoice_id);
	}
	
	/**
	 * Saves an invoice entity
	 *
	 * @param  NP\invoice\Invoice $entity The entity to save
	 * @return array                      Errors that occurred while attempting to save the entity
	 */
	public function save(Invoice $entity) {
		// Validate the entity
		$result = $this->invoiceValidator->validate($entity);
		// If the entity is valid, save it
		if ($result->isValid()) {
			// Save the invoice entity
			$this->invoiceGateway->save($entity->toArray());

			// Loop through each line in the invoice and save them
			$lines = $entity->lines();
			foreach($lines as $line) {
				$this->invoiceItemGateway->save($line->toArray());
			}
		}

		return $result->getErrors();
	}
	
	/**
	 * Get all invoice line items for an invoice
	 *
	 * @param  int $invoice_id
	 * @return array
	 */
	public function getInvoiceLines($invoice_id) {
		return $this->invoiceItemGateway->getByInvoice($invoice_id);
	}
	
	/**
	 * Get purchase orders associated to an invoice, if any
	 *
	 * @param  int $invoice_id
	 * @return array           An array filled with associative arrays with purchaseorder_id and purchaseorder_ref keys
	 */
	public function getAssociatedPOs($invoice_id) {
		return $this->invoiceGateway->findAssociatedPOs($invoice_id);
	}
	
	/**
	 * Get forwards associated to an invoice, if any
	 *
	 * @param  int $invoice_id
	 * @return array           Array with forward records in a specific format
	 */
	public function getForwards($invoice_id) {
		return $this->invoiceGateway->findForwards($invoice_id);
	}
	
	/**
	 * Find open invoices for the current user given a certain context filter
	 *
	 * @param  string $contextFilterType      The context filter type; valid values are 'property','region', and 'all'
	 * @param  int    $contextFilterSelection The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int    $pageSize               The number of records per page; if null, all records are returned
	 * @param  int    $page                   The page for which to return records
	 * @param  string $sort                   Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                          Array of invoice records
	 */
	public function findOpenInvoices($contextFilterType, $contextFilterSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$userprofile_id = $this->securityService->getUserId();
		$delegated_to_userprofile_id = $this->securityService->getDelegatedUserId();
		
		return $this->invoiceGateway->findOpenInvoices($userprofile_id, $delegated_to_userprofile_id, $contextFilterType, $contextFilterSelection, $pageSize, $page, $sort);
	}
	
	/**
	 * Find rejected invoices for the current user given a certain context filter
	 *
	 * @param  string $contextFilterType      The context filter type; valid values are 'property','region', and 'all'
	 * @param  int    $contextFilterSelection The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int    $pageSize               The number of records per page; if null, all records are returned
	 * @param  int    $page                   The page for which to return records
	 * @param  string $sort                   Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                          Array with invoice records
	 */
	public function findRejectedInvoices($contextFilterType, $contextFilterSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$userprofile_id = $this->securityService->getUserId();
		$delegated_to_userprofile_id = $this->securityService->getDelegatedUserId();
		
		return $this->invoiceGateway->findRejectedInvoices($userprofile_id, $delegated_to_userprofile_id, $contextFilterType, $contextFilterSelection, $pageSize, $page, $sort);
	}
	
}

?>