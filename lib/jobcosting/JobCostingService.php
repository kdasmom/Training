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
	public function getContracts($vendorsite_id=null, $status=null, $keyword=null, $sort='jbcontract_name') {
		return $this->jbContractGateway->findByVendorsite($vendorsite_id, $status, $keyword, $sort);
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
	public function getChangeOrders($jbcontract_id=null, $keyword=null, $sort='jbchangeorder_name') {
		if (!empty($jbcontract_id)) {
			return $this->jbChangeOrderGateway->findByContract($jbcontract_id, $keyword, $sort);
		} else {
			return [];
		}
	}
	
	/**
	 * Get job costing job codes
	 */
	public function getJobCodes($status=null, $sort='jbjobcode_name') {
		$where  = null;
		$params = null;

		if (!empty($status)) {
			$where  = array('jbjobcode_status' => '?');
			$params = array($status);
		}

		return $this->jbJobCodeGateway->find($where, $params, $sort);	
	}

	public function getJobCodesByFilter($property_id=null, $jbcontract_id=null, $jbchangeorder_id=null, $status=null, $keyword=null, $sort='jbjobcode_name') {
		if (empty($property_id) && empty($jbcontract_id) && empty($jbchangeorder_id)) {
			return [];
		} else {
			return $this->jbJobCodeGateway->findByFilter($property_id, $jbcontract_id, $jbchangeorder_id, $status, $keyword, $sort);
		}
	}

	/**
	 * Get job costing phase codes
	 */
	public function getPhaseCodes($jbcontract_id=null, $jbchangeorder_id=null, $jbjobcode_id=null, $keyword=null, $sort='jbphasecode_name') {
		if (empty($jbjobcode_id)) {
			return [];
		} else {
			return $this->jbPhaseCodeGateway->findByFilter($jbcontract_id, $jbchangeorder_id, $jbjobcode_id, $keyword, $sort);
		}
	}
	
	/**
	 * Get job costing cost codes
	 */
	public function getCostCodes($jbcontract_id=null, $jbchangeorder_id=null, $jbjobcode_id=null, $jbphasecode_id=null, $keyword=null, $sort='jbcostcode_name') {
		if (empty($jbjobcode_id)) {
			return [];
		} else {
			return $this->jbCostCodeGateway->findByFilter($jbcontract_id, $jbchangeorder_id, $jbjobcode_id, $jbphasecode_id, $keyword, $sort);
		}
	}

	/**
	 * Saves job costing info for an invoice, PO, or receipt
	 */
	public function saveJobCostingInfo($data) {
		$errors = [];
		$this->jbJobAssociationGateway->beginTransaction();
		
		try {
			$data['table_name'] = strtolower($data['table_name']);
			if ($data['table_name'] == 'poitem') {
				$gtw = 'poItemGateway';
			} else if ($data['table_name'] == 'invoiceitem') {
				$gtw = 'invoiceItemGateway';
			} else if ($data['table_name'] == 'rctitem'){
				$gtw = 'rctItemGateway';
			}

			$jbjobassociation_id = $this->jbJobAssociationGateway->findValue(
				'table_name = ? AND tablekey_id = ?',
				[$data['table_name'], $data['tablekey_id']],
				'jbjobassociation_id'
			);

			// If there's job costing info, save it
			if ($data['jbjobcode_id'] !== null) {
				if ($jbjobassociation_id !== null) {
					$data['jbjobassociation_id'] = $jbjobassociation_id;
				}

				// Create the invoice entity with initial data
				$job = new JbJobAssociationEntity($data);

				// Validate invoice record
				$errors = $this->entityValidator->validate($job);

				if (!count($errors)) {
					$this->jbJobAssociationGateway->save($job);
				}

				$item_jobflag = 1;
			} else {
				if ($jbjobassociation_id !== null) {
					$this->jbJobAssociationGateway->delete('jbjobassociation_id = ?', [$jbjobassociation_id]);
				}
				$item_jobflag = 0;
			}

			// Set the item_jobflag
			$this->$gtw->update([
				"{$data['table_name']}_id"      => $data['tablekey_id'],
				"{$data['table_name']}_jobflag" => $item_jobflag
			]);
		} catch(\Exception $e) {
			$errors[]  = array('field' => 'global', 'msg' => $this->handleUnexpectedError($e));
		}
		
		if (count($errors)) {
			$this->jbJobAssociationGateway->rollback();
		} else {
			$this->jbJobAssociationGateway->commit();
		}
		
		return array(
		    'success' => (count($errors)) ? false : true,
		    'errors'  => $errors
		);
	}
	
}

?>