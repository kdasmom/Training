<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\user\UserprofileGateway;
use NP\user\UserprofileLogonGateway;
use NP\user\ModulePrivGateway;
use NP\system\Session;
use NP\util\Util;

class SecurityService extends AbstractService {
	
	private $userprofileGateway, $userprofileLogonGateway, $modulePrivGateway;
	
	public function __construct(Session $session, UserprofileGateway $userprofileGateway, UserprofileLogonGateway $userprofileLogonGateway, ModulePrivGateway $modulePrivGateway) {
		$this->session = $session;
		$this->userprofileGateway = $userprofileGateway;
		$this->userprofileLogonGateway = $userprofileLogonGateway;
		$this->modulePrivGateway = $modulePrivGateway;
	}
	
	public function authenticate($username, $pwd) {
		return $this->userprofileGateway->authenticate($username, $pwd);
	}
	
	public function login($username, $pwd) {
		if ($userprofile_id = $this->authenticate($username, $pwd)) {
			// Save the user ID to the session
			$this->setUserId($userprofile_id);
			$this->setDelegatedUserId($userprofile_id);
			
			// Retrieve the user permissions
			$module_id_list = $this->modulePrivGateway->getModuleListByUser($userprofile_id);
			
			// Save the user permissions to the session
			$this->setPermissions($module_id_list);
			
			// Log the user's login
			$this->userprofileLogonGateway->insert(array(
				"userprofile_id"			=> $userprofile_id,
				"userprofilelogon_datetm"	=> Util::formatDateForDB(time()),
				"userprofilelogon_ip"		=> $_SERVER["REMOTE_ADDR"],
			));
			
			return $userprofile_id;
		} else {
			return 0;
		}
	}
	
	public function logout() {
		$this->session->remove("userprofile_id");
		$this->session->remove("module_id_list");
	}
	
	public function isSessionAuthenticated() {
		return $this->session->exists("userprofile_id");
	}
	
	public function setUserId($userprofile_id) {
		$this->session->set("userprofile_id", $userprofile_id);
	}
	
	public function getUserId() {
		return $this->session->get("userprofile_id");
	}
	
	public function setDelegatedUserId($userprofile_id) {
		$this->session->set("delegation_to_userprofile_id", $userprofile_id);
	}
	
	public function getDelegatedUserId() {
		return $this->session->get("delegation_to_userprofile_id");
	}
	
	public function setPermissions($module_id_list) {
		$this->session->set("module_id_list", $module_id_list);
	}
	
	public function getPermissions() {
		return $this->session->get("module_id_list");
	}
	
	public function hasPermission($module_id) {
		return array_key_exists($module_id, $this->session->get("module_id_list"));
	}
	
}

?>