<?php

namespace NP\shared;

use NP\core\AbstractService;
use NP\core\db\Expression;
use NP\core\notification\EmailMessage;
use NP\core\notification\EmailAttachment;
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
	public function getEntityLines($entity_id, $combineSplit=null) {
		$gtw = "{$this->itemGateway}Gateway";

		if (empty($combineSplit)) {
			return $this->$gtw->findLines($entity_id);
		} else {
			return $this->$gtw->findLines($entity_id, $combineSplit);
		}
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
     * Get Template for image index table.
     * 
     * @param int $vendorsite_id Vendorsite id. Should not be empty.
     * @param int $property_id Propery id. Should not be empty.
     * @param int $utilityaccount_id Utility account ID.
     * @return [] List of templates.
     */
    public function getTemplatesByCriteria($vendorsite_id, $property_id, $utilityaccount_id=null) {
    	$gtw = "{$this->gateway}Gateway";

    	return $this->$gtw->getTemplatesByCriteria(
    		$this->securityService->getUserId(),
    		$this->securityService->getDelegatedUserId(),
        	$vendorsite_id,
        	$property_id,
        	$utilityaccount_id
        );
    }

    /**
     * Gets an HTML version of an entity
     */
    public function getEntityAsHtml($entity_id, $options=[]) {
		$renderer = "NP\\{$this->module}\\" . ucfirst($this->type) . 'HtmlRenderer';
		$renderer = new $renderer($this->configService, $this->gatewayManager, $this, $entity_id, $options);

    	ob_start();
    	$renderer->render();
    	$html = ob_get_contents();
    	ob_end_clean();

    	return $html;
    }

	/**
	 * Applies a template to an existing invoice
	 */
	public function applyTemplate($entity_id, $template_id) {
		$gtw     = "{$this->gateway}Gateway";
		$itemGtw = "{$this->itemGateway}Gateway";

		$errors = [];
		$this->$gtw->beginTransaction();
		
		try {
			// Delete all lines from this entity
			$this->clearLines($entity_id);

			// Get tax and shipping totals
			$totals = $this->$itemGtw->findTaxAndShippingTotal($template_id);

			// Get all the template lines
			$lines = $this->getEntityLines($template_id);

			// Loop through template lines to reset key ids
			foreach ($lines as $i=>$line) {
				$lines[$i][$this->itemPkField] = null;
				$lines[$i][$this->pkField]     = $entity_id;
			}

			// Get the data for the template selected
			$templateData = [
				$this->table                   => $this->$gtw->findSingle([$this->pkField => '?'], [$template_id]),
				'lines'                        => $lines,
				'tax'                          => $totals['tax'],
				'shipping'                     => $totals['shipping'],
				'userprofile_id'               => $this->securityService->getUserId(),
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId()
			];

			// Update the entity data with the correct ID
			$templateData[$this->table][$this->pkField] = $entity_id;

			// Update the entity's status
			$templateData[$this->table]["{$this->table}_status"] = 'open';

			// If dealing with PO, preserve the PO number
			if ($this->type == 'po') {
				$templateData[$this->table]['purchaseorder_ref'] = $this->purchaseOrderGateway->findValue(
					'purchaseorder_id = ?',
					[$entity_id],
					'purchaseorder_ref'
				);
			}

			$result = $this->saveEntity($templateData);
			
			if (!$result['success']) {
				$errors = $result['errors'];
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
	 * Removes all line items from an invoice
	 */
	public function clearLines($entity_id) {
		$itemGtw = "{$this->itemGateway}Gateway";

		$this->$itemGtw->beginTransaction();
		
		try {
			if ($this->type === 'invoice') {
				// Unlink POs and PO lines from this invoice
				$this->unlinkPoFromInvoice($entity_id);
			}

			// Delete all lines
			$this->$itemGtw->delete([$this->pkField=>'?'], [$entity_id]);

			$this->$itemGtw->commit();
		} catch(\Exception $e) {
			$this->$itemGtw->rollback();
			throw $e;
		}
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
			$result         = $this->imageService->upload();
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
	public function saveCopy($entity_id, $template_name, $save_invoice_number=false, $include_images=false, $status=null) {
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
				'delegation_to_userprofile_id' => $this->securityService->getDelegatedUserId(),
				'vendor_id'                    => $entity['vendor_id']
			];
			$data[$this->table][$pk] = null;

			// Set the template name
			if ($this->type == 'invoice') {
				$data[$this->table]['template_name'] = $template_name;
			} else {
				$data[$this->table]['purchaseorder_ref'] = $template_name;

				// Add service fields to the PO data
				$customFields = $this->pnCustomFieldsGateway->findCustomFieldData('po', $entity_id);
				$data['service_fields'] = [];
				foreach ($customFields as $field) {
					$data['service_fields'][$field['customfield_name']] = $field['customfielddata_value'];
				}
			}

			// If dealing with an invoice and option to save invoice number is false, clear invoice number
			if ($this->type == 'invoice' && !$save_invoice_number) {
				$data[$this->table]['invoice_ref'] = '';
			}

			if (!empty($status)) {
				$data[$this->table]["{$this->table}_status"] = $status;
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

			$result = $this->saveEntity($data);

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
				$uniqueFileName = \NP\util\Util::getUniqueFileName($image['transfer_filename']);
				$imgTransfer->transfer_filename = $uniqueFileName['path'];

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
		$errors        = [];
		$gtw           = "{$this->gateway}Gateway";
		$new_entity_id = null;

		$this->$gtw->beginTransaction();
		
		try {
			// Call the copy function with default arguments
			$result        = $this->saveCopy($entity_id, '', true, true, 'open');
			$new_entity_id = $result['entity_id'];

			// Check for success before proceeding
			if (!$result['success']) {
				$this->loggingService->log('error', 'Error saving entity copy', ['result'=>$result, "{$this->table}_id"=>$entity_id]);
				throw new \NP\core\Exception('Error while saving a copy of an entity while using a template');
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
			'success'   => (count($errors)) ? false : true,
			'errors'    => $errors,
			'entity_id' => $new_entity_id
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
			$newEntity = $this->$gtw->findSingle(
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

	public function saveEntity($data) {
		$gtw         = "{$this->gateway}Gateway";
		$itemGtw     = "{$this->itemGateway}Gateway";
		$pk          = $this->pkField;
		$itemPk      = $this->itemPkField;
		$entityClass = "NP\\{$this->module}\\" . ucfirst($this->gateway) . 'Entity';
		$vendorKey   = ($this->type == 'invoice') ? 'paytablekey_id' : 'vendorsite_id';
		$periodKey   = "{$this->table}_period";

		$errors = [];
		$this->$gtw->beginTransaction();
		
		try {
			$now                          = \NP\util\Util::formatDateForDB();
			$userprofile_id               = $data['userprofile_id'];
			$delegation_to_userprofile_id = $data['delegation_to_userprofile_id'];

			// Create the invoice entity with initial data
			$entity = new $entityClass($data[$this->table]);

			// If paytablekey_id wasn't added, we need to get it based on vendor_id
			if ($entity->$vendorKey === null) {
				// Add vendorsite_id to the invoice
				$entity->$vendorKey = $this->vendorGateway->findVendorsite($data['vendor_id']);
			}

			// Set a new lock on the entity to prevent other people from updating it simultaneously
			$entity->lock_id = $this->getLock($entity->$pk) + 1;

			// If delaing with a new PO, set default ship to/bill to
			if ($this->type == 'po' && $entity->$pk === null) {
				$headerProp = $this->propertyGateway->findById(
					$entity->property_id,
					['property_NexusServices','default_shipto_property_id','default_billto_property_id']
				);

				$entity->Purchaseorder_ship_propertyID = $headerProp['default_shipto_property_id'];
				$entity->Purchaseorder_bill_propertyID = $headerProp['default_billto_property_id'];

				$entity->Purchaseorder_shipaddress = $this->getShipToBillToAddress(
					$headerProp['default_shipto_property_id']
				);

				$entity->Purchaseorder_billaddress = $this->getShipToBillToAddress(
					$headerProp['default_billto_property_id'],
					($headerProp['property_NexusServices'] == 1) ? true : false,
					$data['vendor_id']
				);
			}

			// Validate entity record
			$errors = $this->entityValidator->validate($entity);

			// Deal with change to vendor on existing invoice if needed
			if (!count($errors)) {
				if ($entity->$pk !== null) {
					$currentEntity = $this->$gtw->findById($entity->$pk);
					// If vendor has changed, make some changes
					if ($currentEntity[$vendorKey] !== $entity->$vendorKey) {
						if ($this->type == 'invoice') {
							// Delete all hold records
							$this->invoiceHoldGateway->delete(['invoice_id'=>'?'], [$entity->$pk]);
						}

						// Delete all approval records
						$this->approveGateway->delete(
							['table_name'=>'?', 'tablekey_id'=>'?'],
							[$this->table, $entity->$pk]
						);

						// Log the vendor change
						$approvetype_id = $this->approveTypeGateway->getIdByName('Change Vendor');

						$approve = new \NP\workflow\ApproveEntity([
							'table_name'                   => $this->table,
							'tablekey_id'                  => $entity->$pk,
							'userprofile_id'               => $userprofile_id,
							'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
							'approve_message'              => 'Vendor Change',
							'approvetype_id'               => $approvetype_id,
							'transaction_id'               => $this->approveGateway->currentId()
						]);

						$errors = $this->entityValidator->validate($approve);
						if (!count($errors)) {
							$this->approveGateway->save($approve);
						} else {
							$this->loggingService->log('error', 'Error validating approve entity while changing vendor', $errors);
							throw new \NP\core\Exception('Error changing vendor on entity');
						}
					}
				}
			}

			// Save invoice if valid
			if (!count($errors)) {
				// If dealing with an existing invoice, before saving we want to grab
				// the data as it is now for audit purposes
				if ($data[$this->table][$pk] !== null) {
					$oldEntity = $this->$gtw->findSingle(
						"{$pk} = ?",
						[$entity->$pk]
					);
					$oldEntity = new $entityClass($oldEntity);
					$oldLines   = $this->getEntityLines($entity->$pk);
				}
				
				$this->$gtw->save($entity);

				// If dealing with a new PO that's not a template, we need to generate the PO number
				if ($this->type == 'po' && $data[$this->table][$pk] === null && $entity->purchaseorder_status != 'draft') {
					$this->generatePoRef($entity->purchaseorder_id, $entity->purchaseorder_period, $entity->property_id);
				}
			}

			// Save the creator of the entity if new
			if (!count($errors) && $data[$this->table][$pk] === null) {
				// Validate author record
				$author = new \NP\user\RecAuthorEntity([
					'userprofile_id'               => $userprofile_id,
					'delegation_to_userprofile_id' => $delegation_to_userprofile_id,
					'table_name'                   => $this->table,
					'tablekey_id'                  => $entity->$pk
				]);
				$authorErrors = $this->entityValidator->validate($author);
				if (count($authorErrors)) {
					$this->loggingService->log('global', 'RecAuthorEntity errors', $authorErrors);
					$this->loggingService->log('global', $this->table, [$pk => $entity->$pk]);
					throw new \NP\core\Exception('Unexpected error saving entity author');
				} else {
					$this->recAuthorGateway->save($author);
				}
			}

			// If dealing with a PO, we need to save service fields if any
			if ($this->type == 'po') {
				$this->customFieldService->saveCustomFieldData('po', $entity->$pk, $data['service_fields']);
			}

			// Save invoice line items
			$lineIds = [];
			if (!count($errors)) {
				// Before modifying lines, we need to grab the job costing contract lines that exist
				// so we can update them just in case (otherwise, if a contract gets changed, we can't
				// know after the record is updated which contract budget we need to update)
				$contractLines = [];
				// We only do this for existing invoices
				if ($data[$this->table][$pk] !== null) {
					$contractLines = $this->jbJobAssociationGateway->findContractLinesByEntity($this->table, $entity->$pk);
				}
				if (array_key_exists('lines', $data)) {
					// Loop through line items to add/modify
					foreach ($data['lines'] as $linenum=>$item) {
						if (!array_key_exists('is_dirty', $item) || $item['is_dirty']) {
							// Assign some values that weren't passed in
							$item[$pk]                      = $entity->$pk;
							$item['vendorsite_id']          = $entity->$vendorKey;
							$item[$periodKey]               = $entity->$periodKey;
							$item["{$this->table}_linenum"] = $linenum+1;

							// Save the line item
							$result = $this->saveLine($item);

							// Error handling
							if (!$result['success']) {
								$errors = array_merge($errors, $result['errors']);
								break;
							} else {
								$data['lines'][$linenum][$itemPk] = $result['item_id'];
							}
						}
						$lineIds[] = $data['lines'][$linenum][$itemPk];
					}
				}
			}

			// Link PO items if appropriate
			if ($this->type == 'invoice' && !count($errors)) {
				$result = $this->processLinkedPoLines($data['lines']);
				if (!$result['success']) {
					$errors = $result['errors'];
				}
			}

			// Delete invoice line items
			if (!count($errors)) {
				$deletedLines = $this->$itemGtw->getDeletedLines($entity->$pk, $lineIds);
				// Loop through line items to delete
				foreach ($deletedLines as $item) {
					// Delete the line item
					$result = $this->deleteLine($item[$itemPk]);

					// Error handling
					if (!$result['success']) {
						$errors = array_merge($errors, $result['errors']);
						break;
					}
				}
			}

			// Add any missing budgets to this invoice
			if (!count($errors)) {
				$this->budgetService->createMissingBudgets($this->type, $entity->$pk);
			}

			// Retrieve current Tax and Shipping totals for auditing purposes before deleting
			if (!count($errors)) {
				$oldTotals = $this->$itemGtw->findTaxAndShippingTotal($entity->$pk);

				$this->allocateTaxAndShipping($entity->$pk, $data['tax'], $data['shipping']);

				if ($data[$this->table][$pk] !== null) {
					// Save audit of changes to tax and shipping
					$result = $this->auditTaxShippingChanges(
						$entity->$pk,
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
				$this->$itemGtw->update(
					["{$this->itemTable}_period" => $entity->$periodKey],
					"{$pk} = ?",
					[$entity->$pk]
				);
			}

			if (!count($errors)) {
				// Create budgets for all line items (if needed)
				$result = $this->createEntityBudgets($entity->$pk);

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
				$this->updateMultiPropertyStatus($entity->$pk);
			}

			// Audit the changes in the invoice if not new
			if (!count($errors) && $data[$this->table][$pk] !== null) {
				$this->auditEntity($entity->$pk, $oldEntity, $oldLines);
			}

			// Update job costing contract total as needed
			if (!count($errors)) {
				// We need to get contract lines again in case new contracts have been added
				$newContractLines = $this->jbJobAssociationGateway->findContractLinesByEntity($this->table, $entity->$pk);
				// We combine the old contracts with the new contracts; there may be duplicates, we'll deal with it later
				$contractLines = array_merge($contractLines, $newContractLines);
				// Update the contract actuals
				$this->updateContractActuals($newContractLines);
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
			'errors'  => $errors,
			$pk       => $entity->$pk,
			'lock_id' => $entity->lock_id
		);
	}

	/**
	 * Saves an invoice line item
	 */
	private function saveLine($data) {
		$itemGtw   = "{$this->itemGateway}Gateway";
		$itemClass = "NP\\{$this->module}\\" . ucfirst($this->itemGateway) . 'Entity';
		$itemPk    = $this->itemPkField;

		$errors = [];
		$this->$itemGtw->beginTransaction();
		$isModifyGl = (
			$data[$itemPk] !== null
			&& array_key_exists('is_modify_gl', $data)
			&& $data['is_modify_gl']
		);

		try {
			// Create the invoice entity with initial data
			$item = new $itemClass($data);

			// Validate invoice record
			$errors = $this->entityValidator->validate($item);

			// Save invoice line if valid
			if (!count($errors)) {
				// Before saving, let's get the old line item if necessary for auditing
				if ($isModifyGl) {
					$oldLine = $this->$itemGtw->findById($data[$itemPk]);
				}

				$this->$itemGtw->save($item);
			}

			if (
				!count($errors) 
				&& $isModifyGl
			) {
				$oldLine = new $itemClass($oldLine);
				$this->auditModifyGl($item, $oldLine);
			}

			// Save job costing info if appropriate
			if (!count($errors)) {
				$data['table_name']  = $this->itemTable;
				$data['tablekey_id'] = $item->$itemPk;
				$res = $this->jobCostingService->saveJobCostingInfo($data);
				$errors = $res['errors'];
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
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors,
		    'item_id' => $item->$itemPk
		);
	}

	/**
	 * Deletes a single line item
	 *
	 * @param  int $invoiceitem_id
	 * @return array
	 */
	protected function deleteLine($item_id) {
		$itemGtw = "{$this->itemGateway}Gateway";
		$itemPk  = $this->itemPkField;

		$errors = [];
		$this->$itemGtw->beginTransaction();

		try {
			// Delete any job associations if appropriate
			if ($this->configService->get('pn.jobcosting.jobcostingEnabled', '0') == '1') {
				$this->unassignJob($item_id);
			}

			// Delete the invoice line
			$this->$itemGtw->delete("{$itemPk} = ?", [$item_id]);
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->$itemGtw->rollback();
		} else {
			$this->$itemGtw->commit();
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
	public function createEntityBudgets($entity_id) {
		$itemGtw = "{$this->itemGateway}Gateway";

		$lines = $this->$itemGtw->find(
			[$this->pkField => '?'],
			[$entity_id],
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
	 * 
	 */
	public function updateMultiPropertyStatus($entity_id) {
		$gtw = "{$this->gateway}Gateway";
		$multiproperty = ($this->$gtw->isMultiProp($entity_id)) ? 1 : 0;

		$this->$gtw->update([
			$this->pkField                => $entity_id,
			"{$this->table}_multiproperty" => $multiproperty
		]);
	}

	/**
	 * Updates the PN Actual value for a job contract
	 */
	public function updateContractActuals($entity_id) {
		// We can either pass an entity_id or an array of job contract lines for an entity
		if (!is_array($entity_id)) {
			$lines = $this->jbJobAssociationGateway->findContractLinesByEntity($this->table, $entity_id);
		} else {
			$lines = $entity_id;
		}

		// We'll track the contract budgets that get updated so we can skip duplicates
		$updated = [];
		foreach ($lines as $line) {
			if (!array_key_exists($line['jbcontractbudget_id'], $updated)) {
				$budget = $this->jbJobAssociationGateway->findContractActualByFilter(
					$line['jbcontract_id'],
					$line['jbchangeorder_id'],
					$line['jbjobcode_id'],
					$line['jbphasecode_id'],
					$line['jbcostcode_id']
				);

				if ($budget !== null) {
					$this->jbContractBudgetGateway->update([
						'jbcontractbudget_id'           => $budget['jbcontractbudget_id'],
						'jbcontractbudget_amt_pnactual' => $budget['invoice_actual']
					]);
				}

				$updated[$line['jbcontractbudget_id']] = true;
			}
		}
	}

	/**
	 * Deletes an invoice
	 * @param  int $invoice_id
	 */
	public function deleteEntity($entity_id) {
		$gtw     = "{$this->gateway}Gateway";
		$itemGtw = "{$this->itemGateway}Gateway";

		$errors = [];
		$this->$gtw->beginTransaction();
		
		$userprofile_id               = $this->securityService->getUserId();
		$delegation_to_userprofile_id = $this->securityService->getDelegatedUserId();

		try {
			// Get all lines for this invoice
			$lines = $this->$itemGtw->find("{$this->pkField} = ?", [$entity_id], null, [$this->itemPkField]);
			// Loop through line items to delete
			foreach ($lines as $item) {
				// Delete the line item
				$result = $this->deleteLine($item[$this->itemPkField]);

				// Error handling
				if (!$result['success']) {
					$errors = array_merge($errors, $result['errors']);
					break;
				}
			}

			if (!count($errors)) {
				$result = $this->unassignImage($entity_id);

				// Error handling
				if (!$result['success']) {
					$this->entityValidator->addError(
						$errors,
						'global',
						'Unexpected error trying to unassign images while deleting an entity'
					);
				}
			}

			if (!count($errors)) {
				// Remove author record
				$this->recAuthorGateway->delete('table_name = ? AND tablekey_id = ?', [$this->table, $entity_id]);

				// Remove scheduling data
				$result = $this->removeScheduling($entity_id);

				// Error handling
				if (!$result['success']) {
					$this->entityValidator->addError(
						$errors,
						'global',
						'Unexpected error trying to remove scheduling data for entity'
					);
				}
			}

			// Before deleting, we need to get all the contract lines so we can update
			// job costing contracts following the deletion of records
			$lines = $this->jbJobAssociationGateway->findContractLinesByEntity($this->table, $entity_id);
			
			if (!count($errors)) {
				$this->$gtw->delete("{$this->pkField} = ?", [$entity_id]);
			}

			// Update job costing contract total as needed
			if (!count($errors)) {
				$this->updateContractActuals($lines);
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
	 * Removes any scheduling attached to the invoice (applies to scheduled templates)
	 * @param  int $invoice_id
	 */
	public function removeScheduling($entity_id) {
		$errors = [];
		$this->recurringSchedulerGateway->beginTransaction();
		
		try {
			$this->scheduledTasksGateway->deleteByEntity($this->table, $entity_id);

			$this->recurringSchedulerGateway->delete(
				['table_name'=>'?', 'tablekey_id'=>'?'],
				[$this->table, $entity_id]
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
	 * Forwards an entity by email to a list of emails or users
	 */
	public function forwardEntity($entity_id, $sender_email, $forward_to, $forward_val, $message, $includes=[], $forward_table_name=null) {
		$gtw = "{$this->gateway}Gateway";
		$rendererClass = "NP\\{$this->module}\\" . ucfirst($this->type) . 'PdfRenderer';
		$pdfPath = null;
		$success = false;
		$errors  = [];

		if (empty($forward_table_name)) {
			$forward_table_name = $this->table;
		}

		// Get entity number for email subject line
		$ref = $this->$gtw->findValue(
			[$this->pkField=>'?'],
			[$entity_id],
			"{$this->table}_ref"
		);

		// Figure out the email or list of emails to send to
		if ($forward_to == 'vendor' || $forward_to == 'email') {
			$users = [['email_address' => $forward_val]];
		} else {
			$users = $this->userprofileGateway->find(
				[['in', 'u.userprofile_id', $this->userprofileGateway->createPlaceholders($forward_val)]],
				$forward_val
			);
		}

		// Generate the entity PDF
		$pdf = new $rendererClass($this->configService, $this->gatewayManager, $this, $entity_id, $includes);
		$pdfPath = $this->configService->getClientFolder() . '/web/pdfs/' . $this->securityService->getUserId();

		// If destination directory doesn't exist, create it
  		if (!is_dir($pdfPath)) {
  			mkdir($pdfPath, 0777, true);
  		}
  		
		$pdfPath = Util::getUniqueFileName($pdfPath . "/{$this->type}_{$entity_id}.pdf");

		$pdfPath = $pdfPath['path'];
		$pdf->save($pdfPath);

		$message = strip_tags(trim($message));

		// Get entity images if applicable
		$images      = [];
		$options     = $pdf->getOptions();
		$includeAll  = (array_key_exists('allImages', $options) && $options['allImages']);
		$includeMain = (array_key_exists('mainImage', $options) && $options['mainImage']);
		if ($includeMain || $includeAll) {
			$images = $this->getImages($entity_id, !$includeAll, true);
			if (!$includeAll) {
				$images = [$images];
			}
		}

		foreach ($users as $user) {
			try {
				$msg = EmailMessage::getNew(
										"{$this->title} {$ref}",
										strip_tags($message),
										'text/plain'
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
					'table_name'                        => $forward_table_name,
					'tablekey_id'                       => $entity_id,
					'forward_to_email'                  => $user['email_address'],
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

	/**
	 * Cancels a line on a PO
	 */
	public function cancelLine($poitem_id) {
		$errors = [];
		$now    = \NP\util\Util::formatDateForDB();
		$this->poItemGateway->beginTransaction();
		
		try {
			$this->poItemGateway->update([
				'poitem_id'                    => $poitem_id,
				'reftable_name'                => 'invoiceitem',
				'reftablekey_id'               => 0,
				'poitem_cancel_userprofile_id' => $this->securityService->getUserId(),
				'poitem_cancel_dt'             => $now
			]);

			$purchaseorder_id = $this->poItemGateway->findValue(
				'poitem_id = ?',
				[$poitem_id],
				'purchaseorder_id'
			);

			$status = $this->purchaseOrderGateway->findValue(
				'purchaseorder_id = ?',
				[$purchaseorder_id],
				'purchaseorder_status'
			);

			$unlinked = $this->poItemGateway->findUnlinkedItems($purchaseorder_id);

			if (count($unlinked) == 0) {
				$status = 'closed';
				// If there are no more linked items, cancel the PO
				$this->purchaseOrderGateway->update([
					'purchaseorder_id'     => $purchaseorder_id,
					'purchaseorder_status' => $status
				]);
			}

			$rctitem_id = $this->rctItemGateway->findValue(
				['rctitem_status'=>"'open'", 'poitem_id'=>'?'],
				[$poitem_id],
				'rctitem_id'
			);

			if (!empty($rctitem_id)) {
				$result = $this->cancelReceiptLine($rctitem_id);

				if (!$result['success']) {
					$errors = $result['errors'];
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
			'success'              => (count($errors)) ? false : true,
			'errors'               => $errors,
			'purchaseorder_status' => $status
		);
	}
}