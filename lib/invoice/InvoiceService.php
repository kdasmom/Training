<?php

namespace NP\invoice;

use NP\core\AbstractService;
use NP\security\SecurityService;
use NP\budget\BudgetService;

/**
 * Service class for operations related to Invoices
 *
 * @author Thomas Messier
 */
class InvoiceService extends AbstractService {
	
	protected $securityService, $invoiceGateway, $invoiceItemGateway, $budgetService;
	
	/**
	 * @param \NP\security\SecurityService   $securityService    SecurityService object injected
	 * @param \NP\invoice\InvoiceGateway     $invoiceGateway     InvoiceGateway object injected
	 * @param \NP\invoice\InvoiceItemGateway $invoiceItemGateway InvoiceItemGateway object injected
	 */
	public function __construct(SecurityService $securityService, InvoiceGateway $invoiceGateway, 
								InvoiceItemGateway $invoiceItemGateway, BudgetService $budgetService) {
		$this->securityService    = $securityService;
		$this->invoiceGateway     = $invoiceGateway;
		$this->invoiceItemGateway = $invoiceItemGateway;
		$this->budgetService      = $budgetService;
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

	/**
	 * Save an invoice payment from the import tool
	 */
	public function saveInvoicePaymentFromImport($data) {
		 $intPkg = $this->integrationPackageGateway->find(
            'integration_package_name = ?',
            array($data[0]['integration_package_name'])
        );
        $integration_package_id = $intPkg[0]['integration_package_id'];
        
        try {
            $sessionKey = $this->soapService->login();

            $soapSettings = $this->soapService->getSettings();

            $headerXml = "<SecurityHeader xmlns=\"http://tempuri.org/\">
                            <SessionKey>{$sessionKey}</SessionKey>
                            <ClientName>{$soapSettings['wsdl_client']}</ClientName>
                            <UserName>{$soapSettings['wsdl_user']}</UserName>
                        </SecurityHeader>";

            $xml = "<PN_SET_INVOICEPAYMENTS xmlns=\"http://tempuri.org/\">
                        <invoicepayment>
                            <INVOICEPAYMENTS xmlns=''>";

            foreach ($data as $row) {
            	$invoice_datetm = \DateTime::createFromFormat('m/d/Y', $row['invoice_datetm']);
                $invoice_datetm = $invoice_datetm->format('Y-m-d');
                $invoicepayment_datetm = \DateTime::createFromFormat('m/d/Y', $row['invoicepayment_datetm']);
                $invoicepayment_datetm = $invoicepayment_datetm->format('Y-m-d');

                $xml .=         "<INVOICEPAYMENT>
		                            <Business_unit>{$row['property_id_alt']}</Business_unit>
		                            <Invoice_Id_Alt>{$row['invoice_ref']}{$row['vendor_id_alt']}</Invoice_Id_Alt>
		                            <VendorSite_Id_Alt>{$row['vendor_id_alt']}</VendorSite_Id_Alt>
		                            <invoice_ref>{$row['invoice_ref']}</invoice_ref>
		                            <Invoice_Date>{$invoice_datetm}</Invoice_Date>
		                            <Invoice_Period>{$row['invoice_period']}</Invoice_Period>
		                            <Invoice_Id>0</Invoice_Id>
		                            <Invoice_Payment_Id_alt>{$row['invoicepayment_id_alt']}</Invoice_Payment_Id_alt>
		                            <Invoice_Payment_Number>0</Invoice_Payment_Number>
		                            <Invoice_Payment_Datetm>{$invoicepayment_datetm}</Invoice_Payment_Datetm>
		                            <Invoice_Payment_CheckNum>{$row['invoicepayment_checknum']}</Invoice_Payment_CheckNum>
		                            <Invoice_Payment_Amount>{$row['invoicepayment_amount']}</Invoice_Payment_Amount>
		                            <Invoice_Payment_Status>".strtolower($row['invoicepayment_status'])."</Invoice_Payment_Status>
		                        </INVOICEPAYMENT>";
            }

            $xml .=         "</INVOICEPAYMENTS>
                        </invoicepayment>
                        <integration_id>{$integration_package_id}</integration_id>
                    </PN_SET_INVOICEPAYMENTS>";

            $res = $this->soapService->request(
                $soapSettings['wsdl_url'],
                $xml,
                $headerXml
            );

            $statusCode = (string)$res['soapResult']->PN_SET_INVOICEPAYMENTS->Status->StatusCode;

            $error = null;
            if ($statusCode === 'SUCCESS') {
                $success = true;
            } else {
                throw new \NP\core\Exception('The SOAP request for saving invoice payments failed.');
            }
        } catch(\Exception $e) {
            $success = false;
            $error   = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
        }

        return array(
            'success' => $success,
            'error'   => $error
        );
	}
	
}

?>