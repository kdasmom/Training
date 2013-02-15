<?php

namespace NP\user;

use NP\core\AbstractService;
use NP\invoice\InvoiceService;
use NP\system\SecurityService;
use NP\property\PropertyGateway;
use NP\property\RegionGateway;
use NP\gl\GLAccountGateway;

/**
 * Service class for operations related to application users
 *
 * @author Thomas Messier
 */
class UserService extends AbstractService {
	/**
	 * @var NP\system\SecurityService
	 */
	protected $securityService;
	/**
	 * @var NP\system\InvoiceService
	 */
	protected $invoiceService;
	
	/**
	 * @var NP\property\PropertyGateway
	 */
	protected $propertyGateway;
	
	/**
	 * @var NP\property\RegionGateway
	 */
	protected $regionGateway;
	
	/**
	 * @var NP\gl\GLAccountGateway
	 */
	protected $glaccountGateway;

	/**
	 * @var NP\user\DelegationGateway
	 */
	protected $delegationGateway;

	/**
	 * @param NP\system\SecurityService    $securityService   SecurityService object injected by Zend Di
	 * @param NP\invoice\InvoiceService    $invoiceService    InvoiceService object injected by Zend Di
	 * @param NP\property\PropertyGateway  $propertyGateway   PropertyGateway object injected by Zend Di
	 * @param NP\invoice\RegionGateway     $regionGateway     RegionGateway object injected by Zend Di
	 * @param NP\invoice\GLAccountGateway  $gLAccountGateway  GLAccountGateway object injected by Zend Di
	 * @param NP\invoice\DelegationGateway $delegationGateway DelegationGateway object injected by Zend Di
	 */
	public function __construct(SecurityService $securityService, InvoiceService $invoiceService, PropertyGateway $propertyGateway, RegionGateway $regionGateway, 
								GLAccountGateway $glaccountGateway, DelegationGateway $delegationGateway) {
		$this->securityService = $securityService;
		$this->invoiceService = $invoiceService;
		$this->propertyGateway = $propertyGateway;
		$this->regionGateway = $regionGateway;
		$this->glaccountGateway = $glaccountGateway;
		$this->delegationGateway = $delegationGateway;
	}
	
	/**
	 * Get properties for the user signed in
	 *
	 * @return array Array of property records
	 */
	public function getProperties() {
		$userprofile_id = $this->securityService->getUserId();
		$delegated_to_userprofile_id = $this->securityService->getDelegatedUserId();

		return $this->propertyGateway->findByUser($userprofile_id, $delegated_to_userprofile_id);
	}
	
	/**
	 * Get regions for the user signed in
	 *
	 * @return array Array of region records
	 */
	public function getRegions() {
		$userprofile_id = $this->securityService->getUserId();
		$delegated_to_userprofile_id = $this->securityService->getDelegatedUserId();
		
		return $this->regionGateway->findByUser($userprofile_id, $delegated_to_userprofile_id);
	}
	
	/**
	 * Get GL accounts for the user signed in
	 *
	 * @return array Array of glaccount records
	 */
	public function getUserGLAccounts() {
		return $this->glaccountGateway->findUserGLAccounts($this->securityService->getUserId());
	}
	
	/**
	 * Get delegations for the user signed in
	 *
	 * @param string $toFrom            Whether to get delegations to the user or from (made by) the user; valid values are "from" and "to"
	 * @param int    $delegation_status Filter the delegation records by delegation_status (optional); defaults to null, valid values are 1 and 0
	 * @return array Array of delegation records
	 */
	public function getDelegations($toFrom, $delegation_status=null) {
		return $this->delegationGateway->findUserDelegations($this->securityService->getDelegatedUserId(), $toFrom, $delegation_status);
	}
	
	/**
	 * Get delegations to user signed in; shortcut for getDelegations('to', ...)
	 *
	 * @param int    $delegation_status Filter the delegation records by delegation_status (optional); defaults to null, valid values are 1 and 0
	 * @return array Array of delegation records
	 */
	public function getDelegationsTo($delegation_status=null) {
		return $this->getDelegations('to' ,$delegation_status);
	}
	
	/**
	 * Get delegations made by the user signed in; shortcut for getDelegations('from', ...)
	 *
	 * @param int    $delegation_status Filter the delegation records by delegation_status (optional); defaults to null, valid values are 1 and 0
	 * @return array Array of delegation records
	 */
	public function getDelegationsFrom($delegation_status=null) {
		return $this->getDelegations('from' ,$delegation_status);
	}

	/**
	 * Retrieve invoices for the different invoice registers for the current logged in user
	 *
	 * @param  string $tab                         The register tab to get
	 * @param  string $contextFilterType           The context filter type; valid values are 'property','region', and 'all'
	 * @param  int    $contextFilterSelection      The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int    $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int    $page                        The page for which to return records
	 * @param  string $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                               Array of invoice records
	 */
	public function getInvoiceRegister($tab, $contextFilterType, $contextFilterSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$userprofile_id = $this->securityService->getUserId();
		$delegated_to_userprofile_id = $this->securityService->getDelegatedUserId();
		
		return $this->invoiceService->getInvoiceRegister($tab, $userprofile_id, $delegated_to_userprofile_id, $contextFilterType, $contextFilterSelection, $pageSize, $page, $sort);
	}
	
}

?>