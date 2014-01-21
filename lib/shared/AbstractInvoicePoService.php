<?php

namespace NP\shared;

use NP\core\AbstractService;
use NP\core\db\Expression;
use NP\security\SecurityService;
use NP\budget\BudgetService;
use NP\property\FiscalCalService;
use NP\image\ImageService;

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
			$fiscalCalService, $budgetService, $imageService;
	
	public function __construct(FiscalCalService $fiscalCalService,
								BudgetService $budgetService, ImageService $imageService) {
		$this->fiscalCalService = $fiscalCalService;
		$this->budgetService    = $budgetService;
		$this->imageService     = $imageService;

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

    /**
     * Get images for an entity
     */
    public function getImages($entity_id, $primaryOnly=false) {
        return $this->imageIndexGateway->findEntityImages($entity_id, $this->title, $primaryOnly);
    }

    /**
     * Gets all images that have been indexed and can be added to an entity matching the
     * vendor_id passed in
     *
     * @param  int $vendor_id
     */
    public function getAddableImages($vendor_id) {
    	$tableref_id = $this->imageTablerefGateway->getIdByName($this->title);

        return $this->imageIndexGateway->findAddableImages($vendor_id, $tableref_id);
    }

    /**
     * 
     */
    public function uploadImage($entity_id) {
    	$errors = [];
    	$file = null;
    	$image_index_id = null;
    	$this->imageIndexGateway->beginTransaction();
    	
    	try {
    		// Add an the image to the system
			$result         = $this->imageService->upload($this->title, $entity_id);
			$file           = $result['file'];
			$image_index_id = $result['image_index_id'];
			$errors         = $result['errors'];

    		// If image is successfully added, attach it to the invoice/po
    		if (!count($errors)) {
    			$result = $this->addImages($entity_id, $image_index_id);
    			$errors = $result['errors'];
    		}
    	} catch(\Exception $e) {
    		$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
    	}
    	
    	if (count($errors)) {
    		$this->imageIndexGateway->rollback();
    		// If there was any error, try to delete the file
            try {
                unlink($file['file_path']);
            // In this case, we'll just do nothing if deleting doesn't work because it's not critical
            } catch(\Exception $e) {}
    	} else {
    		$this->imageIndexGateway->commit();
    	}
    	
    	return array(
			'success'        => (count($errors)) ? false : true,
			'file'           => $file,
			'image_index_id' => $image_index_id,
			'errors'         => $errors
    	);
    }

    /**
     * Attaches one or more images to an invoice
     *
     * @param  int       $entity_id
     * @param  int|array $image_index_id_list
     */
    public function addImages($entity_id, $image_index_id_list) {
    	if (!is_array($image_index_id_list)) {
    		$image_index_id_list = [$image_index_id_list];
    	}
    	
    	$errors = [];
    	$new_primary_image = null;
    	$this->imageIndexGateway->beginTransaction();
    	
    	try {
    		$new_primary_image = $this->imageService->attach($entity_id, $this->title, $image_index_id_list);

	    	// TODO: add code for auditing (from dbo.INVOICEIMAGE_ATTACH_IMAGE_TO_INVOICE_SAVE.PRC)

    	} catch(\Exception $e) {
    		$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
    	}
    	
    	if (count($errors)) {
    		$this->imageIndexGateway->rollback();
    	} else {
    		$this->imageIndexGateway->commit();
    	}
    	
    	return array(
			'success'           => (count($errors)) ? false : true,
			'errors'            => $errors,
			'new_primary_image' => $new_primary_image
    	);
    }

    /**
     * This unassigns an image from an invoice/po and moves it to the deleted list.
     * (the image is NOT permanently deleted)
     */
    public function removeImages($entity_id, $image_index_id_list) {
	    $errors = [];
	    $this->imageIndexGateway->beginTransaction();
	    
	    try {
	    	// Get the current primary image so we can check if it was among the deleted
	    	$primaryImage = $this->getImages($entity_id, true);
	    	$newPrimary = null;

	    	// Delete the images
	    	$this->imageIndexGateway->deleteTemporary(
	    		$image_index_id_list,
	    		$this->securityService->getUserId()
	    	);

	    	// Check if the primary image was deleted
	    	if (in_array($primaryImage['Image_Index_Id'], $image_index_id_list)) {
	    		// If primary image was deleted, make the first other image the primary one
	    		$images = $this->getImages($entity_id);
		    	if (count($images)) {
		    		$newPrimary = $images[0];
		    		$this->imageIndexGateway->makePrimary($newPrimary['Image_Index_Id']);
		    	}
	    	}
	    } catch(\Exception $e) {
	    	$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
	    }
	    
	    if (count($errors)) {
	    	$this->imageIndexGateway->rollback();
	    } else {
	    	$this->imageIndexGateway->commit();
	    }
	    
	    return array(
			'success'            => (count($errors)) ? false : true,
			'errors'             => $errors,
			'new_primary_image'  => $newPrimary
	    );
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