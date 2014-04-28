<?php

namespace NP\po;

use NP\shared\AbstractEntityService;
use NP\core\db\Expression;

/**
 * Service class for operations related to Purchase Orders
 *
 * @author Thomas Messier
 */
class PoService extends AbstractEntityService {
	protected $type = 'po';

	public function get($purchaseorder_id) {
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
			$po['has_optional_rule'] = $this->wfRuleGateway->hasOptionalRule(
				$po['property_id'],
				$this->securityService->getUserId()
			);
		} else {
			$po['is_approver'] = false;
		}

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

		$po['lines'] = $this->poItemGateway->findLines($purchaseorder_id);

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
}

?>