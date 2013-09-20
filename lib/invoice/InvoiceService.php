<?php

namespace NP\invoice;

use NP\core\AbstractService;
use NP\security\SecurityService;
use NP\budget\BudgetService;
use NP\shared\InvoicePoForwardGateway;
use NP\property\FiscalCalService;
use NP\jobcosting\JbContractGateway;
use NP\jobcosting\JbJobCodeGateway;
use NP\image\ImageIndexGateway;
use NP\po\PurchaseorderGateway;

/**
 * Service class for operations related to Invoices
 *
 * @author Thomas Messier
 */
class InvoiceService extends AbstractService {
	
	protected $configService, $securityService, $invoiceGateway, $invoiceItemGateway, $budgetService, 
			  $jbContractGateway, $jbJobCodeGateway, $imageIndexGateway;
	
	public function __construct(SecurityService $securityService, FiscalCalService $fiscalCalService,
								BudgetService $budgetService, InvoiceGateway $invoiceGateway,
								InvoiceItemGateway $invoiceItemGateway, InvoicePoForwardGateway $invoicePoForwardGateway,
								JbContractGateway $jbContractGateway, JbJobCodeGateway $jbJobCodeGateway,
								ImageIndexGateway $imageIndexGateway, PurchaseorderGateway $purchaseorderGateway) {
		$this->securityService         = $securityService;
		$this->fiscalCalService        = $fiscalCalService;
		$this->budgetService           = $budgetService;
		$this->invoiceGateway          = $invoiceGateway;
		$this->invoiceItemGateway      = $invoiceItemGateway;
		$this->invoicePoForwardGateway = $invoicePoForwardGateway;
		$this->jbContractGateway       = $jbContractGateway;
		$this->jbJobCodeGateway        = $jbJobCodeGateway;
		$this->imageIndexGateway       = $imageIndexGateway;
		$this->purchaseorderGateway    = $purchaseorderGateway;
	}
	
	/**
	 * Setter function required by DI to set the config service via setter injection
	 * @param \NP\system\ConfigService $configService
	 */
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}
	
	/**
	 * Retrieves a record for the specified invoice ID
	 *
	 * @param  int   $invoice_id ID of the invoice to be retrieved
	 * @return array
	 */
	public function get($invoice_id) {
		$invoice = $this->invoiceGateway->findById($invoice_id);
		$invoice['associated_pos']  = $this->getAssociatedPOs($invoice_id);
		$invoice['accounting_period'] = $this->fiscalCalService->getAccountingPeriod($invoice['property_id'])->format('Y-m-d');

		if ($this->configService->get('pn.jobcosting.jobcostingEnabled', '0') == '1') {
			$invoice['inactive_contracts'] = $this->jbContractGateway->findInactiveContractInEntity('invoice', $invoice_id);
			$invoice['inactive_jobs']      = $this->jbJobCodeGateway->findInactiveJobInEntity('invoice', $invoice_id);
		} else {
			$invoice['inactive_contracts'] = array();
			$invoice['inactive_jobs'] = array();
		}

		// If invoice is for approval, let's check if the current user is an approver
		if ($invoice['invoice_status'] == 'forapproval') {
			$invoice['is_approver'] = $this->invoiceGateway->isApprover(
				$invoice_id,
				$this->securityService->getUserId()
			);
		} else {
			$invoice['is_approver'] = false;
		}

		// Get invoice images
		$invoice['images'] = $this->imageIndexGateway->findEntityImages($invoice_id, 'Invoice');

		// Get linkable POs
		$invoice['has_linkable_pos'] = (count($this->getLinkablePOs($invoice_id))) ? true : false;

		return $invoice;
	}

	/**
	 * Saves an invoice entity; invoices should always be saved through this method
	 *
	 * @param  array $dataSet An associative array with the data to save; line items should be in a "lines" key
	 * @return array          Errors that occurred while attempting to save the entity
	 */
	public function save($dataSet) {
		// Create an invoice entity
		$invoiceEntity = new InvoiceEntity($dataSet);

		// Get invoice validator
		$invoiceValidator = new validation\InvoiceValidator();

		// If the data is valid, save it
		if ($invoiceValidator->validate($invoiceEntity)) {
			// Begin transaction
			$connection = $this->invoiceGateway->getAdapter()->driver->getConnection()->beginTransaction();

			try {
				// Save the invoice entity
				$id = $this->invoiceGateway->save($invoiceEntity);

				// Loop through each line in the invoice and save them
				foreach($dataSet['lines'] as $line) {
					$line['invoice_id'] = $id;
					$this->invoiceItemGateway->save($line);
				}

				$connection->commit();
			} catch(\Exception $e) {
				$connection->rollback();
				$invoiceValidator->addError('global', 'Unexpected database error');
			}
		}

		$errors = $invoiceValidator->getErrors();
		return array(
			'success'    => (count($errors)) ? false : true,
			'invoice_id' => $id,
			'errors'     => $errors,
		);
	}
	
	/**
	 * Get all invoice line items for an invoice
	 *
	 * @param  int $invoice_id
	 * @return array
	 */
	public function getInvoiceLines($invoice_id) {
		return $this->invoiceItemGateway->findInvoiceLines($invoice_id);
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
		return $this->invoicePoForwardGateway->findByEntity('invoice', $invoice_id);
	}
	
	/**
	 * Retrieve invoices for the different invoice registers
	 *
	 * @param  string $tab                         The register tab to get
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int    $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int    $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int    $page                        The page for which to return records
	 * @param  string $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                               Array of invoice records
	 */
	public function getInvoiceRegister($tab, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$method = 'find'.ucfirst($tab).'Invoices';

		return $this->invoiceGateway->$method($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get list of invoices to approve
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $userprofile_id              The active user ID, can be a delegated account
	 * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of invoice records
	 */
	public function getInvoicesToApprove($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->invoiceGateway->findInvoicesToApprove($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get list of invoices on hold
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $userprofile_id              The active user ID, can be a delegated account
	 * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of invoice records
	 */
	public function getInvoicesOnHold($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->invoiceGateway->findInvoicesOnHold($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get list of completed invoices
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $userprofile_id              The active user ID, can be a delegated account
	 * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of invoice records
	 */
	public function getInvoicesCompleted($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->invoiceGateway->findInvoicesCompleted($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get list of rejected invoices
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $userprofile_id              The active user ID, can be a delegated account
	 * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of invoice records
	 */
	public function getInvoicesRejected($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->invoiceGateway->findInvoicesRejected($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get list of invoices created by a specific user
	 *
	 * @param  boolean $countOnly                   Whether we want to retrieve only the number of records or all the data
	 * @param  int     $userprofile_id              The active user ID, can be a delegated account
	 * @param  int     $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string  $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int     $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int     $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int     $page                        The page for which to return records
	 * @param  string  $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                                Array of invoice records
	 */
	public function getInvoicesByUser($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->invoiceGateway->findInvoicesByUser($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Return a list of POs that could be linked to an invoice for the user currently logged in
	 *
	 * @param  int $invoice_id Invoice to get linkable POs for
	 * @return array           List of linkable POs
	 */
	public function getLinkablePOs($invoice_id) {
		return $this->purchaseorderGateway->findPosLinkableToInvoice($invoice_id);
	}

	public function rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod) {
		$this->invoiceGateway->beginTransaction();

		try {
			// Roll invoice Lines
			$this->invoiceItemGateway->rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod);
			
			// Roll invoices
			$this->invoiceGateway->rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod);

			// Create new budgets if needed
			$this->budgetService->createMissingBudgets('invoice');

			// If dealing with a new year, update the GLACCOUNTYEAR records
			if ($newAccountingPeriod->format('Y') != $oldAccountingPeriod->format('Y')) {
				$this->budgetService->activateGlAccountYear($newAccountingPeriod->format('Y'));
			}
			
			$this->invoiceGateway->commit();
		} catch(\Exception $e) {
			$this->invoiceGateway->rollback();
		}
	}
	
}

?>