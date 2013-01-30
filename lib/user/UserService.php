<?php

namespace NP\user;

use NP\core\AbstractService;
use NP\system\SecurityService;
use NP\property\PropertyGateway;
use NP\property\RegionGateway;
use NP\gl\GLAccountGateway;

class UserService extends AbstractService {
	
	protected $securityService, $propertyGateway, $regionGateway, $glaccountGateway, $delegationGateway;
	
	public function __construct(SecurityService $securityService, PropertyGateway $propertyGateway, RegionGateway $regionGateway, 
								GLAccountGateway $glaccountGateway, DelegationGateway $delegationGateway) {
		$this->securityService = $securityService;
		$this->propertyGateway = $propertyGateway;
		$this->regionGateway = $regionGateway;
		$this->glaccountGateway = $glaccountGateway;
		$this->delegationGateway = $delegationGateway;
	}
	
	public function getProperties() {
		return $this->propertyGateway->findByUser($this->securityService->getUserId());
	}
	
	public function getRegions() {
		return $this->regionGateway->findByUser($this->securityService->getUserId());
	}
	
	public function getUserGLAccounts() {
		return $this->glaccountGateway->findUserGLAccounts($this->securityService->getUserId());
	}
	
	public function getDelegations($toFrom, $delegation_status=null) {
		return $this->delegationGateway->findUserDelegations($this->securityService->getUserId(), $toFrom, $delegation_status);
	}
	
	public function getDelegationsTo($delegation_status=null) {
		return $this->getDelegations('to' ,$delegation_status);
	}
	
	public function getDelegationsFrom($delegation_status=null) {
		return $this->getDelegations('from' ,$delegation_status);
	}
	
}

?>