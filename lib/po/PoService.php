<?php

namespace NP\po;

use NP\shared\AbstractEntityService;
use NP\core\db\Expression;
use NP\budget\BudgetService;
use NP\property\FiscalCalService;
use NP\image\ImageService;
use NP\jobcosting\JobCostingService;
use NP\vendor\VendorService;
use NP\shared\CustomFieldService;

/**
 * Service class for operations related to Purchase Orders
 *
 * @author Thomas Messier
 */
class PoService extends AbstractEntityService {
	protected $type = 'po';
	protected $customFieldService;

	public function __construct(FiscalCalService $fiscalCalService,
								BudgetService $budgetService, ImageService $imageService,
								JobCostingService $jobCostingService, VendorService $vendorService,
								CustomFieldService $customFieldService) {
		parent::__construct($fiscalCalService, $budgetService, $imageService, $jobCostingService, $vendorService);

		$this->customFieldService = $customFieldService;
	}

	public function get($purchaseorder_id, $combineSplit=false) {
		$po = $this->purchaseOrderGateway->findPo($purchaseorder_id);

		$po['accounting_period'] = $this->fiscalCalService->getAccountingPeriod($po['property_id'])->format('Y-m-d');

		$po['is_service_vendor'] = $this->pnCustomFieldDataGateway->isServiceVendor($po['vendor_id']);
		$po['service_fields']    = $this->pnCustomFieldDataGateway->findPoServiceFields($po['purchaseorder_id']);

		if ($this->configService->get('pn.jobcosting.jobcostingEnabled', '0') == '1') {
			$po['inactive_contracts'] = $this->jbContractGateway->findInactiveContractInEntity('purchaseorder', $purchaseorder_id);
			$po['inactive_jobs']      = $this->jbJobCodeGateway->findInactiveJobInEntity('purchaseorder', $purchaseorder_id);
		} else {
			$po['inactive_contracts'] = [];
			$po['inactive_jobs'] = [];
		}

		// If invoice is for approval, let's check if the current user is an approver
		if ($po['purchaseorder_status'] == 'forapproval') {
			$po['is_approver'] = $this->purchaseOrderGateway->isApprover(
				$purchaseorder_id,
				$this->securityService->getUserId()
			);
		} else {
			$po['is_approver'] = false;
		}

		// Checks if user has optional workflow rule for the property
		$po['has_optional_rule'] = $this->wfRuleGateway->hasOptionalRule(
			$po['property_id'],
			$this->securityService->getUserId()
		);

		// Get invoice images
		/*** THIS QUERY IS RUNNING SLOW ***/
		$po['image'] = $this->imageIndexGateway->findEntityImages($purchaseorder_id, 'Purchase Order', true);
		
		// Check if there are any schedules if invoice is a draft
		if ($po['purchaseorder_status'] == 'draft') {
			$res = $this->recurringSchedulerGateway->find([
				'table_name'      => "'purchaseorder'",
				'tablekey_id'     => '?',
				'schedule_status' => "'active'"
			], [$purchaseorder_id]);

			$po['schedule_exists'] = (count($res)) ? true : false;
		}

		$po['lines'] = $this->poItemGateway->findLines($purchaseorder_id, $combineSplit);

		// If status is 'closed', determine if PO is cancelled or invoiced
		$po['is_cancelled'] = 0;
		if ($po['purchaseorder_status'] == 'closed') {
			$po['is_cancelled'] = 1;
			foreach ($po['lines'] as $line) {
				if (
					$line['reftable_name'] == 'invoiceitem'
					&& !empty($line['reftablekey_id'])
					&& $line['reftablekey_id'] > 0
				) {
					$po['is_cancelled'] = 0;
					break;
				}
			}
		}

		// Get invoice warnings
		/*** THIS QUERY IS RUNNING SLOW ***/
		$po['warnings'] = $this->getWarnings($po);

		$po['rejection_notes'] = $this->getRejectionNotes($purchaseorder_id);

		return $po;
	}

	/**
	 * Get all warnings for an invoice; can do it using either an invoice record or an invoice ID.
	 * Using an invoice record makes it so some queries don't need to be run
	 *
	 * @param  array $po               An record from the INVOICE database table
	 * @param  int   $purchaseorder_id An ID for a record in the INVOICE table
	 * @return array                   An array of warnings
	 */
	public function getWarnings($po=null, $purchaseorder_id=null) {
		// If no invoice record was provided, get one using the ID
		if ($po === null) {
			$po = $this->purchaseOrderGateway->findById($purchaseorder_id);
		}

		$warnings = [];

		$warningTypes = ['Job','VendorInsurance','VendorInactive'];

		foreach ($warningTypes as $warningType) {
			$fn = "get{$warningType}Warning";
			$warning = $this->$fn($po, $purchaseorder_id);
			if ($warning !== null) {
				$warnings[] = $warning;
			}
		}

		return $warnings;
	}

	/**
	 * 
	 */
	public function generatePoRef($purchaseorder_id, $period, $property_id) {
		$parts = [
			strtolower($this->configService->get('PN.POOptions.PORefFormulaA')),
			strtolower($this->configService->get('PN.POOptions.PORefFormulaB')),
			strtolower($this->configService->get('PN.POOptions.PORefFormulaC')),
			strtolower($this->configService->get('PN.POOptions.PORefFormulaD'))
		];

		$delimiter = $this->configService->get('PN.POOptions.PORefFormulaDelimiter');

		$property = $this->propertyGateway->findSingle(
			'pr.property_id = ?',
			[$property_id],
			['property_id_alt','property_id_alt_ap']
		);

		$period = \DateTime::createFromFormat(\NP\util\Util::getServerDateFormat(), $period);

		$adjustedId = $this->purchaseOrderGateway->findValue(
		    null,
		    [],
		    ['max_id'=>new Expression('max(purchaseorder_id)')]
		);

		$control = $this->purchaseOrderControlGateway->findSingle('property_id = ?', [$property_id]);
		if ($control === null) {
			$this->purchaseOrderControlGateway->insert([
				'property_id'         => $property_id,
				'current_period'      => \NP\util\Util::formatDateForDB($period),
				'purchaseorder_count' => 1
			]);
			$smallAdjustedId = 1;
		} else {
			$comparePeriod = \DateTime::createFromFormat(\NP\util\Util::getServerDateFormat(), $control['current_period']);
			
			if ($comparePeriod == $period) {
				$smallAdjustedId = $control['purchaseorder_count'] + 1;
			} else {
				$smallAdjustedId = 1;
			}

			$this->purchaseOrderControlGateway->update([
				'purchaseordercontrol_id' => $control['purchaseordercontrol_id'],
				'current_period'          => \NP\util\Util::formatDateForDB($period),
				'purchaseorder_count'     => $smallAdjustedId
			]);
		}

		if ($smallAdjustedId >= 100 && $smallAdjustedId < 360) {
			$smallAdjustedId = chr(55+$id/10) . (string)($id-100) % 10;
		} else {
			$smallAdjustedId = (string)$smallAdjustedId;
		}

		$ref = '';		
		foreach ($parts as $i=>$part) {
			if (!empty($part)) {
				if ($i > 0) {
					$ref .= $delimiter;
				}
				if ($part == 'standard') {
					$ref .= (string)$purchaseorder_id;
				} else if ($part == 'propertycode') {
					$ref .= $property['property_id_alt'];
				} else if ($part == 'appropertycode') {
					$ref .= $property['property_id_alt_ap'];
				} else if ($part == 'accountingperiod') {
					$ref .= $period->format('mY');
				} else if ($part == 'accountingperiod2') {
					$ref .= $period->format('my');
				} else if ($part == 'adjustedid') {
					$ref .= $adjustedId;
				} else if ($part == 'smalladjustedid') {
					$ref .= $smallAdjustedId;
				} else {
					$ref .= $part;
				}
			}
		}

		$this->purchaseOrderGateway->update([
			'purchaseorder_id'  => $purchaseorder_id,
			'purchaseorder_ref' => $ref
		]);
	}

	/**
	 * Get list of POs to approve
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
	public function getPosToApprove($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->purchaseOrderGateway->findPosToApprove($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get list of released POs
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
	public function getPosReleased($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->purchaseOrderGateway->findPosReleased($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get list of user's POs
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
	public function getPosByUser($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->purchaseOrderGateway->findPosByUser($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get list of user's POs
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
	public function getPosRejected($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		return $this->purchaseOrderGateway->findPosRejected($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	public function rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod) {
		$this->purchaseOrderGateway->beginTransaction();

		try {
			// Roll PO lines
			$this->poItemGateway->rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod);
			
			// Roll POs
			$this->purchaseOrderGateway->rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod);

			// Create new budgets if needed
			$this->budgetService->createMissingBudgets('po');

			// If dealing with a new year, update the GLACCOUNTYEAR records
			if ($newAccountingPeriod->format('Y') != $oldAccountingPeriod->format('Y')) {
				$this->budgetService->activateGlAccountYear($newAccountingPeriod->format('Y'));
			}

			$this->purchaseOrderGateway->commit();
		} catch(\Exception $e) {
			$this->purchaseOrderGateway->rollback();
		}
	}

	/**
	 * Retrieve order's PO's
	 *
	 * @param null $vendorsite_id
	 * @param null $property_id
	 * @return mixed
	 */
	public function getOrderPOs($vendorsite_id = null, $property_id = null) {
		$result = $this->purchaseOrderGateway->getOrderPOs($vendorsite_id, $property_id);

		return $result;
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
	public function getPoRegister($tab, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$method = 'find'.ucfirst($tab).'Pos';

		return $this->purchaseOrderGateway->$method($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	/**
	 * Get a formatted bill to/ship to address
	 */
	public function getShipToBillToAddress($property_id, $isNexusService=false, $vendor_id=null) {
		$property = $this->propertyGateway->findById($property_id);

		$val = '';

		if (!empty($property['address_attn'])) {
			$val = "{$property['address_attn']}\n";
		}

		$val .= $property['property_name'];

		if ($isNexusService) {
			$vendor_id_alt = $this->vendorGateway->findValue('v.vendor_id = ?', [$vendor_id], 'vendor_id_alt');
			$val .= "\nNXS #: {$vendor_id_alt} - {$property['property_id_alt']}";
		}

		$address = \NP\contact\AddressEntity::getFullAddress($property, $this->countryGateway);

		$val .= "\n{$address}";

		return $val;
	}

	/**
	 * Get lines on a PO that are linkable to an invoice
	 */
	public function getLinkableLines($purchaseorder_id) {
		// Check if receipt is required on the PO
		$receiptRequired = $this->purchaseOrderGateway->findValue(
			'p.purchaseorder_id = ?',
			[$purchaseorder_id],
			'purchaseorder_rct_req'
		);

		// If receipt required isn't set on PO for some reason, use default setting
		if ($receiptRequired === null) {
			$receiptRequired = $this->configService->get('CP.RECEIVING_DEFAULT', '0');
		}

		return $this->poItemGateway->findPoLinkableLines($purchaseorder_id, $receiptRequired);
	}

	/**
	 * Do final review for a PO
	 */
	public function doFinalReview($purchaseorder_id) {
		$errors         = [];
		$now            = \NP\util\Util::formatDateForDB();
		$userprofile_id = $this->securityService->getUserId();

		$this->purchaseOrderGateway->beginTransaction();

		try {
			// Update the PO record
			$this->purchaseOrderGateway->update([
				'purchaseorder_id'                           => $purchaseorder_id,
				'purchaseorder_rct_canReceive'               => 1,
				'purchaseorder_rct_req'                      => 1,
				'purchaseorder_rct_canReceive_userprofileID' => $userprofile_id,
				'purchaseorder_rct_canReceive_dt'            => $now
			]);

			$approvetype_id = $this->approveTypeGateway->getIdByName('final review');

			$approve = new \NP\workflow\ApproveEntity([
				'table_name'                   => $this->table,
				'tablekey_id'                  => $purchaseorder_id,
				'userprofile_id'               => $userprofile_id,
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId(),
				'approve_message'              => 'This Purchase Order has been marked final review.',
				'approvetype_id'               => $approvetype_id,
				'transaction_id'               => $this->approveGateway->currentId()
			]);

			$errors = $this->entityValidator->validate($approve);
			if (!count($errors)) {
				$this->approveGateway->save($approve);
			} else {
				$this->loggingService->log('error', 'Error validating approve entity while doing final review', $errors);
				throw new \NP\core\Exception('Error doing final review on PO');
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->purchaseOrderGateway->rollback();
		} else {
			$this->purchaseOrderGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Cancels a PO
	 */
	public function cancelPo($purchaseorder_id) {
		$errors = [];
		$now    = \NP\util\Util::formatDateForDB();

		$this->poItemGateway->beginTransaction();

		try {
			// Cancel PO item records
			$this->poItemGateway->update(
				[
					'reftable_name'  => 'invoiceitem',
					'reftablekey_id' => 0
				],
				'purchaseorder_id = ? AND reftable_name IS NULL AND reftablekey_id IS NULL',
				[$purchaseorder_id]
			);

			$approvetype_id = $this->approveTypeGateway->getIdByName('cancelled');

			$approve = new \NP\workflow\ApproveEntity([
				'table_name'                   => $this->table,
				'tablekey_id'                  => $purchaseorder_id,
				'userprofile_id'               => $this->securityService->getUserId(),
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId(),
				'approve_message'              => 'PO was cancelled',
				'approvetype_id'               => $approvetype_id,
				'approve_status'               => 'inactive',
				'transaction_id'               => $this->approveGateway->currentId()
			]);

			$errors = $this->entityValidator->validate($approve);
			if (!count($errors)) {
				$this->approveGateway->save($approve);
			} else {
				$this->loggingService->log('error', 'Error validating approve entity while cancelling PO', $errors);
				throw new \NP\core\Exception('Error cancelling PO');
			}

			if (!count($errors)) {
				$linkedItems = $this->poItemGateway->findLinkedItems($purchaseorder_id);
				if (!count($linkedItems)) {
					// If there are no more linked items, cancel the PO
					$this->purchaseOrderGateway->update([
						'purchaseorder_id'     => $purchaseorder_id,
						'purchaseorder_status' => 'closed'
					]);
				}
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->poItemGateway->rollback();
		} else {
			$this->poItemGateway->commit();
		}
		
		return [
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		];
	}

	/**
	 * Cancels a line on a PO
	 */
	public function restoreLine($poitem_id) {
		$errors = [];
		$now    = \NP\util\Util::formatDateForDB();
		$this->poItemGateway->beginTransaction();
		
		try {
			$poitem = $this->poItemGateway->findSingle(
				'poitem_id = ?',
				[$poitem_id],
				['purchaseorder_id','property_id','glaccount_id']
			);
			
			$period = $this->fiscalCalService->getAccountingPeriod($poitem['property_id']);

			$this->poItemGateway->update([
				'poitem_id'      => $poitem_id,
				'reftable_name'  => null,
				'reftablekey_id' => null,
				'poitem_period'  => \NP\util\Util::formatDateForDB($period)
			]);
			
			$unlinked = $this->poItemGateway->findUnlinkedItems($poitem['purchaseorder_id']);
			$status = (count($unlinked) == 0) ? 'closed' : 'saved';

			$this->purchaseOrderGateway->update([
				'purchaseorder_id'     => $poitem['purchaseorder_id'],
				'purchaseorder_status' => $status
			]);

			$approvetype_id = $this->approveTypeGateway->getIdByName('restored');

			$approve = new \NP\workflow\ApproveEntity([
				'table_name'                   => $this->table,
				'tablekey_id'                  => $poitem['purchaseorder_id'],
				'userprofile_id'               => $this->securityService->getUserId(),
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId(),
				'approve_message'              => 'PO Line was restored',
				'approvetype_id'               => $approvetype_id,
				'transaction_id'               => $this->approveGateway->currentId()
			]);

			$errors = $this->entityValidator->validate($approve);
			if (!count($errors)) {
				$this->approveGateway->save($approve);
			} else {
				$this->loggingService->log('error', 'Error validating approve entity while restoring PO line', $errors);
				throw new \NP\core\Exception('Error restoring PO line');
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->poItemGateway->rollback();
		} else {
			$this->poItemGateway->commit();
		}
		
		return array(
			'success'              => (count($errors)) ? false : true,
			'errors'               => $errors,
			'purchaseorder_status' => $status
		);
	}

	/**
	 * Releases a PO
	 */
	public function releasePo($purchaseorder_id) {
		$errors = [];
		$now    = \NP\util\Util::formatDateForDB();
		$this->purchaseOrderGateway->beginTransaction();
		
		try {
			// Set the PO data that needs to be updated
			$data = [
				'purchaseorder_id'     => $purchaseorder_id,
				'purchaseorder_status' => 'saved'
			];

			$vendorPortalFlag = $this->configService->get('CP.VENDORPORTAL_PO_AUTOSENDTOPORTAL', '0');
			if ($vendorPortalFlag == 1) {
				$data['sent_vendor_portal_flag'] = 1;

				$this->vendorAccessInvoicePoLogGateway->insert([
					'tablekey_id'    => $purchaseorder_id,
					'status_type_id' => 10,
					'log_datetm'     => $now
				]);
			}

			// Update the PO record
			$this->purchaseOrderGateway->update($data);

			// Add approve record
			$approvetype_id = $this->approveTypeGateway->getIdByName('self approved');

			$approve = new \NP\workflow\ApproveEntity([
				'table_name'                   => $this->table,
				'tablekey_id'                  => $purchaseorder_id,
				'userprofile_id'               => $this->securityService->getUserId(),
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId(),
				'approve_message'              => 'This Purchase Order has been released.',
				'approvetype_id'               => $approvetype_id,
				'transaction_id'               => $this->approveGateway->currentId()
			]);

			$errors = $this->entityValidator->validate($approve);
			if (!count($errors)) {
				$this->approveGateway->save($approve);
			} else {
				$this->loggingService->log('error', 'Error validating approve entity while doing final review', $errors);
				throw new \NP\core\Exception('Error doing final review on PO');
			}

			// Add status alert so email gets sent to creator if they have this email alert on
			if (!count($errors)) {
				$this->notificationService->addStatusAlert($purchaseorder_id, 'Status Alert: PO Released');
			}

			$this->sendPoToVendor($purchaseorder_id);
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->purchaseOrderGateway->rollback();
		} else {
			$this->purchaseOrderGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Sends the PO to its vendor if appropriate, using the chosen method (electronic or email)
	 */
	public function sendPoToVendor($purchaseorder_id) {
		// Get PO info
		$po = $this->purchaseOrderGateway->findById($purchaseorder_id);

		// Make sure you only send if PO is released
		if ($po['purchaseorder_status'] == 'saved') {
			// Check if PO is valid to be sent electronically
			$vc_id = $this->getElectronicPoCatalog($purchaseorder_id);
			// If we get a valid catalog ID, we can electronically submit
			if ($vc_id !== null) {
				return $this->sendPoElectronically($purchaseorder_id, $vc_id);
			}
			// Else, we need to check if we can submit by email (this will only run if electronic
			// submission above didn't happen)
			else {
				$emailPo = $this->configService->get('PN.VendorOptions.autoEmail', '0');
				if ($emailPo != 1) {
					$emailPo = $this->pnCustomFieldDataGateway->findCustomFieldValue('auto_email_po', $po['vendor_id']);
					$emailPo = ($emailPo == 'on') ? 1 : 0;
				}
				
				// If settings support emailing PO to vendor, send the email
				if ($emailPo == 1) {
					return $this->sendPoByEmail($purchaseorder_id);
				}
			}
		}
	}

	public function getElectronicPoCatalog($purchaseorder_id) {
		$po = $this->purchaseOrderGateway->findPoCatalogInfo($purchaseorder_id);
		
		if ($po['total_lines'] != $po['total_catalog_lines']) {
			return null;
		}

		$electronicPoSubmit = $this->pnCustomFieldDataGateway->findCustomFieldValue('po_electronic_submit', $po['vendor_id']);
		if ($electronicPoSubmit != 'on') {
			return null;
		}

		$vc_id = $this->vcGateway->findCatalogForPoSubmit($po['vendor_id'], $po['property_id']);

		return $vc_id;
	}

	public function sendPoElectronically($purchaseorder_id, $vc_id) {
		// Define the path of the XML file that will be used as a template
		$appRoot = $this->configService->getAppRoot();
		$xmlPath = $appRoot . '/lib/catalog/punchout/posubmit.php';
		$lineXmlPath = $appRoot . '/lib/catalog/punchout/posubmit_lines.php';

		// Define some local variables to be used by the XML file
		$now = new \DateTime();
		$payloadID = $now->format('YMd') . $now->format('His') . time();
		$timestamp = $now->format('Y-M-d') . $now->format('H:i:s') . '-05:00';

		$deploymentMode = ($this->configService->getConfig('serverType') == 'prod') ? 'prod' : 'test';

		$lines        = $this->getEntityLines($purchaseorder_id, true);
		$itemXml      = '';
		$total_amount = 0;
		$tax_amount   = 0;
		$ship_amount  = 0;
		foreach ($lines as $lineNumber=>$line) {
			// Place all line data into local vars for use in the template include
			foreach ($line as $key=>$value) {
				$$key = $value;
			}

			// Apply special formatting to some values
			$poitem_quantity        = str_replace('.00', '', $poitem_quantity);
			$poitem_unitprice       = number_format($poitem_unitprice, 2);
			$poitem_description     = htmlspecialchars($poitem_description);
			$poitem_description_alt = htmlspecialchars($poitem_description_alt);

			// Include the XML template
			$itemXml .= include $lineXmlPath;

			$total_amount += $line['poitem_amount'];
			$tax_amount   += $line['poitem_salestax'];
			$ship_amount  += $line['poitem_shipping'];
		}

		// Get PO info for use in the template
		$po   = $this->purchaseOrderGateway->findById($purchaseorder_id);
		$vc   = $this->vcGateway->findById($vc_id);
		$user = $this->userprofileGateway->findById($po['userprofile_id']);

		// Place all PO, catalog, and user data in local vars for use in the template include 
		foreach ($po as $key=>$value) {
			$$key = $value;
		}

		foreach ($vc as $key=>$value) {
			$$key = $value;
		}

		foreach ($user as $key=>$value) {
			$$key = $value;
		}

		// Apply special formatting to some values
		$total_amount = number_format($total_amount);
		$tax_amount = number_format($tax_amount);
		$ship_amount = number_format($ship_amount);

		// Add some additional local values
		$client_short_name = $this->configService->get('PN.Main.ClientShortName');
		$phone = '';
		$phone_area = '';
		if (!empty($user['work_number'])) {
			$phone = preg_replace('/[^\d]/', '', $user['work_number']);
			if (strlen($phone) == 10) {
				$phone_area = substr($phone, 0, 3);
				$phone = substr($phone, -7);
			} else {
				$phone = '';
			}
		}

		$billProperty = $this->propertyGateway->findById($po['property_id']);
		$bill_address_street = $billProperty['address_line1'];
		if (!empty($billProperty['address_line2'])) {
			$bill_address_street .= "\n{$billProperty['address_line2']}";
		}

		$bill_address_city  = $billProperty['address_city'];
		$bill_address_state = $billProperty['address_state'];
		$bill_zip = $billProperty['address_zip'];
		if (!empty($billProperty['address_zipext'])) {
			$bill_zip .= $billProperty['address_zipext'];
		}

		$shipProperty = $this->propertyGateway->findById($po['Purchaseorder_ship_propertyID']);
		$ship_address_street = $shipProperty['address_line1'];
		if (!empty($shipProperty['address_line2'])) {
			$ship_address_street .= "\n{$shipProperty['address_line2']}";
		}

		$ship_address_city  = $shipProperty['address_city'];
		$ship_address_state = $shipProperty['address_state'];
		$ship_zip   = $shipProperty['address_zip'];
		if (!empty($shipProperty['address_zipext'])) {
			$ship_zip .= $shipProperty['address_zipext'];
		}
		
		// Include the XML file and store results in a string
		$xmlRequest = include $xmlPath;

		// Do the HTTP POST
		$response = \NP\util\Util::httpRequest($vc['vc_posubmit_url'], 'POST', $xmlRequest, array(
            "Content-type: text/xml;charset=\"utf-8\"",
            "Cache-Control: no-cache",
            "Pragma: no-cache",
            "Content-length: ".strlen($xmlRequest)
        ));

		// Initialize some variables
		$success = $response['success'];
		$errorMsg = null;

		// If HTTP request was successful, proceed
		if ($success) {
			// Create an XML object with the content of the HTTP request
			$punchoutXML = simplexml_load_string($response['content']);

			// If the content of the request is not XML, log the error
			if (!$punchoutXML) {
				$success = false;
				$errors = libxml_get_errors();
				$errorMsg .= "HTTP request content was as follows:\n{$response['content']}";
			    $this->loggingService->log('catalog', $errorMsg);
			    libxml_clear_errors();
			// If the content of the request is valid XML, proceed
			} else {
				// Get the Status node from the XML document
				$status = $punchoutXML->xpath('/cXML/Response/Status');
				// If the Status node is not found, then the cXML is not valid, log the error 
				if (!count($status)) {
					$success = false;
					$errorMsg .= "Invalid cXML, Status node was not found. cXML was as follows:\n{$response['content']}";
					$this->loggingService->log('catalog', $errorMsg);
				// If the Status node is found, proceed
				} else {
					// Get the status code from the Status node
					$status = $status[0];
					$statusCode = $status->xpath('//@code');
					$statusCode = (string)$statusCode[0];

					// If the code returned is 200, proceed
					if ($statusCode == '200') {
						// Request succeeded, log that the PO was sent
						$this->invoicePoForwardGateway->insert([
							'table_name'                        => 'povendor',
							'tablekey_id'                       => $purchaseorder_id,
							'forward_to_email'                  => 'Electronically Submitted',
							'forward_to_userprofile_id'         => $po['vendor_id'],
							'forward_from_userprofile_id'       => $po['userprofile_id'],
							'forward_message'                   => null
						]);
					// If the code returned is not 200, log the error
					} else {
						// Get an error message and/or error details from the cXML
						$success = false;
						$error = $status->xpath('//@text');
						$error = (string)$error[0];
						$errorDetails = (string)$status;
						
						$errorMsg .= "Error: {$error};";
						if ($errorDetails !== '') {
							$errorMsg .= "\nError Details: {$errorDetails}";
						}
						$this->loggingService->log('catalog', $errorMsg);
					}
				}
			}
		// If HTTP Request failed, log the error
		} else {
			$errorMsg .= "Connection failed. This is the connection error: {$response['error']}";
			$this->loggingService->log('catalog', $errorMsg);
		}

		// If there was any error, we need to send some emails
		if (!empty($errorMsg) && $deploymentMode !== 'dev') {
			$errorHtml = "
				<tr>
					<td><b>PO #:</b></td>
					<td>{$po['purchaseorder_ref']}</td>
				</tr>
				<tr>
					<td><b>Vendor:</b></td>
					<td>{$po['vendor_name']} ({$po['vendor_id_alt']})</td>
				</tr>
				<tr>
					<td><b>{$this->configService->get('PN.Main.PropertyLabel')}:</b></td>
					<td>{$po['property_name']}</td>
				</tr>
				<tr>
					<td><b>Error:</b></td>
					<td>{$errorMsg}</td>
				</tr>
			";
			
			$subject = "PO #{$po['purchaseorder_ref']} failed to transfer to vendor";

			if (filter_var($user['email_address'], FILTER_VALIDATE_EMAIL)) {
				$this->notificationService->sendEmail(
					"
						A PO could not be transferred to the vendor. If you have not already done so, try manually re-submitting it.
						If the error persists, please contact customer support.
						<br /><br />
						Details on the error are as follows:
						<table>
						{$errorHtml}
						</table>
					",
					$this->configService->get('PN.Main.FromEmail'),
					$user['email_address'],
					$subject
				);
			}

			$message = "
					<table>
					<tr>
						<td><b>Client Site:</b></td>
						<td>{$this->configService->getLoginUrl()}</td>
					</tr>
					<tr>
						<td><b>PO Creator:</b></td>
						<td>{$user['person_firstname']} {$user['person_lastname']} ({$user['userprofile_username']})</td>
					</tr>
					{$errorHtml}
			";

			if (!filter_var($user['email_address'], FILTER_VALIDATE_EMAIL)) {
				$message .= "
					<tr>
						<td><b>NOTE:</b></td>
						<td>The creator of the PO was NOT notified of this error since he/she does not have an email address setup.</td>
					</tr>
				";
			}

			$this->notificationService->sendEmail(
				$message,
				'noreply@nexussystems.com',
				'customersupport@nexussystems.com',
				$subject
			);
		}

		// Return the results of the operation
		return ['success' => $success];
	}

	public function forwardToVendor($purchaseorder_id, $sender_email, $forward_to, $forward_val, $message, $includes=[]) {
		$user         = $this->userprofileGateway->findById($this->securityService->getUserId());
		$contactPhone = (!empty($user['work_number'])) ? $user['work_number'] : 'n/a';
		$contactEmail = (!empty($user['email_address'])) ? $user['email_address'] : 'n/a';

		// Add standard text to the email message
		$message .= "\n\nFor any questions regarding this PO, please contact the following:\n\n" .
					"{$user['person_firstname']} {$user['person_lastname']}\n" .
					"Phone: {$contactPhone}\n" .
					"Email: {$contactEmail}";

		// Forward the PO
		return $this->forwardEntity(
			$purchaseorder_id,
			$sender_email,
			$forward_to,
			$forward_val,
			$message,
			$includes,
			'povendor'
		);
	}

	public function sendPoByEmail($purchaseorder_id) {
		$po     = $this->purchaseOrderGateway->findById($purchaseorder_id);
		$vendor = $this->vendorGateway->getVendor($po['vendor_id']);

		// If vendor has a valid email, proceed
		if (filter_var($vendor['email_address'], FILTER_VALIDATE_EMAIL)) {
			// Get user info
			$user = $this->userprofileGateway->findById($po['userprofile_id']);
			
			// If PO creator has valid email, use it as the 
			if (filter_var($user['email_address'], FILTER_VALIDATE_EMAIL)) {
				$sender_email = $user['email_address'];
			} else {
				$sender_email = $this->configService->get('PN.Main.FromEmail');
			}

			// Send the PO to the vendor
			$this->forwardToVendor(
				$purchaseorder_id,
				$sender_email,
				'email',
				$vendor['email_address'],
				'This PO was automatically sent.'
			);

			return true;
		} else {
			return false;
		}
	}
}

?>