<?php

namespace NP\security;

use NP\core\AbstractService;
use NP\user\UserprofileGateway;
use NP\user\RoleGateway;
use NP\user\UserprofileLogonGateway;
use NP\user\ModulePrivGateway;
use NP\system\SessionService;
use NP\util\Util;

/**
 * Service class for operations related to application security
 *
 * @author Thomas Messier
 */
class SecurityService extends AbstractService {
	
	/**
	 * @var \NP\system\SessionService
	 */
	protected $sessionService;

	/**
	 * @var \NP\user\UserprofileGateway
	 */
	protected $userprofileGateway;

	/**
	 * @var \NP\user\RoleGateway
	 */
	protected $roleGateway;
	
	/**
	 * @var \NP\user\UserprofileLogonGateway
	 */
	protected $userprofileLogonGateway;
	
	/**
	 * @var \NP\user\ModulePrivGateway
	 */
	protected $modulePrivGateway;
	
	/**
	 * @param \NP\system\SessionService        $sessionService          SessionService object injected
	 * @param \NP\user\UserprofileGateway      $userprofileGateway      UserprofileGateway object injected
	 * @param \NP\user\RoleGateway             $roleGateway             RoleGateway object injected
	 * @param \NP\user\UserprofileLogonGateway $userprofileLogonGateway UserprofileLogonGateway object injected
	 * @param \NP\user\ModulePrivGateway       $modulePrivGateway       ModulePrivGateway object injected
	 */
	public function __construct(SessionService $sessionService, UserprofileGateway $userprofileGateway, RoleGateway $roleGateway,
								UserprofileLogonGateway $userprofileLogonGateway, ModulePrivGateway $modulePrivGateway) {
		$this->sessionService = $sessionService;
		$this->userprofileGateway = $userprofileGateway;
		$this->roleGateway = $roleGateway;
		$this->userprofileLogonGateway = $userprofileLogonGateway;
		$this->modulePrivGateway = $modulePrivGateway;
	}

	/**
	 * Gets the authentication implementation for the site being accessed
	 *
	 * @return \NP\security\auth\AuthenticationInterface 
	 */
	public function getAuthenticator() {
		return new auth\StandardAuthenticator($this->userprofileGateway);
	}
	
	/**
	 * Logs a user into the application 
	 *
	 * @param  string $username
	 * @return int    If authentication succeeds, returns the userprofile_id of the user, otherwise returns 0
	 */
	public function login($username) {
		$user = $this->userprofileGateway->find(array('userprofile_username'=>'?'), array($username));
		$userprofile_id = $user[0]['userprofile_id'];

		// Save the user ID to the session
		$this->setUserId($userprofile_id);
		$this->setDelegatedUserId($userprofile_id);
		
		// Save the user permissions to the session
		$this->setUserPermissions($userprofile_id);
		
		// Log the user's login
		$this->userprofileLogonGateway->insert(array(
			"userprofile_id"			=> $userprofile_id,
			"userprofilelogon_datetm"	=> Util::formatDateForDB(time()),
			"userprofilelogon_ip"		=> $_SERVER["REMOTE_ADDR"],
		));
		
		return $userprofile_id;
	}
	
	/**
	 * Changes the delegated user logged into the application
	 *
	 * @param  int $userprofile_id 
	 * @return array               A user record
	 */
	public function changeUser($userprofile_id) {
		$this->setUserId($userprofile_id);
		$this->setUserPermissions($userprofile_id);
		return $this->getUser();
	}
	
	/**
	 * Logs the user out of the application
	 */
	public function logout() {
		$this->sessionService->remove("userprofile_id");
		$this->sessionService->remove("module_id_list");
	}
	
	/**
	 * Checks if a user is a valid user session is active
	 *
	 * @return boolean 
	 */
	public function isSessionAuthenticated() {
		return $this->sessionService->exists("userprofile_id");
	}
	
	public function setUserId($userprofile_id) {
		$this->sessionService->set("userprofile_id", $userprofile_id);
	}
	
	/**
	 * Gets a record for the active user currently signed in
	 *
	 * @return array A user record
	 */
	public function getUser() {
		return $this->userprofileGateway->findById($this->getUserId());
	}
	
	/**
	 * Gets a record for the role of the actual user currently signed in
	 *
	 * @return array A role record
	 */
	public function getRole() {
		return $this->roleGateway->findByUser($this->getUserId(), array('role_id','role_name','is_admin_role'));
	}
	
	/**
	 * Gets a record for the actual user currently signed in
	 *
	 * @return array A user record
	 */
	public function getDelegatedToUser() {
		return $this->userprofileGateway->findById($this->getDelegatedUserId());
	}
	
	/**
	 * Gets ID of the active user signed in
	 *
	 * @return int
	 */
	public function getUserId() {
		return $this->sessionService->get("userprofile_id");
	}
	
	public function setDelegatedUserId($userprofile_id) {
		$this->sessionService->set("delegation_to_userprofile_id", $userprofile_id);
	}
	
	/**
	 * Gets ID of the user signed in
	 *
	 * @return int
	 */
	public function getDelegatedUserId() {
		return $this->sessionService->get("delegation_to_userprofile_id");
	}
	
	/**
	 * Sets permissions for the user session
	 *
	 * @param string $module_id_list
	 */
	public function setPermissions($module_id_list) {
		$this->sessionService->set("module_id_list", $module_id_list);
	}
	
	/**
	 * Gets permissions for user currently signed in
	 *
	 * @return string
	 */
	public function getPermissions() {
		return $this->sessionService->get("module_id_list");
	}
	
	/**
	 * Checks if the user signed in has a specific permission
	 *
	 * @param  int $module_id
	 * @return boolean
	 */
	public function hasPermission($module_id) {
		return array_key_exists($module_id, $this->sessionService->get("module_id_list"));
	}
	
	/**
	 * Set permissions for a specific user
	 *
	 * @param  int $userprofile_id
	 */
	protected function setUserPermissions($userprofile_id) {
		// Retrieve the user permissions
		$module_id_list = $this->modulePrivGateway->getModuleListByUser($userprofile_id);
		
		// Save the user permissions to the session
		$this->setPermissions($module_id_list);
	}
}

?>