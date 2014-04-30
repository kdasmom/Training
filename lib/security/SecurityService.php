<?php

namespace NP\security;

use NP\core\AbstractService;
use NP\system\ConfigService;
use NP\system\SessionService;
use NP\system\SiteService;
use NP\util\Util;
use NP\core\validation\EntityValidator;

/**
 * Service class for operations related to application security
 *
 * @author Thomas Messier
 */
class SecurityService extends AbstractService {
	
	protected $siteService, $sessionService;
	
	public function __construct($config, SiteService $siteService, SessionService $sessionService) {
		$this->config                  = $config;
		$this->siteService             = $siteService;
		$this->sessionService          = $sessionService;
	}

	/**
	 * Gets the authentication implementation for the site being accessed
	 *
	 * @return \NP\security\auth\AuthenticationInterface 
	 */
	public function getAuthenticator() {
		$configPath = $this->config['appRoot'] . '/clients/' . $this->siteService->getAppName() . '/authentication_config.php';
		if (file_exists($configPath)) {
			$config = include $configPath;
			$className = '\\NP\\security\\auth\\' . ucfirst($config['type']) . 'Authenticator';
			$authenticator = new $className();
			foreach ($config as $key=>$val) {
				if ($key != 'type') {
					$fn = 'set' . ucfirst($key);
					$authenticator->$fn($val);
				}
			}
			return $authenticator;
		} else {
			return new auth\StandardAuthenticator($this->userprofileGateway, $this->localizationService);
		}
	}
	
	/**
	 * Logs a user into the application 
	 *
	 * @param  string $username
	 * @return int    If authentication succeeds, returns the userprofile_id of the user, otherwise returns 0
	 */
	public function login($username) {
		// Get the user record
		$user = $this->userprofileGateway->find(
			array(
				'u.userprofile_username' => '?',
				'u.userprofile_status'   => '?'
			),
			array($username, 'active')
		);

		// If we find the user, proceed with login
		if (count($user)) {
			$user = $user[0];
		
			$userprofile_id = $user['userprofile_id'];

			// Save the user ID to the session
			$this->setUserId($userprofile_id);
			$this->setDelegatedUserId($userprofile_id);
			
			// Save the user permissions to the session
			$this->setUserPermissions($userprofile_id);

			// Set the initial property context
			$this->setContextForUser();
			
			// Log the user's login
			$this->userprofileLogonGateway->insert(array(
				"userprofile_id"			=> $userprofile_id,
				"userprofilelogon_datetm"	=> Util::formatDateForDB(),
				"userprofilelogon_ip"		=> $_SERVER["REMOTE_ADDR"],
			));
			
			return $userprofile_id;
		// Otherwise return false to indicate login failed
		} else {
			return 0;
		}
	}

	/**
	 * Sets the context for the user currently logged in
	 */
	public function setContextForUser() {
		$user = $this->getUser();
		$preferredProp = $user['userprofile_preferred_property'];
		$preferredRegion = $user['userprofile_preferred_region'];
		$regions = $this->regionGateway->findByUser($this->getUserId(), $this->getDelegatedUserId());
		$props = $this->propertyGateway->findByUser($this->getUserId(), $this->getDelegatedUserId(), [1,-1], null, false, array('property_id'));
		if (is_numeric($preferredRegion) && $preferredRegion) {
			$this->setContext('region', $props[0]['property_id'], $preferredRegion);
		} else if (is_numeric($preferredProp) && $preferredProp) {
			$this->setContext('property', $preferredProp, $regions[0]['region_id']);
		} else {
			$this->setContext('all', $props[0]['property_id'], $regions[0]['region_id']);
		}
		
		return $user;
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

		// Set the initial property context
		$user = $this->setContextForUser();

		return $user;
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
	
	/**
	 * Sets the property context
	 *
	 * @param string $type
	 * @param int    $property_id
	 * @param int    $region_id
	 */
	public function setContext($type, $property_id, $region_id) {
		$this->sessionService->set('global_context', array('type'=>$type, 'property_id'=>$property_id, 'region_id'=>$region_id));
	}
	
	/**
	 * Gets the property context
	 *
	 * @return array
	 */
	public function getContext() {
		return $this->sessionService->get('global_context');
	}

	/**
	 * Returns a module tree starting from a certain module
	 */
	public function getModuleTree($module_id=0, $getAsHierarchy=0, $leafOnly=0, $showCheckboxes=1, $showLeafIcons = 1, $modulesList = []) {
		$modules = $this->moduleGateway->findForTree();
		$tree = array();
		$startParent = 0;
		foreach ($modules as $module) {
			if ($module_id !== 0 && $module_id === $module['module_id']) {
				$startParent = $module['tree_parent'];
			}
			if (!array_key_exists($module['tree_parent'], $tree)) {
				$tree[$module['tree_parent']] = array();
			}
			$tree[$module['tree_parent']][] = $module;
		}

		$tree = $this->buildTree($tree, $startParent, 0, $getAsHierarchy, $leafOnly, $showCheckboxes, $showLeafIcons);

		return $tree;
	}

	private function buildTree($tree, $parent, $level=0, $getAsHierarchy=0, $leafOnly=0, $showCheckboxes=1, $showLeafIcons = 1) {
		$modules = array();
		if (array_key_exists($parent, $tree)) {
			foreach($tree[$parent] as $treeItem) {
				$modules[] = array(
					'module_id'   => $treeItem['module_id'],
					'module_name' => $treeItem['module_name']
				);
				$newlevel = $level + 1;
				$pos = count($modules) - 1;
				if ($getAsHierarchy) {
					$modules[$pos]['children'] = $this->buildTree($tree, $treeItem['tree_id'], $newlevel, $getAsHierarchy, $leafOnly, $showCheckboxes, $showLeafIcons);
					if ($showCheckboxes) {
						$modules[$pos]['checked'] = false;
					}
					if (!count($modules[$pos]['children'])) {
						$modules[$pos]['leaf'] = true;
						if (!$showLeafIcons) {
							$modules[$pos]['cls'] = 'noicon';
						}
						unset($modules[$pos]['children']);
					} else {
						if ($leafOnly) {
							$modules[$pos]['cls'] = ($leafOnly) ? 'leaf' : 'folder';
						}
						$modules[$pos]['leaf'] = false;
					}
				} else {
					$modules[$pos]['level'] = $level;
					$modules[$pos]['indent_text'] = str_repeat('&nbsp;', $level*5);
					$modules = array_merge($modules, $this->buildTree($tree, $treeItem['tree_id'], $newlevel, $getAsHierarchy, $leafOnly, $showCheckboxes, $showLeafIcons));
				}
			}
		}
		return $modules;
	}

	/**
	 * Get permissions for a role
	 *
	 * @param  int $role_id Id of role to get permissions for
	 * @return array        Associative array of module_ids with true as the value
	 */
	public function getRolePermissions($role_id) {
		$modules = $this->modulePrivGateway->find(
			array('table_name'=>'?', 'tablekey_id'=>'?'),
			array('role', $role_id),
			null,
			array('module_id')
		);

		return \NP\util\Util::valueList($modules, 'module_id', true);
	}

	/**
	 * Saves permissions assigned to a role
	 *
	 * @param  array $module_id_list Array of module_ids
	 * @return array
	 */
	public function saveRolePermissions($role_id, $module_id_list) {
		$this->modulePrivGateway->beginTransaction();

		$error = '';
		try {
			$this->modulePrivGateway->delete(
				array('table_name'=>'?', 'tablekey_id'=>'?'),
				array('role', $role_id)
			);

			$now = \NP\util\Util::formatDateForDB();

			foreach($module_id_list as $module_id) {
				$modulePriv = new \NP\security\ModulePrivEntity(array(
					'table_name'               => 'role',
					'tablekey_id'              => $role_id,
					'module_id'                => $module_id,
					'modulepriv_dategranted'   => $now,
					'modulepriv_effectivedate' => $now
				));

				$errors = $this->entityValidator->validate($modulePriv);
				if (!count($errors)) {
					$this->modulePrivGateway->save($modulePriv);
				} else {
					$error = $this->localizationService->getMessage('unexpectedError');
					break;
				}
			}
		} catch(\Exception $e) {
			$error = $this->handleUnexpectedError($e);
		}

		if ($error == '') {
			$this->modulePrivGateway->commit();
		} else {
			$this->modulePrivGateway->rollback();
		}

		return array(
			'success' => ($error == '') ? true : false,
			'error'   => $error
		);
	}

	/**
	 * Copies permissions from one role to another
	 *
	 * @param  int   $from_role_id
	 * @param  int   $to_role_id
	 * @return array
	 */
	public function copyRolePermissions($from_role_id, $to_role_id) {
		$error = '';
		$this->modulePrivGateway->beginTransaction();
		try {
			$this->modulePrivGateway->copyToRole($from_role_id, $to_role_id);
		} catch(\Exception $e) {
			$error = $this->handleUnexpectedError($e);
		}

		if ($error == '') {
			$this->modulePrivGateway->commit();
		} else {
			$this->modulePrivGateway->rollback();
		}

		return array(
			'success' => ($error == '') ? true : false,
			'error'   => $error
		);
	}
}

?>