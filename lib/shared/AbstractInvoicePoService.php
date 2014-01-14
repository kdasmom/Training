<?php

namespace NP\shared;

use NP\core\AbstractService;
use NP\core\db\Expression;
use NP\security\SecurityService;
use NP\budget\BudgetService;
use NP\property\FiscalCalService;

/**
 * Service class for operations related to both Invoices and POs, to be extended by both the PO and Invoice class
 *
 * @author Thomas Messier
 */
Abstract class AbstractInvoicePoService extends AbstractService {

	/**
	 * You must override this and set it to "po" or "invoice"
	 */
	protected $type;

	protected $table, $itemTable, $pkField, $itemPkField, $configService, $securityService, 
			$fiscalCalService, $budgetService;
	
	public function __construct(FiscalCalService $fiscalCalService,
								BudgetService $budgetService) {
		$this->fiscalCalService = $fiscalCalService;
		$this->budgetService    = $budgetService;

		if ($this->type === 'invoice') {
			$this->table       = 'invoice';
			$this->title       = 'Invoice';
			$this->itemTable   = 'invoiceitem';
			$this->gateway     = $this->table;
			$this->itemGateway = 'invoiceItem';
		} else if ($this->type === 'po') {
			$this->table       = 'purchaseorder';
			$this->title       = 'Purchase Order';
			$this->itemTable   = 'poitem';
			$this->gateway     = 'purchaseOrder';
			$this->itemGateway = 'poItem';
		} else if ($this->type === 'receipt') {
			$this->table       = 'receipt';
			$this->title       = 'Receipt';
			$this->itemTable   = 'rctitem';
			$this->gateway     = $this->table;
			$this->itemGateway = 'rctItem';
		} else {
			throw new \NP\core\Exception('Invalid value for the $type property. It must be set to either "invoice" or "po"');
		}
		
		$this->tableAlias     = substr($this->type, 0, 1);
		$this->itemTableAlias = "{$this->tableAlias}i";
		$this->pkField        = strtolower($this->table) . '_id';
		$this->itemPkField    = strtolower($this->itemTable) . '_id';
	}
	
	/**
	 * Setter function required by DI to set the config service via setter injection
	 * @param \NP\system\ConfigService $configService
	 */
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

	public function setSecurityService(SecurityService $securityService) {
		$this->securityService = $securityService;
	}

	/**
	 * Get warnings related to Job Costing
	 */
	public function getJobWarning($entity=null, $entity_id=null) {
		if ($entity_id === null) {
			$entity_id = $entity[$this->pkField];
		}

		if ($this->configService->get('pn.jobcosting.jobcostingEnabled', '0') == '1') {
			$jobWarning = false;
			$inactiveJobs = $this->jbJobCodeGateway->findInactiveJobInEntity($this->table, $entity_id);
			if (count($inactiveJobs)) {
				$jobWarning = true;
			}
			if ($this->configService->get('pn.jobcosting.useContracts', '0') == '1') {
				$inactiveContracts = $this->jbContractGateway->findInactiveContractInEntity($this->table, $entity_id);
				if (count($inactiveContracts)) {
					$jobWarning = true;
				}
			} else {
				$inactiveContracts = [];
			}
			if ($jobWarning) {
				return [
					'warning_type'  => 'job',
					'warning_title' => 'Warning!',
					'warning_icon'  => 'alert',
					'warning_data'  => [
						'inactive_jobs'      => $inactiveJobs, 
						'inactive_contracts' => $inactiveContracts
					]
				];
			}
		}

		return null;
	}

	/**
	 * Get warnings related to vendor insurance
	 */
	public function getVendorInsuranceWarning($entity=null, $entity_id=null) {
		if ($entity_id === null) {
			$entity_id = $entity[$this->pkField];
		}

		$res = $this->insuranceGateway->findExpiredInsuranceInfoForEntity($this->table, $entity_id);
		if ($res['expired'] || $res['days_to_expiration'] !== null) {
			return [
				'warning_type'  => 'insuranceExpiration',
				'warning_title' => 'Warning!',
				'warning_icon'  => ($res['expired']) ? 'stop' : 'alert',
				'warning_data'  => $res
			];
		}

		return null;
	}

	/**
	 * Get warnings for a vendor being inactive
	 */
	public function getVendorInactiveWarning($entity=null, $entity_id=null) {
		if ($entity_id === null) {
			$entity_id = $entity[$this->pkField];
		}

		$gateway = "{$this->gateway}Gateway";
		$vendorSiteJoinClass = '\\NP\\' . $this->type . '\\sql\\join\\' . ucfirst($this->type) . 'VendorsiteJoin';

		// Get vendor info for the invoice
		$res = $this->$gateway->find(
			"{$this->tableAlias}.{$this->pkField} = ?", 
			[$entity_id],
			null,
			[],
			null,
			null,
			[
				new $vendorSiteJoinClass(),
				new \NP\vendor\sql\join\VendorsiteVendorJoin()
			]
		);
		$res = $res[0];

		$res['vendor_status'] = strtolower($res['vendor_status']);
		$res['vendorsite_status'] = strtolower($res['vendorsite_status']);
		
		if (!in_array($res['vendor_status'], ['active','approved']) 
			|| !in_array($res['vendorsite_status'], ['active','approved'])
		) {
			return [
				'warning_type'  => 'vendorInactive',
				'warning_title' => 'Warning!',
				'warning_icon'  => 'alert',
				'warning_data'  => []
			];
		}

		return null;
	}

	public function unlinkPoFromInvoice($invoice_id) {
		$this->purchaseOrderGatewayGateway->beginTransaction();
		
		try {
			$this->purchaseOrderGateway->unlinkFromInvoice($invoice_id);
			$this->unlinkAllPoItemsFromInvoice($invoice_id);
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->purchaseOrderGatewayGateway->rollback();
		} else {
			$this->purchaseOrderGatewayGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	public function unlinkAllPoItemsFromInvoice($invoice_id) {
		$this->poItemGateway->unlinkFromInvoice($invoice_id);
	}

	public function unlinkPoItem($poitem_id, $invoiceitem_id=null) {
		$errors = [];
		$this->poItemGateway->beginTransaction();
		
		try {
			// Get PO item info
			$poitem = $this->poItemGateway->findById($poitem_id, ['purchaseorder_id','property_id']);

			$purchaseorder_id = $poitem['purchaseorder_id'];
			$period = $this->fiscalCalService->getAccountingPeriod($poitem['property_id']);

			// Unlink the PO item
			$this->poItemGateway->update(
				[
					'reftable_name'  => null,
					'reftablekey_id' => null,
					'poitem_period'  => \NP\util\Util::formatDateForDB($period)
				],
				['poitem_id' => '?'],
				[$poitem_id]
			);

			// Unlink invoice item
			$this->invoiceItemGateway->update(
				[
					'reftable_name'  => null,
					'reftablekey_id' => null
				],
				['invoiceitem_id' => '?'],
				[$invoiceitem_id]
			);

			// Make sure PO is back in released state and set VendorConnect sent flag
			// back to 'unsent' status in case VendorConnect is used
			$this->purchaseOrderGateway->update([
				'purchaseorder_id'        => $purchaseorder_id,
				'purchaseorder_status'    => 'saved',
				'sent_vendor_portal_flag' => 0
			]);

			// Find linked invoice items
			$invoiceitemLinks = $this->poItemGateway->findLinkByItem($poitem_id, $invoiceitem_id);

			// We want to track any invoices we've already checked for relation so we don't
			// run the same thing twice for the same invoice
			// (it's worth noting this is probably unnecessary, I think usually you will never
			// be able to link a PO line to multiple different invoices, only to multiple
			// different lines for the same invoice, which can happen if a linked invoice line
			// is split)
			$checkedInvoices = [];
			// Loop through linked invoice items
			foreach ($invoiceitemLinks as $itemLink) {
				// If we've already dealt with this invoice, skip it
				if (!array_key_exists($invoice_id, $checkedInvoices)) {
					$invoice_id = $itemLink['invoice_id'];
					$checkedInvoices[$invoice_id] = true;

					// Check if there are any remaining relations between the invoice and PO
					$links = $this->invoiceGateway->findInvoicePoAssociations($invoice_id, $purchaseorder_id);

					// If there are no more invoice item and po items linked between that PO and invoice
					// remove the relationship between the two
					if (!count($links)) {
						$this->invoicePoRelationGateway->delete(
							['invoice_id'=>'?', 'purchaseorder_id'=>'?'],
							[$invoice_id, $purchaseorder_id]
						);
					}
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
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Links a PO item to and vendor connect invoice line
	 *
	 * @param  int $poitem_id
	 * @param  int $invoiceitem_id
	 */
	public function linkPoItemToVendorConnectInvoiceItem($poitem_id, $invoiceitem_id) {
		$this->poItemGateway->update([
			'poitem_id'      => $poitem_id,
			'reftable_name'  => 'vendorinvoiceitem',
			'reftablekey_id' => $invoiceitem_id
		]);
	}

	/**
	 * Allocates tax and shipping for an entity (invoice, PO, or receipt)
	 */
	public function allocateTaxAndShipping($entity_id, $taxAmount, $shippingAmount) {
		$gateway      = "{$this->itemGateway}Gateway";
		$total        = $this->$gateway->findItemTotal($entity_id);
		$taxableTotal = $this->$gateway->findItemTotal($entity_id, true);
		$params       = [];

		if ($total == 0) {
			$salesTax = 0;
			$shipping = 0;
		} else {
			$taxableTotal = $this->$gateway->findItemTotal($entity_id, true);
			
			if ($taxableTotal == 0) {
				$salestax = 0;
			} else {
				$salestax = new Expression("
					CASE
						WHEN {$this->itemTable}_taxflag = 'Y' THEN (({$this->itemTable}_amount / ?) * ?)
						ELSE 0
					END
				");
				array_push($params, floatval($taxableTotal), floatval($taxAmount));
			}

			$shipping = new Expression("
				(({$this->itemTable}_amount / ?) * ?)
			");
			array_push($params, floatval($total), floatval($shippingAmount));
		}

		$params[] = $entity_id;

		$this->$gateway->update(
			[
				"{$this->itemTable}_salestax" => $salestax,
				"{$this->itemTable}_shipping" => $shipping
			],
			[$this->pkField => '?'],
			$params
		);
	}

	/**
	 * 
	 */
	public function auditTaxShippingChanges($entity_id, $oldTax, $newTax, $oldShipping, $newShipping) {
		$errors = [];
		$this->auditlogGateway->beginTransaction();
		
		try {
			$this->audit([
				'field_name'      => 'Sales Tax',
				'field_new_value' => $newTax,
				'field_old_value' => $oldTax,
				'tablekey_id'     => $entity_id
			], 'invoice', 'modified');

			$this->audit([
				'field_name'      => 'Shipping',
				'field_new_value' => $newShipping,
				'field_old_value' => $oldShipping,
				'tablekey_id'     => $entity_id
			], 'invoice', 'modified');
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->auditlogGateway->rollback();
		} else {
			$this->auditlogGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * Unassigns a line item from job costing
	 */
	public function unassignJob($item_id) {
		$this->jbJobAssociationGateway->delete(
			['table_name'=>'?', 'tablekey_id'=>'?'],
			[$this->itemTable, $item_id]
		);

		// TODO: add code to deal with jobcosting contract actuals
		
	}

	/**
	 * Utility function to add audit records
	 */
	public function audit($audit, $audittype=null, $auditactivity=null) {
		if (is_array($audit)) {
			$audit = new \NP\shared\AuditlogEntity($audit);
		}

		if ($audit->field_new_value <> $audit->field_old_value) {
			$audit->userprofile_id               = $this->securityService->getUserId();
			$audit->delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();

			if ($audittype !== null) {
				$audittype_id = $this->audittypeGateway->findIdByType($audittype);
				$audit->audittype_id = $audittype_id;
			}

			if ($auditactivity !== null) {
				$auditactivity_id = $this->auditactivityGateway->findIdByType($auditactivity);
				$audit->auditactivity_id = $auditactivity_id;
			}

			$this->auditlogGateway->save($audit);
		}

		return $audit;
	}

	/**
	 * 
	 */
	public function unassignImage($entity_id) {
		$errors = [];
		$this->imageIndexGateway->beginTransaction();
		
		try {
			$gateway = "{$this->gateway}Gateway";
			$entity = $this->$gateway->findSingle("{$this->tableAlias}.{$this->pkField} = ?", [$entity_id]);

			if ($this->type == 'invoice') {
				$vendorsite_id = $entity['paytablekey_id'];
				$duedate       = $entity['invoice_duedate'];
				$ref           = $entity['invoice_ref'];
				$amount        = $entity['control_amount'];
				$date          = $entity['invoice_datetm'];
			} else {
				$vendorsite_id = $entity['vendorsite_id'];
				$duedate       = null;
				$ref           = $entity['purchaseorder_ref'];
				$amount        = null;
				$date          = null;
			}

			$tableref_id = $this->imageTablerefGateway->getIdByName($this->title);

			$this->imageIndexGateway->update(
				[
					'tablekey_id'                => NULL,
					'Image_Index_Status'         => -1,
					'Image_Index_VendorSite_Id'  => $vendorsite_id,
					'property_id'                => $entity['property_id'],
					'Image_Index_Due_Date'       => $duedate,
					'Image_Index_Ref'            => $ref,
					'Image_Index_Amount'         => $amount,
					'Image_Index_Invoice_Date'   => $date,
					'image_index_deleted_datetm' => \NP\util\Util::formatDateForDB(),
					'tableref_id'                => NULL,
					'image_index_deleted_by'     => $this->securityService->getUserId()
				],
				['tablekey_id'=>'?', 'tableref_id'=>'?'],
				[$entity_id, $tableref_id]
			);
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->imageIndexGateway->rollback();
		} else {
			$this->imageIndexGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}
}