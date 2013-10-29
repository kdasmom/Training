<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/15/13
 * Time: 4:30 AM
 */

namespace NP\vendor;


use NP\core\AbstractService;

class InsuranceService extends AbstractService {
	protected $insuranceGateway;

	public function __construct(InsuranceGateway $insuranceGateway) {
		$this->insuranceGateway = $insuranceGateway;
	}

	/**
	 * Retrieve all insurance's types
	 *
	 * @return array|bool
	 */
	public function getAllTypes() {
		return $this->insuranceGateway->findTypes();
	}

	/**
	 * find insurances
	 *
	 * @param $vendor_id
	 * @return array
	 */
	public function getVendorInsurances($vendor_id) {
		return $this->insuranceGateway->find(['table_name' => '?', 'tablekey_id' => '?'], ['vendor', $vendor_id]);
	}
} 