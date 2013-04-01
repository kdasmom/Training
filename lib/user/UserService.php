<?php

namespace NP\user;

use NP\core\AbstractService;
use NP\security\SecurityService;

/**
 * Service class for operations related to application users
 *
 * @author Thomas Messier
 */
class UserService extends AbstractService {
	/**
	 * @var \NP\security\SecurityService
	 */
	protected $securityService;
	
	/**
	 * @var \NP\user\DelegationGateway
	 */
	protected $delegationGateway;

	/**
	 * @var \NP\user\UserSettingGateway
	 */
	protected $userSettingGateway;

	/**
	 * @var \NP\user\UserprofileGateway
	 */
	protected $userprofileGateway;

	/**
	 * @var \NP\user\RoleGateway
	 */
	protected $roleGateway;

	/**
	 * @param \NP\security\SecurityService  $securityService    SecurityService object injected
	 * @param \NP\invoice\DelegationGateway $delegationGateway  DelegationGateway object injected
	 * @param \NP\user\UserprofileGateway   $userprofileGateway UserprofileGateway object injected
	 * @param \NP\user\RoleGateway          $roleGateway        RoleGateway object injected
	 */
	public function __construct(SecurityService $securityService, DelegationGateway $delegationGateway, UserSettingGateway $userSettingGateway, 
								UserprofileGateway $userprofileGateway, RoleGateway $roleGateway) {
		$this->securityService    = $securityService;
		$this->delegationGateway  = $delegationGateway;
		$this->userSettingGateway = $userSettingGateway;
		$this->userprofileGateway = $userprofileGateway;
		$this->roleGateway        = $roleGateway;
	}

	/**
	 * Retrieve settings for the currently logged in user
	 *
	 * @return array
	 */
	public function getSettings() {
		$userprofile_id = $this->securityService->getUserId();
		
		return $this->userSettingGateway->getForUser($userprofile_id);
	}

	/**
	 * Save a setting for the currently logged in user
	 *
	 * @param  string $name
	 * @param  string $value
	 * @return 
	 */
	public function saveSetting($name, $value) {
		$userprofile_id = $this->securityService->getUserId();
		$dataSet = array(
			'userprofile_id'    => $userprofile_id,
			'usersetting_name'  => $name,
			'usersetting_value' => $value
		);
		// Check if there's already a setting by that name saved
		$recs = $this->userSettingGateway->find("userprofile_id = ? AND usersetting_name = ?", array($userprofile_id, $name));
		// If there is a record, add the id to the data set so it gets updated
		if (count($recs)) {
			$dataSet['usersetting_id'] = $recs[0]['usersetting_id'];
		}

		return $this->userSettingGateway->save($dataSet);
	}
	
	/**
	 * Get delegations for the user signed in
	 *
	 * @param int    $userprofile_id    Id of user to get delegation info for
	 * @param string $toFrom            Whether to get delegations to the user or from (made by) the user; valid values are "from" and "to"
	 * @param int    $delegation_status Filter the delegation records by delegation_status (optional); defaults to null, valid values are 1 and 0
	 * @return array Array of delegation records
	 */
	public function getDelegations($userprofile_id, $toFrom, $delegation_status=null) {
		return $this->delegationGateway->findUserDelegations($userprofile_id, $toFrom, $delegation_status);
	}
	
	/**
	 * Get delegations to user signed in; shortcut for getDelegations($userprofile_id, 'to', ...)
	 *
	 * @param int    $userprofile_id    Id of user to get delegation info for
	 * @param int    $delegation_status Filter the delegation records by delegation_status (optional); defaults to null, valid values are 1 and 0
	 * @return array Array of delegation records
	 */
	public function getDelegationsTo($userprofile_id, $delegation_status=null) {
		return $this->getDelegations($userprofile_id, 'to' ,$delegation_status);
	}
	
	/**
	 * Get delegations made by the user signed in; shortcut for getDelegations($userprofile_id, 'from', ...)
	 *
	 * @param int    $userprofile_id    Id of user to get delegation info for
	 * @param int    $delegation_status Filter the delegation records by delegation_status (optional); defaults to null, valid values are 1 and 0
	 * @return array Array of delegation records
	 */
	public function getDelegationsFrom($userprofile_id, $delegation_status=null) {
		return $this->getDelegations($userprofile_id, 'from' ,$delegation_status);
	}
	
	public function isAdmin($userprofile_id) {
		$res = $this->roleGateway->findByUser($userprofile_id);
		if ($res['is_admin_role'] == 1) {
			return true;
		}

		return false;
	}
}

?>