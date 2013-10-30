<?php

namespace NP\shared;

use NP\core\AbstractService;

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

	protected $table, $itemTable, $pkField, $itemPkField, $configService;
	
	public function __construct() {
		if ($this->type === 'invoice') {
			$this->table     = 'invoice';
			$this->itemTable = 'invoiceitem';
		} else if ($this->type === 'po') {
			$this->table     = 'purchaseorder';
			$this->itemTable = 'poitem';
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

		$gateway = "{$this->table}Gateway";
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

}