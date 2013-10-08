<?php
/**
 * Created by PhpStorm.
 * User: rnixx
 * Date: 10/8/13
 * Time: 11:38 AM
 */

namespace NP\contact;


use NP\core\AbstractService;

class AddressService extends AbstractService {
	protected $addressGateway;

	public function __construct(AddressGateway $addressGateway) {
		$this->addressGateway = $addressGateway;
	}

	/**
	 * Retrieve states list
	 *
	 * @return array|bool
	 */
	public function getStates() {
		return $this->addressGateway->getStates();
	}
} 