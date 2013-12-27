<?php

namespace NP\invoice;

use NP\shared\AbstractInvoicePoService;
use NP\security\SecurityService;
use NP\budget\BudgetService;
use NP\property\FiscalCalService;

/**
 * Service class for operations related to Invoices
 *
 * @author Thomas Messier
 */
class InvoiceService extends AbstractInvoicePoService {
	
	protected $type = 'invoice';

	protected $securityService, $fiscalCalService, $budgetService;
	
	public function __construct(SecurityService $securityService, FiscalCalService $fiscalCalService,
								BudgetService $budgetService) {
		parent::__construct();

		$this->securityService           = $securityService;
		$this->fiscalCalService          = $fiscalCalService;
		$this->budgetService             = $budgetService;
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
			$invoice['has_optional_rule'] = $this->wfRuleGateway->hasOptionalRule(
				$invoice['property_id'],
				$this->securityService->getUserId()
			);
		} else {
			$invoice['is_approver'] = false;
		}

		// Get invoice images
		$invoice['images'] = $this->imageIndexGateway->findEntityImages($invoice_id, 'Invoice', true);

		// Get linkable POs
		$invoice['has_linkable_pos'] = (count($this->getLinkablePOs($invoice_id))) ? true : false;

		// Check if there are any schedules if invoice is a draft
		if ($invoice['invoice_status'] == 'draft') {
			$res = $this->recurringSchedulerGateway->find([
				'table_name'      => "'invoice'",
				'tablekey_id'     => '?',
				'schedule_status' => "'active'"
			], [$invoice_id]);

			$invoice['schedule_exists'] = (count($res)) ? true : false;
		}

		if (
			$invoice['invoice_status'] == 'saved' 
			&& $this->configService->get('PN.InvoiceOptions.SkipSave', '0') === '0'
		) {
			$invoice['has_dummy_accounts'] = $this->invoiceGateway->hasDummyAccounts($invoice_id);
		} else {
			$invoice['has_dummy_accounts'] = false;
		}

		return $invoice;
	}

	/**
	 * Get all warnings for an invoice; can do it using either an invoice record or an invoice ID.
	 * Using an invoice record makes it so some queries don't need to be run
	 *
	 * @param  array $invoice    An record from the INVOICE database table
	 * @param  int   $invoice_id An ID for a record in the INVOICE table
	 * @return array             An array of warnings
	 */
	public function getWarnings($invoice=null, $invoice_id=null) {
		// If no invoice record was provided, get one using the ID
		if ($invoice === null) {
			$invoice = $this->invoiceGateway->findById($invoice_id);
		}

		$warnings = [];

		$warningTypes = ['Job','VendorInsurance','VendorInactive','InvoiceDuplicate',
						'InvoiceDuplicateDateAmount','LinkablePo','PoThreshold','InvalidPeriod'];

		foreach ($warningTypes as $warningType) {
			$fn = "get{$warningType}Warning";
			$warning = $this->$fn($invoice, $invoice_id);
			if ($warning !== null) {
				$warnings[] = $warning;
			}
		}

		return $warnings;
	}

	/**
	 * Warning for if an invoice is a duplicate based on the invoice number and vendor
	 */
	public function getInvoiceDuplicateWarning($invoice=null, $invoice_id=null) {
		if ($invoice_id === null) {
			$invoice_id = $invoice['invoice_id'];
		}

		$res = $this->invoiceGateway->findDuplicates($invoice_id);
		if (count($res)) {
			return [
				'warning_type'  => 'invoiceDuplicate',
				'warning_title' => 'Error!',
				'warning_icon'  => 'stop',
				'warning_data'  => []
			];
		}

		return null;
	}

	/**
	 * Warning for if an invoice is a duplicate based on the date, property, and amount
	 */
	public function getInvoiceDuplicateDateAmountWarning($invoice=null, $invoice_id=null) {
		if ($invoice_id === null) {
			$invoice_id = $invoice['invoice_id'];
		}

		$res = $this->invoiceGateway->findDuplicateDateAndAmount($invoice_id);
		if (count($res)) {
			return [
				'warning_type'  => 'invoiceDuplicateDateAmount',
				'warning_title' => 'Warning!',
				'warning_icon'  => 'alert',
				'warning_data'  => []
			];
		}

		return null;
	}

	/**
	 * Warning for if an invoice has available PO
	 */
	public function getLinkablePoWarning($invoice=null, $invoice_id=null) {
		if ($invoice_id === null) {
			$invoice_id = $invoice['invoice_id'];
		} else if ($invoice === null) {
			$invoice = $this->invoiceGateway->find(
				'i.invoice_id = ?', 
				[$invoice_id],
				null,
				['invoice_status']
			);
			$invoice = $invoice[0];
		}

		$linkable = $this->getLinkablePOs($invoice_id);
		$linked = $this->getAssociatedPOs($invoice_id);

		if (
			$invoice['invoice_status'] == 'open'			// Invoice is in Open Status
			&& $this->securityService->hasPermission(1026)	// Purchase Orders permission
			&& count($linkable)								// Invoice has linkable POs
			&& !count($linked)								// Invoice has no POs linked to it
		) {
			return [
				'warning_type'  => 'linkablePo',
				'warning_title' => 'Alert!',
				'warning_icon'  => 'alert',
				'warning_data'  => []
			];
		}

		return null;
	}

	/**
	 * Warning for when invoice hsa POs above matching threshhold for the property
	 */
	public function getPoThresholdWarning($invoice=null, $invoice_id=null) {
		if ($invoice_id === null) {
			$invoice_id = $invoice['invoice_id'];
		} else if ($invoice === null) {
			$invoice = $this->invoiceGateway->findById($invoice_id);
		}

		$po = $this->getAssociatedPOs($invoice_id);
		if (count($po)) {
			$po = $po[0];
			$comparisonAmount = $po['po_total'] + ($po['po_total'] * $po['matching_threshold']);
			if ($invoice['entity_amount'] > $comparisonAmount) {
				return [
					'warning_type'  => 'poThreshold',
					'warning_title' => 'Alert!',
					'warning_icon'  => 'alert',
					'warning_data'  => []
				];
			}
		}

		return null;
	}

	/**
	 * 
	 */
	public function getInvalidPeriodWarning($invoice=null, $invoice_id=null) {
		if ($this->configService->get('PN.InvoiceOptions.differentPostPeriodWarning', '0') == '1') {
			if ($invoice_id === null) {
				$invoice_id = $invoice['invoice_id'];
			}
			$invalid = $this->invoiceGateway->findInvalidPostDates($invoice_id);
			if (count($invalid)) {
				return [
					'warning_type'  => 'poThreshold',
					'warning_title' => 'Alert!',
					'warning_icon'  => 'alert',
					'warning_data'  => $invalid
				];
			}
		}

		return null;
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
		return $this->purchaseOrderGateway->findPosLinkableToInvoice($invoice_id);
	}

	public function getHistoryLog($invoice_id, $pageSize=null, $page=null, $sort="approve_datetm") {
		return $this->invoiceGateway->findHistoryLog($invoice_id, $pageSize, $page, $sort);
	}

	public function getPayments($invoice_id) {
		return $this->invoicePaymentGateway->findForInvoice($invoice_id);
	}

	public function getDuplicates($invoice_id) {
		return $this->invoiceGateway->findDuplicates($invoice_id);
	}

	public function getDuplicateDateAndAmount($invoice_id) {
		return $this->invoiceGateway->findDuplicateDateAndAmount($invoice_id);
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
	 * Retrieve invoice payment types
	 *
	 * @param null $paymentType_id
	 * @return array|bool
	 */
	public function getPaymentTypes($paymentType_id = null) {
		return $this->invoiceGateway->getPaymentTypes($paymentType_id);
	}

    /**
     * Get Template for image index table.
     * 
     * @param int $vendorsite_id Vendorsite id. Should not be empty.
     * @param int $property_id Propery id. Should not be empty.
     * @param int $utilityaccount_id Utility account ID.
     * @return [] List of templates.
     */
    public function getTemplatesByCriteria($vendorsite_id, $property_id, $utilityaccount_id=null) {
    	return $this->invoiceGateway->getTemplatesByCriteria(
    		$this->securityService->getUserId(),
    		$this->securityService->getDelegatedUserId(),
        	$vendorsite_id,
        	$property_id,
        	$utilityaccount_id
        );
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
	
	/**
	 * Voids an invoice
	 */
	public function void($invoice_id, $note) {
		$this->invoiceGateway->beginTransaction();

		$success = true;
		$error   = null;
		try {
			$this->invoiceGateway->update([
				'invoice_id'     => $invoice_id,
				'invoice_status' => 'void'
			]);
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