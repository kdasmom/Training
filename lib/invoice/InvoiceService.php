<?php

namespace NP\invoice;

use NP\shared\AbstractInvoicePoService;

/**
 * Service class for operations related to Invoices
 *
 * @author Thomas Messier
 */
class InvoiceService extends AbstractInvoicePoService {
	
	protected $type = 'invoice';

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
		/*** THIS QUERY IS RUNNING SLOW ***/
		$invoice['image'] = $this->imageIndexGateway->findEntityImages($invoice_id, 'Invoice', true);
		
		// Get linkable POs
		/*** THIS QUERY IS RUNNING SLOW ***/
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

		// Get invoice warnings
		/*** THIS QUERY IS RUNNING SLOW ***/
		$invoice['warnings'] = $this->getWarnings($invoice);

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
				'warning_data'  => $res
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
     * Gets invoice statistics for a specified property
     *
     * @param  int $property_id
     * @return array
     */
    public function getInvoiceStatistics($property_id) {
    	return $this->invoiceGateway->findInvoiceStatistics($property_id);
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

		$errors  = [];
		$userprofile_id = $this->securityService->getUserId();
		try {
			$this->invoiceGateway->update([
				'invoice_id'     => $invoice_id,
				'invoice_status' => 'void'
			]);

			$approvetype_id = $this->approveTypeGateway->getIdByName('void');

			$approve = new \NP\workflow\ApproveEntity([
				'table_name'                   => 'invoice',
				'tablekey_id'                  => $invoice_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId(),
				'approve_message'              => 'This invoice has been voided.',
				'approvetype_id'               => $approvetype_id,
				'transaction_id'               => $this->approveGateway->currentId()
			]);

			$errors = $this->entityValidator->validate($approve);
			if (!count($errors)) {
				$this->approveGateway->save($approve);
			}

			$note = new \NP\shared\NoteEntity([
				'table_name'     => 'invoice',
				'tablekey_id'    => $invoice_id,
				'note'           => $note,
				'objecttype_id'  => 0,
				'objtype_id_alt' => 2,
				'userprofile_id' => $userprofile_id
			]);

			$errors = array_merge($errors, $this->entityValidator->validate($note));
			if (!count($errors)) {
				$this->noteGateway->save($note);
			}

			// TODO: still need to replicate the call to UPDATE_PN_ACTUALS here
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}

		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
	}
	
	/**
	 * Places an invoice on hold
	 */
	public function placeOnHold($invoice_id, $reason_id, $note) {
		$this->invoiceGateway->beginTransaction();

		$errors  = [];
		$userprofile_id = $this->securityService->getUserId();
		$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();
		try {
			// Retrieve the current status of the invoice for later use
			$oldStatus = $this->invoiceGateway->findValue(
				['invoice_id'=>'?'],
				[$invoice_id],
				'invoice_status'
			);

			// Retrieve the appropriate approval type for this
			$approvetype_id = $this->approveTypeGateway->getIdByName('hold');

			// Build the approve message
			$reason = $this->reasonGateway->findSingle(
				['reason_id'=>'?'],
				[$reason_id],
				['reason_text','objtype_id']
			);

			$approve_message = $reason['reason_text'];

			if ($userprofile_id != $delegation_to_userprofile_id) {
				$user   = $this->userprofileGateway->findById(
					$userprofile_id,
					['userprofile_username']
				);
				$userTo = $this->userprofileGateway->findById(
					$delegation_to_userprofile_id,
					['userprofile_username']
				);

				$approve_message .= " ({$userTo['userprofile_username']} put on hold on behalf of {$user['userprofile_username']})";
			}
			$approve_message = "Invoice was placed on hold by user<br />Reason: {$approve_message}";
			if (!empty($note)) {
				$approve_message .= "<br />Notes: {$note}";
			}

			// Save the Approve record
			$approve = new \NP\workflow\ApproveEntity([
				'table_name'                   => 'invoice',
				'tablekey_id'                  => $invoice_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId(),
				'approve_status'               => 'inactive',
				'approve_message'              => $approve_message,
				'approvetype_id'               => $approvetype_id
			]);

			$errors = $this->entityValidator->validate($approve);
			if (!count($errors)) {
				$this->approveGateway->save($approve);
			}

			// Save the InvoiceHold record
			$hold = new \NP\invoice\InvoiceHoldEntity([
				'invoice_id'             => $invoice_id,
				'approve_id'             => $approve->approve_id,
				'invoicehold_inv_status' => $oldStatus
			]);

			$errors = $this->entityValidator->validate($hold);
			if (!count($errors)) {
				$this->invoiceHoldGateway->save($hold);
			}

			// Get the old note to compare for auditing purposes
			$oldNote = $this->noteGateway->findValue(
				[
					'table_name'    => '?',
					'tablekey_id'   => '?',
					'objecttype_id' => '?'
				],
				['invoice', $invoice_id, $reason['objtype_id']],
				'note',
				'note_createddatetm DESC'
			);

			// Save the Note
			$note = new \NP\shared\NoteEntity([
				'table_name'     => 'invoice',
				'tablekey_id'    => $invoice_id,
				'note'           => $note,
				'reason_id'      => (is_numeric($reason_id)) ? $reason_id : null,
				'objecttype_id'  => 0,
				'userprofile_id' => $userprofile_id
			]);

			$errors = array_merge($errors, $this->entityValidator->validate($note));
			if (!count($errors)) {
				$this->noteGateway->save($note);
			}

			// If note has changed, add an audit record
			if (!empty($oldNote) && $oldNote != $note) {
				$auditactivity_id = $this->auditactivityGateway->findValue(
					['auditactivity'=>'?'],
					['Modified'],
					'auditactivity_id'
				);

				$audittype_id = $this->audittypeGateway->findValue(
					['audittype'=>'?'],
					['Invoice'],
					'audittype_id'
				);

				$audit = new \NP\shared\AuditlogEntity([
					'field_name'                   => 'hold_note',
					'field_new_value'              => $note,
					'field_old_value'              => $oldNote,
					'tablekey_id'                  => $invoice_id,
					'auditactivity_id'             => $auditactivity_id,
					'audittype_id'                 => $audittype_id,
					'userprofile_id'               => $userprofile_id,
					'delegation_to_userprofile_id' => $delegation_to_userprofile_id
				]);

				$errors = array_merge($errors, $this->entityValidator->validate($audit));
				if (!count($errors)) {
					$this->auditlogGateway->save($audit);
				}
			}

			// Update the invoice records
			if (!count($errors)) {
				$this->invoiceGateway->update([
					'invoice_id'            => $invoice_id,
					'invoice_status'        => 'hold',
					'invoice_submitteddate' => null
				]);
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}

		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
	}

	/**
	 * Activate an invoice that's on hold
	 *
	 * @param  int $invoice_id
	 * @return array
	 */
	public function activate($invoice_id) {
		$this->invoiceGateway->beginTransaction();

		$errors  = [];
		$userprofile_id = $this->securityService->getUserId();
		$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();
		try {
			// Get the hold details
			$hold = $this->invoiceHoldGateway->findSingle(
				['invoice_id'=>'?', 'invoicehold_active'=>'?'],
				[$invoice_id, 1]
			);

			if (!empty($hold)) {
				// Update the invoice hold record
				$hold = new \NP\invoice\InvoiceHoldEntity($hold);
				$now = \NP\util\Util::formatDateForDB();
				$hold->setFields([
					'invoicehold_active'                    => 0,
					'invoicehold_activate_datetm'           => $now,
					'activate_userprofile_id'               => $userprofile_id,
					'activate_delegation_to_userprofile_id' => $delegation_to_userprofile_id
				]);

				$errors = $this->entityValidator->validate($hold);
				if (!count($errors)) {
					$this->invoiceHoldGateway->save($hold);
				}

				// Update the invoice record to return it to the previous status
				if (!count($errors)) {
					$this->invoiceGateway->update([
						'invoice_id'     => $invoice_id,
						'invoice_status' => $hold->invoicehold_inv_status
					]);
				}
			}
		} catch(\Exception $e) {
			$errors[] = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}

		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
	}

	/**
	 * 
	 */
	public function revert($invoice_id) {
		$errors = [];
		$this->invoiceGateway->beginTransaction();
		
		try {
			$userprofile_id               = $this->securityService->getUserId();
			$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();
			$lock_id = null;
			$newStatus = 'open';

			// Get a new lock
			$lock_id = $this->setNewLock($invoice_id);

			$invoice = $this->invoiceGateway->findSingle(
				'invoice_id = ?',
				[$invoice_id],
				['invoice_period','property_id','invoice_status']
			);

			$newPeriod = $this->fiscalCalService->getAccountingPeriod($invoice['property_id']);
			$newPeriod = \NP\util\Util::formatDateForDB($newPeriod);

			// Update the invoice's status
			$this->invoiceGateway->update(
				['invoice_status'=>'open', 'invoice_period'=>$newPeriod],
				'invoice_id = ?',
				[$invoice_id]
			);

			$this->audit([
				'tablekey_id'                  => $invoice_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
				'field_name'                   => 'invoice_period',
				'field_new_value'              => $newPeriod,
				'field_old_value'              => $invoice['invoice_period']
			], 'invoice', 'modified');

			// As a precaution, update the period on all line items to match the header
			$this->invoiceItemGateway->update(
				['invoiceitem_period'=>$newPeriod],
				'invoice_id = ?',
				[$invoice_id]
			);

			$result = $this->createInvoiceBudgets($invoice_id);
			if (!$result['success']) {
				$this->loggingService->log('global', 'Error creating invoice budgets', $result['errors']);
				throw new \NP\core\Exception('Error reverting invoice while creating invoice budgets');
			}

			// Log the vendor change
			$approvetype_id = $this->approveTypeGateway->getIdByName('Reverted');

			$approve = new \NP\workflow\ApproveEntity([
				'table_name'                   => 'invoice',
				'tablekey_id'                  => $invoice_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
				'approve_message'              => 'This invoice was reverted.',
				'approvetype_id'               => $approvetype_id,
				'transaction_id'               => $this->approveGateway->currentId()
			]);

			$approveErrors = $this->entityValidator->validate($approve);
			if (count($approveErrors)) {
				$this->loggingService->log('global', 'Error creating approve record', $approveErrors);
				throw new \NP\core\Exception('Error reverting invoice while creating approve record');
			}

			$this->approveGateway->save($approve);

			// Audit the status change
			$this->audit([
				'tablekey_id'                  => $invoice_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
				'field_name'                   => 'invoice_status',
				'field_new_value'              => 'revert_open'
			], 'invoice', 'revert_open');
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors,
		    'lock_id' => $lock_id
		);
	}

	/**
	 * Change the vendor for an invoice
	 *
	 * @param  int $invoice_id
	 * @param  int $vendor_id
	 * @return array
	 */
	public function changeVendor($invoice_id, $vendor_id) {
		$this->invoiceGateway->beginTransaction();

		$errors  = [];
		$userprofile_id = $this->securityService->getUserId();
		$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();
		try {
			// Retrieve the vendorsite_id based on the vendor_id selected
			$vendor = $this->vendorGateway->findById($vendor_id);
			$remit_advice = $vendor['remit_req'];
			if (!is_numeric($remit_advice)) {
				$remit_advice = 0;
			}

			// Delete all lines
			$this->clearLines($invoice_id);

			// Delete all hold records
			$this->invoiceHoldGateway->delete(['invoice_id'=>'?'], [$invoice_id]);

			// Delete all approval records
			$this->approveGateway->delete(
				['table_name'=>'?', 'tablekey_id'=>'?'],
				['invoice', $invoice_id]
			);

			// Log the vendor change
			$approvetype_id = $this->approveTypeGateway->getIdByName('Change Vendor');

			$approve = new \NP\workflow\ApproveEntity([
				'table_name'                   => 'invoice',
				'tablekey_id'                  => $invoice_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId(),
				'approve_message'              => 'Vendor Change',
				'approvetype_id'               => $approvetype_id,
				'transaction_id'               => $this->approveGateway->currentId()
			]);

			$errors = $this->entityValidator->validate($approve);
			if (!count($errors)) {
				$this->approveGateway->save($approve);
			}

			// Update the vendor
			if (!count($errors)) {
				$this->invoiceGateway->update([
					'invoice_id'     => $invoice_id,
					'paytablekey_id' => $vendor['vendorsite_id'],
					'remit_advice'   => $remit_advice
				]);
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}

		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}

        return array(
            'success' => (count($errors)) ? false : true,
            'errors'  => $errors
        );
	}

	/**
	 * Removes all line items from an invoice
	 */
	public function clearLines($invoice_id) {
		$this->invoiceItemGateway->beginTransaction();
		
		try {
			// Unlink POs and PO lines from this invoice
			$this->unlinkPoFromInvoice($invoice_id);

			// Delete all lines
			$this->invoiceItemGateway->delete(['invoice_id'=>'?'], [$invoice_id]);

			$this->invoiceItemGateway->commit();
		} catch(\Exception $e) {
			$this->invoiceItemGateway->rollback();
			throw $e;
		}
	}

	/**
	 * Saves an invoice and invoice line items (if included)
	 */
	public function saveInvoice($data) {
		$errors = [];
		$this->invoiceGateway->beginTransaction();
		
		try {
			$now = \NP\util\Util::formatDateForDB();

			// Create the invoice entity with initial data
			$invoice = new InvoiceEntity($data['invoice']);

			// Set a new lock on the invoice to prevent other people from updating it simultaneously
			$invoice->lock_id = $this->getLock($invoice->invoice_id) + 1;

			// If paytablekey_id wasn't added, we need to get it based on vendor_id
			if ($invoice->paytablekey_id === null) {
				// Add vendorsite_id to the invoice
				$invoice->paytablekey_id = $this->vendorGateway->findVendorsite($data['vendor_id']);
			}

			// Validate invoice record
			$errors = $this->entityValidator->validate($invoice);

			// Save invoice if valid
			if (!count($errors)) {
				$this->invoiceGateway->save($invoice);
			}

			// Save the creator of the invoice if new
			if (!count($errors) && $data['invoice']['invoice_id'] === null) {
				// Validate author record
				$author = new \NP\user\RecAuthorEntity([
					'userprofile_id'               => $data['userprofile_id'],
					'delegation_to_userprofile_id' => $data['delegation_to_userprofile_id'],
					'table_name'                   => 'invoice',
					'tablekey_id'                  => $invoice->invoice_id
				]);
				$authorErrors = $this->entityValidator->validate($author);
				if (count($authorErrors)) {
					$this->loggingService->log('global', 'RecAuthorEntity errors', $authorErrors);
					$this->loggingService->log('global', 'invoice_id', ['invoice_id' => $invoice->invoice_id]);
					throw new \NP\core\Exception('Unexpected error saving invoice author');
				} else {
					$this->recAuthorGateway->save($author);
				}
			}

			// Save invoice line items
			if (!count($errors)) {
				if (array_key_exists('lines', $data)) {
					// Loop through line items to add/modify
					foreach ($data['lines'] as $invoiceitem) {
						// Assign some values that weren't passed in
						$invoiceitem['invoice_id']         = $invoice->invoice_id;
						$invoiceitem['vendorsite_id']      = $invoice->paytablekey_id;
						$invoiceitem['invoiceitem_period'] = $invoice->invoice_period;

						// Save the line item
						$result = $this->saveLine($invoiceitem);

						// Error handling
						if (!$result['success']) {
							$errors = array_merge($errors, $result['errors']);
						}	
					}
				}
			}

			// Delete invoice line items
			if (!count($errors)) {
				if (array_key_exists('deletedLines', $data)) {
					// Loop through line items to delete
					foreach ($data['deletedLines'] as $invoiceitem) {
						// Delete the line item
						$result = $this->deleteLine($invoiceitem['invoiceitem_id']);

						// Error handling
						if (!$result['success']) {
							$errors = array_merge($errors, $result['errors']);
							break;
						}
					}
				}
			}

			// Retrieve current Tax and Shipping totals for auditing purposes before deleting
			if (!count($errors)) {
				$oldTotals = $this->invoiceItemGateway->findTaxAndShippingTotal($invoice->invoice_id);

				$this->allocateTaxAndShipping($invoice->invoice_id, $data['tax'], $data['shipping']);

				if ($data['invoice']['invoice_id'] === null) {
					// Save audit of changes to tax and shipping
					$result = $this->auditTaxShippingChanges(
						$invoice->invoice_id,
						$oldTotals['tax'],
						$data['tax'],
						$oldTotals['shipping'],
						$data['shipping']
					);

					if (!$result['success']) {
						$this->entityValidator->addError(
							$errors,
							'global',
							'Unexpected error trying to audit tax and shipping changes'
						);
					}
				}

				// As a precaution, update the period on all line items to match the header
				$this->invoiceItemGateway->update(
					['invoiceitem_period' => $invoice->invoice_period],
					'invoice_id = ?',
					[$invoice->invoice_id]
				);
			}

			if (!count($errors)) {
				// Create budgets for all line items (if needed)
				$result = $this->createInvoiceBudgets($invoice->invoice_id);

				if (!$result['success']) {
					$this->entityValidator->addError(
						$errors,
						'global',
						'Unexpected error trying to create invoice budgets'
					);
				}
			}

			if (!count($errors)) {
				// Update the status of the invoice_multiproperty column for the invoice
				$this->updateMultiPropertyStatus($invoice->invoice_id);
			}

			// TODO: add code to deal with jobcosting contract actuals (UPDATE_PN_ACTUALS)

		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}
		
		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors,
			'invoice_id' => $invoice->invoice_id,
			'lock_id'    => $invoice->lock_id
		);
	}

	/**
	 * 
	 */
	public function updateMultiPropertyStatus($invoice_id) {
		$invoice_multiproperty = ($this->invoiceGateway->isInvoiceMultiProp($invoice_id)) ? 1 : 0;

		$this->invoiceGateway->update([
			'invoice_id'            => $invoice_id,
			'invoice_multiproperty' => $invoice_multiproperty
		]);
	}

	/**
	 * Saves an invoice line item
	 */
	private function saveLine($data) {
		$errors = [];
		$this->invoiceItemGateway->beginTransaction();
		
		try {
			// Create the invoice entity with initial data
			$invoiceItem = new InvoiceItemEntity($data);

			// Validate invoice record
			$errors = $this->entityValidator->validate($invoiceItem);

			// Save invoice line if valid
			if (!count($errors)) {
				$this->invoiceItemGateway->save($invoiceItem);
			}

			// Save job costing info if appropriate
			if (!count($errors)) {
				$data['table_name']  = 'invoiceitem';
				$data['tablekey_id'] = $invoiceItem->invoiceitem_id;
				$res = $this->jobCostingService->saveJobCostingInfo($data);
				$errors = $res['errors'];
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->invoiceItemGateway->rollback();
		} else {
			$this->invoiceItemGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Deletes a single line item
	 *
	 * @param  int $invoiceitem_id
	 * @return array
	 */
	private function deleteLine($invoiceitem_id) {
		$errors = [];
		$this->invoiceItemGateway->beginTransaction();
		
		try {
			// Get invoice ID
			$invoice_id = $this->invoiceItemGateway->findValue(
				['invoiceitem_id'=>'?'],
				[$invoiceitem_id],
				'invoice_id'
			);

			// Find linked PO items
			$poitems = $this->invoiceItemGateway->findLinkByItem($invoiceitem_id);

			// Loop through linked items
			foreach ($poitems as $poitem) {
				$poitem_id = $poitem['poitem_id'];

				// Check if there's a VendorConnect invoice item linked to this po item
				$va_invoiceitem = $this->vendorAccessInvoiceItemGateway->findByLinkedPo($poitem_id);

				// If an VendorConnect invoice item exists, proceed
				if ($va_invoiceitem !== null) {
					// Re-link the PO item to the VendorConnect invoice item
					$this->linkPoItemToVendorConnectInvoiceItem(
						$poitem_id,
						$va_invoiceitem['invoiceitem_id']
					);
				}

				// Remove association from PO line
				$result = $this->unlinkPoItem($poitem_id, $invoiceitem_id);

				// If unlinking PO item errors, log it and break
				if (!$result['success']) {
					$this->entityValidator->addError(
						$errors,
						'global',
						'Unexpected error trying to unlink PO item'
					);
					break;
				}
			}

			if (!count($errors)) {
				// Delete any job associations if appropriate
				if ($this->configService->get('pn.jobcosting.jobcostingEnabled', '0') == '1') {
					$this->unassignJob($invoiceitem_id);
				}

				// Delete the invoice line
				$this->invoiceItemGateway->delete('invoiceitem_id = ?', [$invoiceitem_id]);
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->invoiceItemGateway->rollback();
		} else {
			$this->invoiceItemGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Creates any budget that may be missing for an invoice
	 *
	 * @param  int $invoice_id
	 * @return array
	 */
	public function createInvoiceBudgets($invoice_id) {
		$lines = $this->invoiceItemGateway->find(
			['invoice_id' => '?'],
			[$invoice_id],
			null,
			['property_id','glaccount_id']
		);

		$errors = [];
		$this->budgetGateway->beginTransaction();
		
		try {
			foreach ($lines as $line) {
				$period = $this->fiscalCalService->getAccountingPeriod($line['property_id']);

				$result = $this->budgetService->createBudget(
					$line['property_id'],
					$line['glaccount_id'],
					$period,
					0,
					0
				);

				if (!$result['success']) {
					throw new \NP\core\Exception("Unexpected error creating invoice budgets");
				}
			}	
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->budgetGateway->rollback();
		} else {
			$this->budgetGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Deletes an invoice
	 * @param  int $invoice_id
	 */
	public function deleteInvoice($invoice_id) {
		$errors = [];
		$this->invoiceGateway->beginTransaction();
		
		$userprofile_id               = $this->securityService->getUserId();
		$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();

		try {
			// Get all lines for this invoice
			$lines = $this->invoiceItemGateway->find('invoice_id = ?', [$invoice_id], null, ['invoiceitem_id']);
			// Loop through line items to delete
			foreach ($lines as $invoiceitem) {
				// Delete the line item
				$result = $this->deleteLine($invoiceitem['invoiceitem_id']);

				// Error handling
				if (!$result['success']) {
					$errors = array_merge($errors, $result['errors']);
					break;
				}
			}

			if (!count($errors)) {
				$result = $this->unassignImage($invoice_id);

				// Error handling
				if (!$result['success']) {
					$this->entityValidator->addError(
						$errors,
						'global',
						'Unexpected error trying to unassign images while deleting an invoice'
					);
				}
			}

			if (!count($errors)) {
				// Remove author record
				$this->recAuthorGateway->delete('table_name = ? AND tablekey_id = ?', ['invoice', $invoice_id]);

				// Remove all payment records
				$this->invoicePaymentGateway->delete('invoice_id = ?', [$invoice_id]);
				
				// Remove all hold information
				$this->invoiceHoldGateway->delete('invoice_id = ?', [$invoice_id]);

				// Remove scheduling data
				$result = $this->removeScheduling($invoice_id);

				// Error handling
				if (!$result['success']) {
					$this->entityValidator->addError(
						$errors,
						'global',
						'Unexpected error trying to remove scheduling data for invoice'
					);
				}
			}

			if (!count($errors)) {
				$this->unlinkInvoiceFromVendorConnect($invoice_id);

				$this->invoiceGateway->delete('invoice_id = ?', [$invoice_id]);
			}

			// TODO: add code to deal with jobcosting contract actuals (UPDATE_PN_ACTUALS)

		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Removes any scheduling attached to the invoice (applies to scheduled templates)
	 * @param  int $invoice_id
	 */
	public function removeScheduling($invoice_id) {
		$errors = [];
		$this->recurringSchedulerGateway->beginTransaction();
		
		try {
			$this->scheduledTasksGateway->deleteByInvoice($invoice_id);

			$this->recurringSchedulerGateway->delete(
				['table_name'=>'?', 'tablekey_id'=>'?'],
				['invoice', $invoice_id]
			);
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->recurringSchedulerGateway->rollback();
		} else {
			$this->recurringSchedulerGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Unlinks an invoice from VendorConnect
	 * @param  int $invoice_id
	 */
	public function unlinkInvoiceFromVendorConnect($invoice_id) {
		$now = \NP\util\Util::formatDateForDB();
		$this->vendorAccessInvoiceGateway->update(
			[
				'invoice_status_type_id' => 5,
				'return_notes'           => 'Deleted by Client',
				'rejected_datetm'        => $now,
				'vai_lastupdate_datetm'  => $now,
				'pn_invoice_id'          => null
			],
			'pn_invoice_id = ?',
			[$invoice_id]
		);
	}

	/**
	 * Applies a template to an existing invoice
	 */
	public function applyTemplate($invoice_id, $template_id) {
		$errors = [];
		$this->invoiceGateway->beginTransaction();
		
		try {
			// Delete all lines from this invoice
			$this->clearLines($invoice_id);

			// Get tax and shipping totals
			$totals = $this->invoiceItemGateway->findTaxAndShippingTotal($template_id);

			// Get the data for the template selected
			$templateData = [
				'invoice'  => $this->invoiceGateway->findSingle('invoice_id = ?', [$template_id]),
				'lines'    => $this->getInvoiceLines($template_id),
				'tax'      => $totals['tax'],
				'shipping' => $totals['shipping'],
				'userprofile_id'               => $this->securityService->getUserId(),
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId()
			];

			// Update the invoice data with the correct invoice ID
			$templateData['invoice']['invoice_id'] = $invoice_id;

			// Update the invoice's status
			$templateData['invoice']['invoice_status'] = 'open';

			$result = $this->saveInvoice($templateData);
			
			if (!$result['success']) {
				$errors = $result['errors'];
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Submits an invoice for payment
	 */
	public function submitForPayment($invoice_id) {
		$inactiveJobs = $this->invoiceItemGateway->findLinesWithInactiveJobCodes($invoice_id);
		// If inactive job codes are found, return an error
		if (count($inactiveJobs)) {
			return array(
			    'success' => false,
			    'errors'  => ['field' => 'jobcosting', 'msg' => 'This invoice cannot be submitted for payment because it has inactive job codes/contracts on one or more line items']
			);
		} else {
			$errors = [];
			$this->invoiceGateway->beginTransaction();
			
			try {
				$now                          = \NP\util\Util::formatDateForDB();
				$userprofile_id               = $this->securityService->getUserId();
				$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();

				// Get the current status of the invoice before updating it (needed for audit)
				$oldStatus = $this->invoiceGateway->findValue(
					['invoice_id'=>'?'],
					[$invoice_id],
					'invoice_status'
				);
				$newStatus = 'submitted';

				// Update the invoice's status
				$this->invoiceGateway->update(
					['invoice_status'=>$newStatus, 'invoice_submitteddate'=>$now],
					'invoice_id = ?',
					[$invoice_id]
				);

				// Save the approve record
				$approvetype_id = $this->approveTypeGateway->getIdByName('post approved');
				$approve = new \NP\workflow\ApproveEntity([
					'table_name'                   => 'invoice',
					'tablekey_id'                  => $invoice_id,
					'userprofile_id'               => $userprofile_id,
					'approve_status'               => 'post approved',
					'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
					'approve_message'              => 'Invoice was Submitted for Payment by user.',
					'approvetype_id'               => $approvetype_id,
					'transaction_id'               => $this->approveGateway->currentId()
				]);

				$errors = $this->entityValidator->validate($approve);
				if (count($errors)) {
					$this->loggingService->log('global', 'Invalid approve record', $errors);
					throw new \NP\core\Exception('Error saving approve record while submitting invoice for payment');
				}
				$this->approveGateway->save($approve);

				// Audit the status change
				$this->audit([
					'tablekey_id'                  => $invoice_id,
					'userprofile_id'               => $userprofile_id,
					'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
					'field_name'                   => 'invoice_status',
					'field_new_value'              => $oldStatus,
					'field_old_value'              => $newStatus
				], 'invoice', $newStatus);
			} catch(\Exception $e) {
				$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
			}
			
			if (count($errors)) {
				$this->invoiceGateway->rollback();
			} else {
				$this->invoiceGateway->commit();
			}
			
			return array(
			    'success' => (count($errors)) ? false : true,
			    'errors'  => $errors
			);
		}
	}

	/**
	 * Reverts an invoice back to open status after it has made it past approval
	 */
	public function modifyInvoice($invoice_id) {
		$errors = [];
		$this->invoiceGateway->beginTransaction();
		
		try {
			$userprofile_id               = $this->securityService->getUserId();
			$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();

			$this->approveGateway->update(
				['approve_status'=>'recall'],
				[
					'table_name'     => "'invoice'",
					'tablekey_id'    => '?',
					'approve_status' => "'active'"
				],
				[$invoice_id]
			);

			$this->invoiceGateway->update(
				['invoice_status'=>'open', 'invoice_submitteddate'=>null],
				'invoice_id = ?',
				[$invoice_id]
			);

			// Save the approve record
			$approvetype_id = $this->approveTypeGateway->getIdByName('modified');
			$approve = new \NP\workflow\ApproveEntity([
				'table_name'                   => 'invoice',
				'tablekey_id'                  => $invoice_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
				'approve_status'               => 'recalled',
				'approve_message'              => 'Invoice was modified by user.',
				'approvetype_id'               => $approvetype_id,
				'transaction_id'               => $this->approveGateway->currentId()
			]);

			$errors = $this->entityValidator->validate($approve);
			if (count($errors)) {
				$this->loggingService->log('global', 'Invalid approve record', $errors);
				throw new \NP\core\Exception('Error saving approve record while modifying an invoice');
			}
			$this->approveGateway->save($approve);
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Rejects an invoice
	 */
	public function reject($invoice_id, $rejectionnote_id, $invoice_reject_note) {
		$errors = [];
		$this->invoiceGateway->beginTransaction();
		
		try {
			$now                          = \NP\util\Util::formatDateForDB();
			$userprofile_id               = $this->securityService->getUserId();
			$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();

			$invoice = $this->invoiceGateway->findSingle(
				'invoice_id = ?',
				[$invoice_id],
				['invoice_status','invoice_reject_note']
			);
			$newStatus = 'rejected';

			// If there's an existing note, prepend it to the new one
			if (!empty($invoice['invoice_reject_note'])) {
				$invoice_reject_note = "{$invoice['invoice_reject_note']}<br />$invoice_reject_note";
			}

			// Update the invoice record with the new status and note
			$this->invoiceGateway->update([
				'invoice_id'          => $invoice_id,
				'invoice_status'      => $newStatus,
				'invoice_reject_note' => $invoice_reject_note
			]);

			// Audit the status change
			$this->audit([
				'tablekey_id'                  => $invoice_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
				'field_name'                   => 'invoice_status',
				'field_new_value'              => $invoice['invoice_status'],
				'field_old_value'              => $newStatus
			], 'invoice', $newStatus);

			// If invoice is pending approval, run this
			if ($invoice['invoice_status'] == 'forapproval') {
				// TODO: add code for rejecting invoice for approval
				
			}
			// If invoice is not pending, this is a post approve rejection
			else {
				$approvetype_id = $this->approveTypeGateway->getIdByName('rejected');

				// Save an approve record
				$approve = new \NP\workflow\ApproveEntity([
					'table_name'                   => 'invoice',
					'tablekey_id'                  => $invoice_id,
					'userprofile_id'               => $userprofile_id,
					'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
					'approve_message'              => $invoice_reject_note,
					'approvetype_id'               => $approvetype_id,
					'transaction_id'               => $this->approveGateway->currentId()
				]);

				$errors = $this->entityValidator->validate($approve);
				if (count($errors)) {
					$this->loggingService->log('global', 'Invalid approve record', $errors);
					throw new \NP\core\Exception('Error saving approve record while rejecting an invoice');
				}

				$this->approveGateway->save($approve);

				// Save a message (no idea why this is needed or where it's used)
				$messagetype_id = $this->messageGateway->findMessageType('alert');
				$message = new \NP\system\MessageEntity([
					'messagetype_id'     => $messagetype_id,
					'table_name'         => 'invoice',
					'tablekey_id'        => $invoice_id,
					'message_text'       => $invoice_reject_note,
					'message_flagstatus' => 'rejected'
				]);

				$errors = $this->entityValidator->validate($message);
				if (count($errors)) {
					$this->loggingService->log('global', 'Invalid message record', $errors);
					throw new \NP\core\Exception('Error saving message record while rejecting an invoice');
				}

				$this->messageGateway->save($message);
			}

			// Save a rejection history record (again, not sure why we need records in so many tables)
			$rejection = new \NP\shared\RejectionHistoryEntity([
				'rejectionnote_id'           => $rejectionnote_id,
				'table_name'                 => 'invoice',
				'tablekey_id'                => $invoice_id,
				'userprofile_id'             => $userprofile_id
			]);

			$errors = $this->entityValidator->validate($rejection);
			if (count($errors)) {
				$this->loggingService->log('global', 'Invalid rejectionhistory record', $errors);
				throw new \NP\core\Exception('Error saving rejectionhistory record while rejecting an invoice');
			}

			$this->rejectionHistoryGateway->save($rejection);

			// Audit the note change
			$this->audit([
				'tablekey_id'                  => $invoice_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
				'field_name'                   => 'invoice_reject_note',
				'field_new_value'              => $invoice['invoice_reject_note'],
				'field_old_value'              => $invoice_reject_note
			], 'invoice', 'modified');
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Saves invoice payments for an invoice
	 *
	 * @param  int   $invoice_id
	 * @param  array $payments
	 * @param  int   $mark_as_paid
	 * @return array
	 */
	public function savePayments($invoice_id, $payments, $invoicepayment_status='paid', $mark_as_paid=0) {
		$errors  = [];
		$lock_id = null;
		$this->invoiceGateway->beginTransaction();
		
		try {
			$invoicepayment_number        = $this->invoicePaymentGateway->getNextLineNumber($invoice_id);
			$userprofile_id               = $this->securityService->getUserId();
			$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();
			$invoicepayment_group_id      = null;

			// Set a new lock
			$lock_id = $this->setNewLock($invoice_id);

			foreach ($payments as $paymentData) {
				$payment = new InvoicePaymentEntity($paymentData);
				// Only do this if dealing with a new payment
				if ($payment->invoicepayment_id === null) {
					// Create a new payment group
					if ($invoicepayment_group_id === null) {
						$this->invoicePaymentGroupGateway->insert([
							'invoicepayment_type_id' => $payment->invoicepayment_type_id
						]);
						$invoicepayment_group_id = $this->invoicePaymentGroupGateway->lastInsertId();
					}

					$invoicepayment_status_id = $this->invoicePaymentStatusGateway->findIdByName($invoicepayment_status);

					// Update some entity fields
					$payment->setFields([
						'invoice_id'                           => $invoice_id,
						'invoicepayment_number'                => $invoicepayment_number,
						'invoicepayment_group_id'              => $invoicepayment_group_id,
						'invoicepayment_status_id'             => $invoicepayment_status_id,
						'invoicepayment_paid_by'               => $userprofile_id,
						'invoicepayment_paid_by_delegation_to' => $delegation_to_userprofile_id
					]);

					// Increment payment number
					$invoicepayment_number++;
				}

				// Validate payment record
				$errors = $this->entityValidator->validate($payment);
				if (count($errors)) {
					$this->loggingService->log('global', 'Payment record errors', $errors);
					throw new \NP\core\Exception('Error saving a payment record');
				}

				// Save payment record
				$this->invoicePaymentGateway->save($payment);
			}

			// Update the invoice record to paid status if needed
			if ($mark_as_paid === 1) {
				$this->invoiceGateway->update(
					['invoice_status'=>'paid'],
					'invoice_id = ?',
					[$invoice_id]
				);
				$status_name = 'Paid';
			} else {
				$status_name = 'Processing';
			}

			// Update status of related vendor connect invoices (if any exist)
			if ($invoicepayment_status == 'paid') {
				$status_id = $this->vendorAccessInvoiceStatusTypesGateway->findIdByName($status_name);

				$this->vendorAccessInvoiceGateway->update(
					['invoice_status_type_id'=>$status_id],
					['pn_invoice_id'=>'?'],
					[$invoice_id]
				);
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors,
		    'lock_id' => $lock_id
		);
	}

	/**
	 * Updates a payment to void or NSF status
	 *
	 * @param  int    $invoicepayment_id
	 * @param  string $invoicepayment_status
	 * @return array
	 */
	public function savePaymentStatus($invoicepayment_id, $invoicepayment_status) {
		// Get the original payment
		$payment = $this->invoicePaymentGateway->findById($invoicepayment_id);

		// Change some fields
		$payment['invoicepayment_voided_id'] = $payment['invoicepayment_id'];
		$payment['invoicepayment_id'] = null;
		$payment['paid'] = 0;

		// Run the same process used to save a payment, passing it some pre-determined arguments
		return $this->savePayments($payment['invoice_id'], [$payment], $invoicepayment_status, 0);
	}

	/**
	 * 
	 */
	public function reclass($data) {
		$errors = [];
		$this->invoiceGateway->beginTransaction();
		
		try {
			$invoice_id = $data['invoice']['invoice_id'];
			
			$oldInvoice = $this->invoiceGateway->findSingle(
				'invoice_id = ?',
				[$invoice_id]
			);

			$result = $this->saveInvoice($data);

			$newInvoice = $this->invoiceGateway->findSingle(
				'invoice_id = ?',
				[$invoice_id]
			);
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->invoiceGateway->rollback();
		} else {
			$this->invoiceGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}
}

?>