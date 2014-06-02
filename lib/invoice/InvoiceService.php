<?php

namespace NP\invoice;

use NP\shared\AbstractEntityService;
use NP\util\Util;

/**
 * Service class for operations related to Invoices
 *
 * @author Thomas Messier
 */
class InvoiceService extends AbstractEntityService {
	
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
		} else {
			$invoice['is_approver'] = false;
		}

		// Check if the optional workflow rule applies for this invoice
		$invoice['has_optional_rule'] = $this->wfRuleGateway->hasOptionalRule(
			$invoice['property_id'],
			$this->securityService->getUserId()
		);

		$invoice['is_utility_vendor'] = ($this->vendorService->isUtilityVendor($invoice['vendorsite_id'])) ? 1 : 0;

		// Get invoice images
		/*** THIS QUERY IS RUNNING SLOW ***/
		$invoice['image'] = $this->imageIndexGateway->findEntityImages($invoice_id, 'Invoice', true);
		
		// Get linkable POs (only do it if invoice is right status and there are right permissions)
		/*** THIS QUERY IS RUNNING SLOW ***/
		$invoice['linkable_pos'] = [];
		if (
			$invoice['invoice_status'] == 'open'
			&& (
				$this->securityService->hasPermission(6076)
				|| (
					$this->securityService->hasPermission(6077) 
					&& $this->securityService->getUserId() == $invoice['userprofile_id']
				)
			)
			&& $this->securityService->hasPermission(2038)
		) {
			$invoice['linkable_pos'] = $this->getLinkablePOs($invoice_id);
		}

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

		$invoice['lines'] = $this->invoiceItemGateway->findLines($invoice_id);

		// Get invoice warnings
		/*** THIS QUERY IS RUNNING SLOW ***/
		$invoice['warnings'] = $this->getWarnings($invoice);

		$invoice['hold_notes'] = $this->getHoldNotes($invoice_id);

		$invoice['rejection_notes'] = $this->getRejectionNotes($invoice_id);

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
		} else if ($invoice === null) {
			$invoice = $this->invoiceGateway->find(
				'i.invoice_id = ?', 
				[$invoice_id],
				null,
				['invoice_ref','invoice_status']
			);
			$invoice = $invoice[0];
		}

		if ($invoice['invoice_status'] !== 'draft' && !empty($invoice['invoice_ref'])) {
			$res = $this->invoiceGateway->findDuplicates($invoice_id);

			if (count($res)) {
				return [
					'warning_type'  => 'invoiceDuplicate',
					'warning_title' => 'Error!',
					'warning_icon'  => 'stop',
					'warning_data'  => []
				];
			}
		}

		return null;
	}

	/**
	 * Warning for if an invoice is a duplicate based on the date, property, and amount
	 */
	public function getInvoiceDuplicateDateAmountWarning($invoice=null, $invoice_id=null) {
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

		if ($invoice['invoice_status'] !== 'draft') {
			$res = $this->invoiceGateway->findDuplicateDateAndAmount($invoice_id);
			if (count($res)) {
				return [
					'warning_type'  => 'invoiceDuplicateDateAmount',
					'warning_title' => 'Warning!',
					'warning_icon'  => 'alert',
					'warning_data'  => $res
				];
			}
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
					'warning_type'  => 'invalidPeriod',
					'warning_title' => 'Alert!',
					'warning_icon'  => 'alert',
					'warning_data'  => $invalid
				];
			}
		}

		return null;
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
	 * Gets hold notes for an invoice
	 */
	public function getHoldNotes($invoice_id) {
		return $this->noteGateway->findHoldNotes($invoice_id);
	}

	/**
	 * Gets all reclass notes for an invoice
	 *
	 * @param  int $invoice_id
	 * @return array
	 */
	public function getReclassNotes($invoice_id) {
		return $this->auditReclassGateway->findByInvoice($invoice_id);
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

			// Update job costing contract total as needed
			if (!count($errors)) {
				$this->updateContractActuals($invoice_id);
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
	 * Delete a line item from an invoice (overrides the default function to delete entity lines)
	 */
	protected function deleteLine($item_id) {
		$errors  = [];
		$this->invoiceItemGateway->beginTransaction();
		
		try {
			$poitems = $this->invoiceItemGateway->findLinkByItem($item_id);

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
				$result = $this->unlinkPoItem($poitem_id, $item_id);

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
				$result = parent::deleteLine($item_id);

				$errors = $result['errors'];
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
	 * Deletes an entity (overrides the main entity delete to run additional operations)
	 * @param  int $invoice_id
	 */
	public function deleteEntity($entity_id) {
		$errors = [];
		$this->invoiceGateway->beginTransaction();
		
		$userprofile_id               = $this->securityService->getUserId();
		$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();

		try {
			// Remove all payment records
			$this->invoicePaymentGateway->delete('invoice_id = ?', [$entity_id]);
			
			// Remove all hold information
			$this->invoiceHoldGateway->delete('invoice_id = ?', [$entity_id]);

			// Unlink invoice from vendor connect if appropriate
			$this->unlinkInvoiceFromVendorConnect($entity_id);

			// Run parent function
			$result = parent::deleteEntity($entity_id);
			$errors = $result['errors'];
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
	 * Submits an invoice for payment
	 */
	public function submitForPayment($invoice_id) {
		$lock_id      = null;
		
		// Look for any inactive job codes
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

				// Set a new lock on the invoice to prevent other people from updating it simultaneously
				$lock_id = $this->getLock($invoice_id) + 1;

				// Update the invoice's status
				$this->invoiceGateway->update(
					['invoice_status'=>$newStatus, 'invoice_submitteddate'=>$now, 'lock_id'=>$lock_id],
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
			    'errors'  => $errors,
			    'lock_id' => $lock_id
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
	 * Reclasses a paid invoice
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
			$oldInvoice = new InvoiceEntity($oldInvoice);
			$oldLines   = $this->getEntityLines($invoice_id);

			$result = $this->saveEntity($data);

			$newInvoice = $this->invoiceGateway->findSingle(
				'invoice_id = ?',
				[$invoice_id]
			);

			$newInvoice = new InvoiceEntity($newInvoice);

			$auditor = new InvoiceReclassAuditor(
				$data['userprofile_id'],
				$data['delegation_to_userprofile_id'],
				$data['reclass_notes']
			);
			$fieldChanges = $auditor->audit($newInvoice, $oldInvoice);

			$newLines = $this->getEntityLines($invoice_id);

			$fields = InvoiceItemEntity::getAuditableFields();
			foreach ($newLines as $i=>$line) {
				$oldLine = new InvoiceItemEntity($oldLines[$i]);
				$newLine = new InvoiceItemEntity($line);

				$fieldChanges = array_merge($fieldChanges, $auditor->audit($newInvoice, $oldInvoice));
			}

			if (count($fieldChanges)) {
				$approvetype_id = $this->approveTypeGateway->getIdByName('reclassed');

				$approve = new \NP\workflow\ApproveEntity([
					'table_name'                   => 'invoice',
					'tablekey_id'                  => $newInvoice->invoice_id,
					'userprofile_id'               => $data['userprofile_id'],
					'delegation_to_userprofile_id' => $data['delegation_to_userprofile_id'],
					'approve_message'              => 'Invoice was Reclassed',
					'approvetype_id'               => $approvetype_id,
					'transaction_id'               => $this->approveGateway->currentId()
				]);

				$errors = $this->entityValidator->validate($approve);
				if (!count($errors)) {
					$this->approveGateway->save($approve);
				} else {
					$this->loggingService->log('global', 'Error creating approve record', $errors);
					throw new \NP\core\Exception('Error reclassing invoice while creating approve record');
				}
			}
		} catch(\Exception $e) {
			$this->loggingService->log('global', 'Unexpected error happening');
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
	 * Forwards an invoice by email to a list of emails or users
	 */
	public function forwardInvoice($invoice_id, $sender_email, $forward_to, $forward_val, $message, $includes=[]) {
		$pdfPath = null;
		$success = false;
		$errors  = [];

		// Get invoice number for email subject line
		$invoice_ref = $this->invoiceGateway->findValue(
			['invoice_id'=>'?'],
			[$invoice_id],
			'invoice_ref'
		);
		
		// Get invoice images if applicable
		$images     = [];
		$includeAll = in_array('allImages', $includes);
		if (in_array('mainImage', $includes) || $includeAll) {
			$images = $this->getImages($invoice_id, !$includeAll, true);
			if (!$includeAll) {
				$images = [$images];
			}
		}

		// Figure out the email or list of emails to send to
		if ($forward_to == 'vendor' || $forward_to == 'email') {
			$users = [['email_address' => $forward_val]];
		} else {
			$users = $this->userprofileGateway->find(
				[['in', 'u.userprofile_id', $this->userprofileGateway->createPlaceholders($forward_val)]],
				$forward_val
			);
		}

		// Generate the invoice PDF
		$pdf = new InvoicePdfRenderer($this->configService, $this->gatewayManager, $this, $invoice_id, $includes);
		$pdfPath = $this->configService->getClientFolder() . '/web/pdfs/' . $this->securityService->getUserId();

		// If destination directory doesn't exist, create it
  		if (!is_dir($pdfPath)) {
  			mkdir($pdfPath, 0777, true);
  		}
  		
		$pdfPath = Util::getUniqueFileName($pdfPath . "/invoice_{$invoice_id}.pdf");

		$pdfPath = $pdfPath['path'];
		$pdf->save($pdfPath);

		$message = strip_tags(trim($message));
		foreach ($users as $user) {
			try {
				$msg = EmailMessage::getNew(
										"Invoice Order {$invoice_ref}",
										strip_tags($message)
									)
									->setFrom($sender_email)
									->setTo($user['email_address'])
									->attach(EmailAttachment::getNew()->setPath($pdfPath));


				foreach($images as $image) {
					$msg->attach(EmailAttachment::getNew()->setPath($image['transfer_filename']));
				}

				$this->notificationService->sendEmail($msg);
				$success = true;

				$forward_id = (array_key_exists('userprofile_id', $user)) ? $user['userprofile_id'] : null;
				$this->invoicePoForwardGateway->insert([
					'table_name'                        => 'invoice',
					'tablekey_id'                       => $invoice_id,
					'forward_to_email'                  => $sender_email,
					'forward_to_userprofile_id'         => $forward_id,
					'forward_from_userprofile_id'       => $this->securityService->getUserId(),
					'from_delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId(),
					'forward_message'                   => substr($message, 0, 500)
				]);
			} catch(\Exception $e) {
				$msg = $this->handleUnexpectedError($e);
				if ($forward_to == 'user') {
					$errors[] = "{$user['person_firstname']} {$user['person_lastname']}";
				} else {
					$errors[] = $user['email_address'];
				}
			}
		}

		if (!$success) {
			return [
				'success' => false,
				'error'   => $msg
			];
		} else {
			return [
				'success' => true,
				'errors'  => $errors
			];
		}
	}

	public function getPreviewForTheService($integration_package_id = null, $properties = null, $page = null, $pageSize = null) {
		if (!$integration_package_id || !$properties) {
			return false;
		}
		$properties = json_decode($properties);

		return $this->invoiceGateway->getPreviewForTheImport($integration_package_id, $properties, $page, $pageSize);
	}

	public function markInvoiceAsSent($invoices = []) {

		if (count($invoices) == 0) {
			return false;
		}

		$userProfileId = $this->securityService->getUserId();

		return $this->invoiceGateway->markAsSent($userProfileId, $invoices);

	}

	/**
	 * This changes the invoice status to process for payment
	 */
	public function processPayment($invoice_id) {
		$errors = [];
		$this->invoiceGateway->beginTransaction();
		
		try {
			// Change the invoice status
			$this->invoiceGateway->update([
				'invoice_id'     => $invoice_id,
				'invoice_status' => 'saved'
			]);

			$approvetype_id = $this->approveTypeGateway->getIdByName('SELF APPROVED');

			$approve = new \NP\workflow\ApproveEntity([
				'table_name'                   => 'invoice',
				'tablekey_id'                  => $invoice_id,
				'userprofile_id'               => $this->securityService->getUserId(),
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId(),
				'approve_message'              => 'This invoice has been processed.',
				'approvetype_id'               => $approvetype_id,
				'transaction_id'               => $this->approveGateway->currentId()
			]);

			$errors = $this->entityValidator->validate($approve);
			if (!count($errors)) {
				$this->approveGateway->save($approve);
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


	protected function processLinkedPoLines($lines) {
		$pos = [];

		// Loop through all lines to identify the lines that we need to deal with
		// and group them by PO
		foreach ($lines as $line) {
			if ($line['link_method'] !== null && $line['reftablekey_id'] !== null) {
				if (!array_key_exists($line['purchaseorder_id'], $pos)) {
					$pos[$line['purchaseorder_id']] = [];
				}
				$pos[$line['purchaseorder_id']][] = $line;
			}
		}

		// Loop through POs that are linked
		foreach ($pos as $purchaseorder_id=>$lines) {
			// Loop through each invoice line linked to a PO
			foreach ($lines as $invoiceitem) {
				// Get the link method and invoice_id (all invoice lines for a link will have the same value)
				$link_method = $invoiceitem['link_method'];
				$invoice_id  = $invoiceitem['invoice_id'];

				// Get linked PO line
				$poitem  = $this->poItemGateway->findById($invoiceitem['reftablekey_id']);

				// Get the difference in quantity
				$qtyDiff = $poitem['poitem_quantity'] - $invoiceitem['invoiceitem_quantity'];

				// If the invoice line has less items than the PO, we need to do a split
				if ($qtyDiff > 0 && $poitem['poitem_isReceived'] != 1) {
					// Update the original line quantity and link it to invoice item
					$newQty      = $invoiceitem['invoiceitem_quantity'];
					$newAmount   = ($poitem['poitem_amount'] / $poitem['poitem_quantity']) * $newQty;
					$newTax      = ($poitem['poitem_salestax'] / $poitem['poitem_quantity']) * $newQty;
					$newShipping = ($poitem['poitem_shipping'] / $poitem['poitem_quantity']) * $newQty;

					$this->poItemGateway->update([
						'poitem_id'       => $poitem['poitem_id'],
						'poitem_quantity' => $newQty,
						'poitem_amount'   => $newAmount,
						'poitem_salestax' => $newTax,
						'poitem_shipping' => $newShipping,
						'poitem_split'    => 1,
						'reftable_name'   => 'invoiceitem',
						'reftablekey_id'  => $invoiceitem['invoiceitem_id']
					]);

					// We want to create a split line with the remaining quantity,
					// so we clear a few fields and add the quantity
					$poitem['poitem_id']         = null;
					$poitem['poitem_amount']     = $poitem['poitem_amount'] - $newAmount;
					$poitem['poitem_salestax']   = $poitem['poitem_salestax'] - $newTax;
					$poitem['poitem_shipping']   = $poitem['poitem_shipping'] - $newShipping;
					$poitem['poitem_quantity']   = $qtyDiff;
					$poitem['poitem_split']      = 1;
					$poitem['reftable_name']     = null;
					$poitem['reftablekey_id']    = null;

					// Save split line with remaining quantity
					$poItemEntity = new \NP\po\PoItemEntity($poitem);

					$this->poItemGateway->insert($poItemEntity);
				}
			}

			// Associate the invoice and PO if needed
			$relation = $this->invoicePoRelationGateway->find(
				['Invoice_Id'=>'?', 'PurchaseOrder_Id'=>'?'],
				[$invoice_id, $purchaseorder_id]
			);

			if (!count($relation)) {
				$this->invoicePoRelationGateway->insert([
					'Invoice_Id'           => $invoice_id,
					'PurchaseOrder_Id'     => $purchaseorder_id,
					'InvoicePORelation_DT' => \NP\util\Util::formatDateForDB()
				]);
			}

			// If we've chosen to close the PO, cancel all open lines
			if ($link_method == 'close') {
				// Get open PO lines
				$poLines = $this->poItemGateway->findUnlinkedLines($purchaseorder_id, ['poitem_id']);

				// Loop through lines and cancel each one
				foreach ($poLines as $poLine) {
					$this->cancelLine($poLine['poitem_id']);
				}
			}
		}
	}
}

?>