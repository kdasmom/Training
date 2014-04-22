<?php

namespace NP\shared;

use NP\core\AbstractService;
use NP\core\db\Expression;
use NP\security\SecurityService;
use NP\budget\BudgetService;
use NP\property\FiscalCalService;
use NP\image\ImageService;
use NP\jobcosting\JobCostingService;
use NP\vendor\VendorService;
use NP\notification\NotificationService;
use NP\util\Util;
use NP\invoice\InvoiceEntity;
use NP\invoice\InvoiceItemEntity;
use NP\po\PurchaseOrderEntity;
use NP\po\PoItemEntity;

/**
 * Service class for operations related to both Invoices and POs, to be extended by both the PO and Invoice class
 *
 * @author Thomas Messier
 */
abstract class AbstractEntityService extends AbstractService {

	/**
	 * You must override this and set it to "po" or "invoice"
	 */
	protected $type;

	protected $table, $itemTable, $pkField, $itemPkField, $module, $configService, $securityService, 
			$fiscalCalService, $budgetService, $imageService, $jobCostingService, $vendorService,
			$notificationService;
	
	public function __construct(FiscalCalService $fiscalCalService,
								BudgetService $budgetService, ImageService $imageService,
								JobCostingService $jobCostingService, VendorService $vendorService) {
		$this->fiscalCalService  = $fiscalCalService;
		$this->budgetService     = $budgetService;
		$this->imageService      = $imageService;
		$this->jobCostingService = $jobCostingService;
		$this->vendorService     = $vendorService;

		$this->module = $this->type;
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
			$this->module      = 'po';
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

	public function setNotificationService(NotificationService $notificationService) {
		$this->notificationService = $notificationService;
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
	 * Get all invoice line items for an invoice
	 *
	 * @param  int $invoice_id
	 * @return array
	 */
	public function getEntityLines($entity_id) {
		$gtw = "{$this->itemGateway}Gateway";
		return $this->$gtw->findLines($entity_id);
	}

    /**
     * Get images for an entity
     */
    public function getImages($entity_id, $primaryOnly=false, $includeTransferData=false) {
        return $this->imageIndexGateway->findEntityImages($entity_id, $this->title, $primaryOnly, $includeTransferData);
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
	 * Get forwards associated to an entity, if any
	 *
	 * @param  int $entity_id
	 * @return array           Array with forward records in a specific format
	 */
	public function getForwards($entity_id) {
		return $this->invoicePoForwardGateway->findByEntity($this->table, $entity_id);
	}

	public function getHistoryLog($entity_id, $showAudit=false, $pageSize=null, $page=null, $sort="approve_datetm") {
		$gateway = "{$this->gateway}Gateway";
		return $this->$gateway->findHistoryLog($entity_id, $showAudit, $pageSize, $page, $sort);
	}

	public function getHistoryLogDetail($approve_id, $entity_id) {
		$approve = $this->approveGateway->findById($approve_id);
		$data    = ['approve'=>$approve];
		
		if ($approve['approvetype_name'] == 'modified' && ($approve['approve_message'] == 'Modify GL' || $approve['approve_message'] == 'This receipt has been modified.')) {
			$data['gl_mod']   = $this->approveGlLogGateway->getModifiedGl($approve_id);
			$data['desc_mod'] = $this->approveGlLogGateway->getModifiedDesc($approve_id);
		}

		if (!empty($approve['wftarget_id'])) {
			$target = $this->wfRuleTargetGateway->findById($approve['wftarget_id']);
			$property_id = $target['tablekey_id'];
		} else {
			$gtw = "{$this->gateway}Gateway";
			$property_id = $this->$gtw->findValue(
				[$this->pkField => '?'],
				[$entity_id],
				'property_id'
			);
		}

		if ($approve['forwardto_tablename'] == 'role') {
			$role = $this->roleGateway->findById($approve['forwardto_tablekeyid']);
			$data['forward_name'] = $role['role_name'];
			$data['forward_users'] = $this->userprofileGateway->findByFilter('active', $property_id, $role['role_id']);
		} else if (!empty($approve['forwardto_tablename'])) {
			if ($approve['approvetype_name'] != 'hold') {
				$data['forward_name'] = $this->userprofileGateway->findSingle(
					'ur.userprofilerole_id = ?',
					[$approve['forwardto_tablekeyid']]
				);
				$data['forward_name'] = $data['forward_name']['person_firstname'] . ' ' . $data['forward_name']['person_lastname'];
			}
		}

		$data['property_name'] = $this->propertyGateway->findValue(
			'property_id = ?',
			[$property_id],
			'property_name'
		);

		if (!empty($approve['wfrule_id'])) {
			$data['wfrule'] = $this->wfRuleGateway->getRuleData($approve['wfrule_id']);
			$data['wfrule'] = array_pop($data['wfrule']);
		}

		if ($approve['approvetype_name'] == 'void') {
			$data['void_note'] = $this->noteGateway->findValue(
				['table_name'=>'invoice', 'tablekey_id'=>'?', 'objtype_id_alt'=>2],
				[$entity_id],
				'note'
			);
		}

		return $data;
	}

	/**
	 * Gets rejection notes for an entity
	 */
	public function getRejectionNotes($entity_id) {
		return $this->rejectionHistoryGateway->findRejectionNotes($this->table, $entity_id);
	}

	/**
	 * Get info 
	 */
	public function getLineBudgetInfo($item_id, $type='account', $includeYear=false) {
		$itemGtw = "{$this->itemGateway}Gateway";
		$item = $this->$itemGtw->findById($item_id, [
			'property_id',
			'glaccount_id',
			'item_period' => "{$this->itemTable}_period"
		]);

		$gl                   = $this->glAccountGateway->findById($item['glaccount_id']);
		$period               = \DateTime::createFromFormat(Util::getServerDateFormat(), $item['item_period']);
		$budgetCompareWithTax = $this->configService->get('PN.Intl.budgetCompareWithTax', '1');

		$data = [
			'property_name'  => $this->propertyGateway->findValue('property_id = ?', [$item['property_id']], 'property_name'),
			'glaccount_name' => ($type == 'account') ? $gl['glaccount_name'] : $gl['glaccount_category'],
			'month'          => (int)$period->format('n')
		];
		
		$data['package_type_name'] = $this->propertyGateway->findSingle(
			'pr.property_id = ?',
			[$item['property_id']],
			[],
			null,
			[
				new \NP\property\sql\join\PropertyIntPkgJoin([]),
				new \NP\system\sql\join\IntPkgIntPkgTypeJoin()
			]
		);
		$data['package_type_name'] = $data['package_type_name']['Integration_Package_Type_Display_Name'];

		$isCategory = ($type == 'category') ? true : false;
		$fn = ($isCategory) ? 'getCategoryBudgetByPeriod' : 'getAccountBudgetByPeriod';
		$glaccount_id = ($isCategory) ? $gl['glaccount_category_id'] : $gl['glaccount_id'];

		$budget = $this->budgetGateway->$fn($glaccount_id, $item['property_id'], $item['item_period']);

		$invoiceAmount = $this->invoiceGateway->getTotalAmountByBudget(
			$glaccount_id,
			$item['property_id'],
			$item['item_period'],
			null,
			$isCategory
		);

		$poAmount = $this->purchaseOrderGateway->getTotalAmountByBudget(
			$glaccount_id,
			$item['property_id'],
			$item['item_period'],
			null,
			$isCategory
		);

		$data['month_budget']  = $budget['budget_amount'];
		$data['month_actual']  = $budget['actual_amount'];
		$data['month_invoice'] = $invoiceAmount;
		$data['month_po']      = $poAmount;

		if ($includeYear) {
			
			$fiscalYear   = $this->fiscalCalService->getFiscalYear($item['property_id'], $period);
			$start_period = Util::formatDateForDB($fiscalYear['start']);
			$end_period   = Util::formatDateForDB($fiscalYear['end']);

			$budget = $this->budgetGateway->$fn($glaccount_id, $item['property_id'], $start_period, $end_period);

			$invoiceAmount = $this->invoiceGateway->getTotalAmountByBudget(
				$glaccount_id,
				$item['property_id'],
				$start_period,
				$end_period,
				$isCategory
			);

			$poAmount = $this->purchaseOrderGateway->getTotalAmountByBudget(
				$glaccount_id,
				$item['property_id'],
				$start_period,
				$end_period,
				$isCategory
			);

			$data['year']         = $fiscalYear['year'];
			$data['year_budget']  = $budget['budget_amount'];
			$data['year_actual']  = $budget['actual_amount'];
			$data['year_invoice'] = $invoiceAmount;
			$data['year_po']      = $poAmount;
		}

		return $data;
	}

	/**
	 * 
	 */
	public function getSchedule($entity_id) {
		return $this->recurringSchedulerGateway->findSingle([
			'table_name'      => "'{$this->table}'",
			'tablekey_id'     => '?',
			'schedule_status' => "'active'"
		], [$entity_id]);
	}

	/**
	 * Saves a schedule for an entity template
	 */
	public function saveSchedule($data) {
		$errors = [];
		$this->recurringSchedulerGateway->beginTransaction();
		
		try {
			$schedule = new \NP\system\RecurringSchedulerEntity($data['recurringscheduler']);
			$schedule->table_name  = $this->table;
			$schedule->tablekey_id = $data['entity_id'];
			$schedule->schedule_week_days = $data['schedule_week_days'];

			$errors = $this->entityValidator->validate($schedule);
			if (!count($errors)) {
				$this->recurringSchedulerGateway->save($schedule);
			}
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
	 * Deletes a schedule for an entity template
	 */
	public function deleteSchedule($entity_id) {
		$errors = [];
		
		try {
			$schedule = $this->getSchedule($entity_id);
			$recurring_scheduler_id = $schedule['recurring_scheduler_id'];

			$this->recurringSchedulerGateway->update(
				['schedule_status' => 'inactive'],
				['recurring_scheduler_id' => '?'],
				[$recurring_scheduler_id]
			);
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
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

    /**
     * Changes the property on an invoice or PO
     */
    public function changeProperty($entity_id, $property_id) {
    	$gtw = "{$this->gateway}Gateway";
    	$itemGtw = "{$this->itemGateway}Gateway";

    	$old_property_id = $this->$gtw->findValue(
    		[$this->pkField => '?'],
			[$entity_id],
			'property_id'
		);

		$property_name = $this->propertyGateway->findValue(
    		['property_id' => '?'],
			[$property_id],
			'property_name'
		);

		$old_property_name = $this->propertyGateway->findValue(
    		['property_id' => '?'],
			[$old_property_id],
			'property_name'
		);
    	
		if ($property_id !== $old_property_id) {
			if ($this->configService->get('CP.PROPERTYGLACCOUNT_USE', '0') == '1') {
				$invalid = $this->$itemGtw->findInvalidLinesForProperty($entity_id, $property_id);
			} else {
				$invalid = [];
			}

			$invalidIds = Util::valueList($invalid, $this->itemPkField);
			$where = [
				['equals', $this->pkField, '?'],
				['equals', 'property_id', '?']
			];
			$params = [$entity_id, $old_property_id];
			if (count($invalidIds)) {
				$where[] = ['notIn', $this->itemPkField, $this->$itemGtw->createPlaceholders($invalidIds)];
				$params = array_merge($params, $invalidIds);
			}

			$validLines = $this->$itemGtw->find(
				$where,
				$params,
				null,
				[$this->itemPkField, 'glaccount_id', "{$this->itemTable}_period"]
			);

			$errors = [];
			$this->$itemGtw->beginTransaction();
			
			try {
				$this->$gtw->update([
					$this->pkField => $entity_id,
					'property_id'  => $property_id
				]);

				$this->audit([
					'field_name'      => 'property_id',
					'field_new_value' => $property_name,
					'field_old_value' => $old_property_name,
					'tablekey_id'     => $entity_id
				], $this->table, 'modified');

				foreach ($validLines as $validLine) {
					$this->$itemGtw->update([
						$this->itemPkField => $validLine[$this->itemPkField],
						'property_id'      => $property_id
					]);

					$this->audit([
						'field_name'      => 'property_id',
						'field_new_value' => $property_name,
						'field_old_value' => $old_property_name,
						'tablekey_id'     => $validLine[$this->itemPkField]
					], $this->itemTable, 'modified');

					$itemPeriod = $validLine["{$this->itemTable}_period"];
					$itemPeriod = \DateTime::createFromFormat(\NP\util\Util::getServerDateFormat(), $itemPeriod);

					$this->budgetService->createBudget(
						$property_id,
						$validLine['glaccount_id'],
						$itemPeriod,
						0,
						0
					);
				}
			} catch(\Exception $e) {
				$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
			}
			
			if (count($errors)) {
				$this->$itemGtw->rollback();
			} else {
				$this->$itemGtw->commit();
			}
			
			return array(
				'success'      => (count($errors)) ? false : true,
				'errors'       => $errors,
				'invalidLines' => count($invalidIds)
			);
		}
    }

	public function unlinkPoFromInvoice($invoice_id) {
		$this->purchaseOrderGateway->beginTransaction();
		
		try {
			$this->purchaseOrderGateway->unlinkFromInvoice($invoice_id);
			$this->unlinkAllPoItemsFromInvoice($invoice_id);

			$this->purchaseOrderGateway->commit();
		} catch(\Exception $e) {
			$this->purchaseOrderGateway->rollback();
			throw $e;
		}
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
			$salestax = 0;
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

	/**
	 * Returns the lock for an invoice or PO
	 *
	 * @param  int $entity_id
	 * @return int
	 */
	public function getLock($entity_id) {
		if ($entity_id === null) {
			return 0;
		}

		$gtw = "{$this->gateway}Gateway";

		$lock_id = $this->$gtw->findValue(
			["{$this->table}_id"=>'?'],
			[$entity_id],
			'lock_id'
		);

		return $lock_id;
	}

	/**
	 * Returns the lock for an invoice or PO
	 *
	 * @param  int $entity_id
	 * @return int
	 */
	public function setNewLock($entity_id) {
		$lock_id = $this->getLock($entity_id);
		$lock_id = ($lock_id === null) ? 1 : $lock_id + 1;

		$gtw = "{$this->gateway}Gateway";
		
		$this->$gtw->update(
			['lock_id' => $lock_id],
			["{$this->table}_id"=>'?'],
			[$entity_id]
		);
		
		return $lock_id;
	}

	/**
	 * Makes a copy of an entity
	 */
	public function saveCopy($entity_id, $template_name, $save_invoice_number=false, $include_images=false) {
		$errors        = [];
		$new_entity_id = null;
		$pk            = $this->pkField;
		$itemPk        = $this->itemPkField;
		$gtw           = $this->gateway . 'Gateway';

		$this->$gtw->beginTransaction();
		
		try {
			// Get the entity data
			$entity = $this->$gtw->findById($entity_id);
			$data   = [
				$this->table                   => $entity,
				'userprofile_id'               => $this->securityService->getUserId(),
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId()
			];
			$data[$this->table][$pk] = null;

			// Set the template name
			$data[$this->table]['template_name'] = $template_name;

			// If dealing with an invoice and option to save invoice number is false, clear invoice number
			if ($this->type == 'invoice' && !$save_invoice_number) {
				$data[$this->table]['invoice_ref'] = '';
			}

			// Get all lines for the entity
			$lines = $this->getEntityLines($entity_id);

			// Loop through lines
			$data['lines']    = [];
			$data['tax']      = 0;
			$data['shipping'] = 0;
			foreach ($lines as $line) {
				// Set the entity_id on the line to associate
				$line[$pk] = null;
				$line[$itemPk] = null;

				$data['lines'][] = $line;

				$data['tax']      += $line["{$this->itemTable}_salestax"];
				$data['shipping'] += $line["{$this->itemTable}_shipping"];
			}

			$saveFn = 'save' . ucfirst($this->type);
			$result = $this->$saveFn($data);

			if (!$result['success']) {
				throw new \NP\core\Exception('Error saving entity while creating entity copy');
			}

			$new_entity_id = $result[$pk];

			// If we've elected to copy images, proceed
			if ($include_images) {
				$result = $this->copyEntityImages($entity_id, $new_entity_id);

				if (!$result['success']) {
					$this->loggingService->log('error', 'Error copying images', ['result'=>$result, "{$this->table}_id"=>$entity_id]);
					throw new \NP\core\Exception('Error while copying images for an entity');
				}
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->$gtw->rollback();
		} else {
			$this->$gtw->commit();
		}
		
		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors,
			'entity_id' => $new_entity_id
		);
	}

	/**
	 * 
	 */
	public function copyEntityImages($old_entity_id, $new_entity_id) {
		$errors = [];
		$this->imageIndexGateway->beginTransaction();
		
		try {
			// Get all images for entity
			$images = $this->getImages($old_entity_id, false, true);

			// Loop through images
			foreach ($images as $image) {
				// Create image entity
				$imgIndex = new \NP\image\ImageIndexEntity($image);

				// Associate image with entity
				$imgIndex->Tablekey_Id = $new_entity_id;

				// Insert the image
				$this->imageIndexGateway->insert($imgIndex);

				// Create transfer entity
				$imgTransfer = new \NP\image\ImageTransferEntity($image);

				// Associate transfer with image
				$imgTransfer->invoiceimage_id   = $imgIndex->Image_Index_Id;

				// Create unique filename for the new image file
				$imgTransfer->transfer_filename = \NP\util\Util::getUniqueFileName($image['transfer_filename']);

				// Insert the transfer record
				$this->imageTransferGateway->insert($imgTransfer);

				// Copy the image file
				copy($image['transfer_filename'], $imgTransfer->transfer_filename);
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
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * 
	 */
	public function useTemplate($entity_id) {
		$errors = [];
		$gtw    = "{$this->gateway}Gateway";

		$this->$gtw->beginTransaction();
		
		try {
			// Call the copy function with default arguments
			$result = $this->saveCopy($entity_id, '', true, true);

			// Check for success before proceeding
			if (!$result['success']) {
				$this->loggingService->log('error', 'Error saving entity copy', ['result'=>$result, "{$this->table}_id"=>$entity_id]);
				throw new \NP\core\Exception('Error while saving a copy of an entity while using a template');
			}

			// Get the new entity ID
			$entity_id = $result['entity_id'];

			// Update the entity status to make it open (the copy will have created a template)
			$this->$gtw->update(
				["{$this->table}_status" => 'open'],
				[$this->pkField => '?'],
				[$entity_id]
			);
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->$gtw->rollback();
		} else {
			$this->$gtw->commit();
		}
		
		return array(
			'success'   => (count($errors)) ? false : true,
			'errors'    => $errors,
			'entity_id' => $entity_id
		);
	}

	public function auditEntity($entity_id, \NP\core\AbstractEntity $oldEntity, $oldLines) {
		$gtw                          = "{$this->gateway}Gateway";
		$itemGtw                      = "{$this->itemGateway}Gateway";
		$entityClass                  = "NP\\{$this->module}\\" . ucfirst($this->gateway) . 'Entity';
		$itemClass                    = "NP\\{$this->module}\\" . ucfirst($this->itemGateway) . 'Entity';

		$errors = [];
		$this->$gtw->beginTransaction();
		
		try {
			$newEntity = $this->invoiceGateway->findSingle(
				[$this->pkField => '?'],
				[$entity_id]
			);

			$newEntity = new $entityClass($newEntity);

			$auditor = new \NP\shared\EntityModificationAuditor(
				$this->configService,
				$this->gatewayManager,
				$this->table,
				$this->securityService->getUserId(),
				$this->securityService->getDelegatedUserId()
			);
			$auditor->audit($newEntity, $oldEntity);

			$newLines = $this->$itemGtw->find(
				"{$this->pkField} = ?",
				[$entity_id]
			);
			foreach ($newLines as $i=>$newLine) {
				foreach ($oldLines as $j=>$oldLine) {
					if ($oldLine[$this->itemPkField] == $newLine[$this->itemPkField]) {
						$oldLine = new $itemClass($oldLine);
						$newLine = new $itemClass($newLine);

						$auditor->audit($newLine, $oldLine);
						break;
					}
				}
			}
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->$gtw->rollback();
		} else {
			$this->$gtw->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}

	/**
	 * 
	 */
	public function auditModifyGl(\NP\core\AbstractEntity $newLine, \NP\core\AbstractEntity $oldLine) {
		$approvetype_id = $this->approveTypeGateway->getIdByName('modified');
		$pkField        = $this->pkField;

		// Save an approve record
		$approve = new \NP\workflow\ApproveEntity([
			'table_name'                   => $this->table,
			'tablekey_id'                  => $newLine->$pkField,
			'userprofile_id'               => $this->securityService->getUserId(),
			'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId(),
			'approve_status'               => 'inactive',
			'approve_message'              => 'Modify GL',
			'approvetype_id'               => $approvetype_id
		]);
		$this->approveGateway->insert($approve);
		
		$itemPk = $this->itemPkField;

		if ($oldLine->glaccount_id !== $newLine->glaccount_id) {
			$this->approveGlLogGateway->insert([
				'approve_id'           => $approve->approve_id,
				'lineitem_id'          => $newLine->$itemPk,
				'approvegllog_gl_from' => $oldLine->glaccount_id,
				'approvegllog_gl_to'   => $newLine->glaccount_id
			]);
		}

		$descField = $this->itemTable . '_description';
		if (trim($oldLine->$descField) !== trim($newLine->$descField)) {
			$this->approveGlLogGateway->insert([
				'approve_id'             => $approve->approve_id,
				'lineitem_id'            => $newLine->$itemPk,
				'approvegllog_desc_from' => $oldLine->$descField,
				'approvegllog_desc_to'   => $newLine->$descField
			]);
		}
	}
}