<?php

namespace NP\jobcosting;

use NP\core\AbstractService;

/**
 * Service class for operations related to Job Costing
 *
 * @author Thomas Messier
 */
class JobCostingService extends AbstractService {
	
	/**
	 * Get job costing contracts
	 */
	public function getContracts($vendorsite_id=null, $sort='jbcontract_name', $status = null) {
		if ($vendorsite_id !== null) {
			return $this->jbContractGateway->findByVendorsite($vendorsite_id, $sort);
		} else {
			$where  = null;
			$params = null;
			if ($status !== null) {
				$where  = array('jbcontract_status' => '?');
				$params = array($status);
			}
			return $this->jbContractGateway->find($where, $params, $sort);
		}
	}
	
	/**
	 * Get job costing contract/change orders relation
	 */
	public function getContractChangeOrders() {
		return $this->jbContractChangeOrderGateway->find();
	}
	
	/**
	 * Get job costing change orders
	 */
	public function getChangeOrders($jbcontract_id=null, $sort='jbchangeorder_name') {
		if ($jbcontract_id !== null) {
			return $this->jbChangeOrderGateway->findByContract($jbcontract_id, $sort);
		} else {
			return $this->jbChangeOrderGateway->find(null, null, $sort);
		}
	}
	
	/**
	 * Get job costing change orders
	 */
	public function getJobCodes($property_id=null, $jbcontract_id=null, $jbchangeorder_id=null, $sort='jbjobcode_name', $status=null) {
		if ($property_id === null && $jbcontract_id === null && $jbchangeorder_id === null) {
			$where  = null;
			$params = null;
			if ($status !== null) {
				$where  = array('jbjobcode_status' => '?');
				$params = array($status);
			}
			return $this->jbJobCodeGateway->find($where, $params, $sort);
		} else {
			return $this->jbJobCodeGateway->findByFilter($property_id, $jbcontract_id, $jbchangeorder_id, $sort);
		}
	}

	/**
	 * Get job costing phase codes
	 */
	public function getPhaseCodes($jbcontract_id=null, $jbchangeorder_id=null, $jbjobcode_id=null, $sort='jbphasecode_name') {
		if ($jbcontract_id === null && $jbchangeorder_id === null && $jbjobcode_id === null) {
			return $this->jbPhaseCodeGateway->find(null, null, $sort);
		} else {
			return $this->jbPhaseCodeGateway->findByFilter($jbcontract_id, $jbchangeorder_id, $jbjobcode_id, $sort);
		}
	}
	
	/**
	 * Get job costing cost codes
	 */
	public function getCostCodes($jbcontract_id=null, $jbchangeorder_id=null, $jbjobcode_id=null, $jbphasecode_id=null, $sort='jbcostcode_name') {
		if ($jbcontract_id === null && $jbchangeorder_id === null && $jbjobcode_id === null && $jbphasecode_id === null) {
			return $this->jbCostCodeGateway->find(null, null, $sort);
		} else {
			return $this->jbCostCodeGateway->findByFilter($jbcontract_id, $jbchangeorder_id, $jbjobcode_id, $jbphasecode_id, $sort);
		}
	}
	
}

?>