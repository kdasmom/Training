<?php

namespace NP\user;

use NP\core\AbstractService;
use NP\system\SecurityService;
use NP\property\PropertyGateway;
use NP\property\RegionGateway;
use NP\gl\GLAccountGateway;

class UserService extends AbstractService {
	
	protected $securityService, $propertyGateway, $regionGateway, $glaccountGateway;
	
	public function __construct(SecurityService $securityService, PropertyGateway $propertyGateway, RegionGateway $regionGateway, GLAccountGateway $glaccountGateway) {
		$this->securityService = $securityService;
		$this->propertyGateway = $propertyGateway;
		$this->regionGateway = $regionGateway;
		$this->glaccountGateway = $glaccountGateway;
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
	
}

?>