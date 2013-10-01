<?php

namespace NP\user;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\security\SecurityService;
use NP\contact\PersonGateway;
use NP\contact\AddressTypeGateway;
use NP\contact\AddressGateway;
use NP\contact\EmailTypeGateway;
use NP\contact\EmailGateway;
use NP\contact\PhoneTypeGateway;
use NP\contact\PhoneGateway;
use NP\property\PropertyGateway;
use NP\property\RegionGateway;
use NP\notification\NotificationService;
use NP\system\TreeGateway;
use NP\system\TreeEntity;

/**
 * Service class for operations related to application users
 *
 * @author Thomas Messier
 */
class UserService extends AbstractService {
	protected $securityService, $delegationGateway, $userSettingGateway, $userprofileGateway, $roleGateway,
			  $personGateway, $addressGateway, $emailGateway, $phoneGateway, $propertyUserprofileGateway,
			  $mobInfoGateway, $delegationPropGateway, $propertyGateway, $regionGateway, $notificationService,
			  $propertyUserCodingGateway, $userprofileroleGateway, $staffGateway, $addressTypeGateway,
			  $emailTypeGateway, $phoneTypeGateway, $treeGateway, $configService;

	public function __construct(SecurityService $securityService, DelegationGateway $delegationGateway, UserSettingGateway $userSettingGateway, 
								UserprofileGateway $userprofileGateway, RoleGateway $roleGateway, PersonGateway $personGateway,
								AddressGateway $addressGateway, EmailGateway $emailGateway, PhoneGateway $phoneGateway,
								PropertyUserprofileGateway $propertyUserprofileGateway, MobInfoGateway $mobInfoGateway,
								DelegationPropGateway $delegationPropGateway, PropertyGateway $propertyGateway, RegionGateway $regionGateway,
								NotificationService $notificationService, PropertyUserCodingGateway $propertyUserCodingGateway,
								UserprofileroleGateway $userprofileroleGateway, StaffGateway $staffGateway, AddressTypeGateway $addressTypeGateway,
								EmailTypeGateway $emailTypeGateway, PhoneTypeGateway $phoneTypeGateway, TreeGateway $treeGateway) {
		$this->securityService            = $securityService;
		$this->delegationGateway          = $delegationGateway;
		$this->userSettingGateway         = $userSettingGateway;
		$this->userprofileGateway         = $userprofileGateway;
		$this->roleGateway                = $roleGateway;
		$this->personGateway              = $personGateway;
		$this->addressGateway             = $addressGateway;
		$this->emailGateway               = $emailGateway;
		$this->phoneGateway               = $phoneGateway;
		$this->propertyUserprofileGateway = $propertyUserprofileGateway;
		$this->mobInfoGateway             = $mobInfoGateway;
		$this->delegationPropGateway      = $delegationPropGateway;
		$this->propertyGateway            = $propertyGateway;
		$this->regionGateway              = $regionGateway;
		$this->notificationService        = $notificationService;
		$this->propertyUserCodingGateway  = $propertyUserCodingGateway;
		$this->userprofileroleGateway     = $userprofileroleGateway;
		$this->staffGateway               = $staffGateway;
		$this->addressTypeGateway         = $addressTypeGateway;
		$this->emailTypeGateway           = $emailTypeGateway;
		$this->phoneTypeGateway           = $phoneTypeGateway;
		$this->treeGateway                = $treeGateway;
	}
	
	/**
	 * Setter function required by DI to set the config service via setter injection
	 * @param \NP\system\ConfigService $configService
	 */
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

	/**
	 * Gets info for a user
	 *
	 * @param  int   $userprofile_id ID for the user
	 * @return array
	 */
	public function get($userprofile_id) {
		$res = $this->userprofileGateway->findProfileById($userprofile_id);
		// Get property assignments for user
		$res['properties'] = $this->getUserProperties($userprofile_id, $userprofile_id, array('property_id'));
		$res['properties'] = \NP\util\Util::valueList($res['properties'], 'property_id');
		// Get coding property assignments for user
		$res['coding_properties'] = $this->getUserCodingProperties($userprofile_id, array('property_id'));
		$res['coding_properties'] = \NP\util\Util::valueList($res['coding_properties'], 'property_id');
		// Get email alerts for user
		$res['email_alerts'] = $this->notificationService->getUserNotifications($userprofile_id);
		// Get email alert hours for user
		$res['email_hours'] = $this->notificationService->getUserEmailFrequency($userprofile_id);

		return $res;
	}

	/**
	 * Get all users in the application
	 *
	 * @param  string $userprofile_status The status of the user (optional); valid values are 'active' or 'inactive'
	 * @return array
	 */
	public function getAll($userprofile_status=null, $property_id=null, $role_id=null, $module_id=null, $pageSize=null, $page=1, $sort='person_lastname') {
		return $this->userprofileGateway->findByFilter($userprofile_status, $property_id, $role_id, $module_id, $pageSize, $page, $sort);
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
	 * Returns a role tree starting from a certain role
	 */
	public function getRoleTree($role_id=null) {
		$roles = $this->roleGateway->findForTree();
		$tree = array();
		$startParent = 0;
		foreach ($roles as $role) {
			if ($role_id !== null && $role_id === $role['role_id']) {
				$startParent = $role['tree_parent'];
			}
			if (!array_key_exists($role['tree_parent'], $tree)) {
				$tree[$role['tree_parent']] = array();
			}
			$tree[$role['tree_parent']][] = $role;
		}

		$tree = $this->buildTree($tree, $startParent, 0);

		return $tree;
	}

	private function buildTree($tree, $parent, $level=0) {
		$roles = array();
		if (array_key_exists($parent, $tree)) {
			foreach($tree[$parent] as $treeItem) {
				$roles[] = array(
					'role_id'     => $treeItem['role_id'],
					'role_name'   => $treeItem['role_name'],
					'level'       => $level,
					'indent_text' => str_repeat('&nbsp;', $level*5)
				);
				$newlevel = $level + 1;
				$roles = array_merge($roles, $this->buildTree($tree, $treeItem['tree_id'], $newlevel));
			}
		}
		return $roles;
	}

	/**
	 * Get properties a user has permissions to
	 *
	 * @param  int   $userprofile_id              The active user ID, can be a delegated account
	 * @param  int   $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @return array                              Array of property records
	 */
	public function getUserProperties($userprofile_id, $delegated_to_userprofile_id, $cols=array('property_id','property_id_alt','property_name','property_status','integration_package_id')) {
		return $this->propertyGateway->findByUser($userprofile_id, $delegated_to_userprofile_id, $cols);
	}

	/**
	 * Get coding access only properties a user has permissions to
	 *
	 * @param  int   $userprofile_id              The active user ID, can be a delegated account
	 * @return array                              Array of property records
	 */
	public function getUserCodingProperties($userprofile_id, $cols=array('property_id','property_id_alt','property_name')) {
		return $this->propertyGateway->findCodingByUser($userprofile_id, $cols);
	}
	
	/**
	 * Get regions a user has permissions to
	 *
	 * @param  int   $userprofile_id              The active user ID, can be a delegated account
	 * @param  int   $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @return array                              Array of region records
	 */
	public function getUserRegions($userprofile_id, $delegated_to_userprofile_id) {
		return $this->regionGateway->findByUser($userprofile_id, $delegated_to_userprofile_id);
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
	 * @param  int    $userprofile_id    Id of user to get delegation info for
	 * @param  string $toOrFrom          Whether to get delegations to the user or from (made by) the user; valid values are "from" and "to"
	 * @param  int    $delegation_status Filter the delegation records by delegation_status (optional); defaults to null, valid values are 1 and 0
	 * @param  int    $pageSize          The number of records per page; if null, all records are returned
	 * @param  int    $page              The page for which to return records
	 * @param  string $sort              Field(s) by which to sort the result; defaults to delegation_startdate
	 * @return array Array of delegation records
	 */
	public function getDelegations($userprofile_id, $toOrFrom, $delegation_status=null, $pageSize=null, $page=1, $sort='delegation_startdate') {
		return $this->delegationGateway->findUserDelegations($userprofile_id, $toOrFrom, $delegation_status, $pageSize, $page, $sort);
	}
	
	/**
	 * Get delegations to user signed in; shortcut for getDelegations($userprofile_id, 'to', ...)
	 *
	 * @param  int    $userprofile_id    Id of user to get delegation info for
	 * @param  int    $delegation_status Filter the delegation records by delegation_status (optional); defaults to null, valid values are 1 and 0
	 * @param  int    $pageSize          The number of records per page; if null, all records are returned
	 * @param  int    $page              The page for which to return records
	 * @param  string $sort              Field(s) by which to sort the result; defaults to delegation_startdate
	 * @return array Array of delegation records
	 */
	public function getDelegationsTo($userprofile_id, $delegation_status=null, $pageSize=null, $page=1, $sort='delegation_startdate') {
		return $this->getDelegations($userprofile_id, 'to' ,$delegation_status, $pageSize, $page, $sort);
	}
	
	/**
	 * Get delegations made by the user signed in; shortcut for getDelegations($userprofile_id, 'from', ...)
	 *
	 * @param  int    $userprofile_id    Id of user to get delegation info for
	 * @param  int    $delegation_status Filter the delegation records by delegation_status (optional); defaults to null, valid values are 1 and 0
	 * @param  int    $pageSize          The number of records per page; if null, all records are returned
	 * @param  int    $page              The page for which to return records
	 * @param  string $sort              Field(s) by which to sort the result; defaults to delegation_startdate
	 * @return array Array of delegation records
	 */
	public function getDelegationsFrom($userprofile_id, $delegation_status=null, $pageSize=null, $page=1, $sort='delegation_startdate') {
		return $this->getDelegations($userprofile_id, 'from' ,$delegation_status, $pageSize, $page, $sort);
	}
	
	/**
	 * Checks if a certain user is an admin user
	 *
	 * @param  int     $userprofile_id Id of user to get delegation info for
	 * @return boolean                 True if user is admin, false otherwise
	 */
	public function isAdmin($userprofile_id) {
		$res = $this->roleGateway->findByUser($userprofile_id);
		if ($res['is_admin_role'] == 1) {
			return true;
		}

		return false;
	}

	/**
	 * Saves a complete user profile
	 *
	 * @param  array $data A data set of user information to be saved 
	 * @return array       Array with status info on the operation
	 */
	public function saveUser($data) {
		$errors = array();
		$userprofile_id = null;

		$this->userprofileGateway->beginTransaction();

		try {
			$res = $this->saveUserDetails($data);
			$errors = $res['errors'];
			$userprofile_id = $res['userprofile_id'];

			// If no errors, save properties
			if (!count($errors)) {
				$success = $this->savePropertyAssignment($userprofile_id, $data['properties']);
				if (!$success) {
					$errors[] = array(
									'field' => 'properties',
									'msg'   => $this->localizationService->getMessage('propertyAssignmentError')
								);
				}
			}

			// If no errors, save coding only properties
			if (!count($errors)) {
				$success = $this->savePropertyAssignment($userprofile_id, $data['coding_properties'], true);
				if (!$success) {
					$errors[] = array(
									'field' => 'coding_properties',
									'msg'   => $this->localizationService->getMessage('codingPropertyAssignmentError')
								);
				}
			}

			// If no errors, save email alerts and email frequencies
			if (!count($errors)) {
				$res = $this->notificationService->saveNotifications('userprofile', $userprofile_id, $data['emailalerts'], $data['emailalerthours']);
				if (!$res['success']) {
					$errors[] = array('field'=>'global', 'msg'=>$res['error'], 'extra'=>null);
				}
			}
			
		} catch(\Exception $e) {
			// Add a global error to the error array
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
		}

		if (count($errors)) {
			$this->userprofileGateway->rollback();
		} else {
			$this->userprofileGateway->commit();
		}

		return array(
			'success'        => (count($errors)) ? false : true,
			'errors'         => $errors,
			'userprofile_id' => $userprofile_id
		);
	}

	/**
	 * Saves information for a user
	 *
	 * @param  array $data A data set of user information to be saved 
	 * @return array       Array with status info on the operation
	 */
	public function saveUserInfo($data) {
		$errors = array();
		$userprofile_id = null;

		$this->userprofileGateway->beginTransaction();

		try {
			$res = $this->saveUserDetails($data);
			$errors = $res['errors'];
			$userprofile_id = $res['userprofile_id'];
			
			// If no errors, save coding only properties
			if (!count($errors) && array_key_exists('properties', $data)) {
				$success = $this->savePropertyAssignment($userprofile_id, $data['properties']);
				if (!$success) {
					$errors[] = array(
									'field' => 'properties',
									'msg'   => $this->localizationService->getMessage('propertyAssignmentError'),
									'extra' => null
								);
				}
			}
		} catch(\Exception $e) {
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
		}

		if (count($errors)) {
			$this->userprofileGateway->rollback();
		} else {
			$this->userprofileGateway->commit();
		}

		return array(
			'success'        => (count($errors)) ? false : true,
			'errors'         => $errors,
			'userprofile_id' => $userprofile_id
		);
	}

	/**
	 * Saves details pertaining to the actual user, such as username, name, address, email, etc.
	 *
	 * @param  array $data A data set of user information to be saved 
	 * @return array       Array with status info on the operation
	 */
	public function saveUserDetails($data) {
		// Get entities
		$userprofile     = new \NP\user\UserprofileEntity($data['userprofile']);
		$userprofilerole = new \NP\user\UserprofileroleEntity($data['userprofilerole']);
		$staff           = new \NP\user\StaffEntity($data['staff']);
		$person          = new \NP\contact\PersonEntity($data['person']);
		$address         = new \NP\contact\AddressEntity($data['address']);
		$email           = new \NP\contact\EmailEntity($data['email']);
		$homePhone       = new \NP\contact\PhoneEntity($data['home_phone']);
		$workPhone       = new \NP\contact\PhoneEntity($data['work_phone']);

		// Update the userprofile object
		$userprofile->userprofile_updated_by = $this->securityService->getUserId();

		// Set the client ID
		$userprofile->asp_client_id = $this->configService->getClientId();

		// Run validation
		$validator = new EntityValidator();
		$validator->validate($userprofile);
		$errors    = $validator->getErrors();

		// Check the username to make sure it's unique
		if (!$this->userprofileGateway->isUsernameUnique($userprofile->userprofile_username, $userprofile->userprofile_id)) {
			$errors[] = array(
							'field' => 'userprofile_username',
							'msg'   => $this->localizationService->getMessage('duplicateUsernameError'),
							'extra' => null
						);
		}

		// Check the current password entered if user is not an admin
		$isAdmin = $this->isAdmin($this->securityService->getUserId());
		if (!$isAdmin && array_key_exists('userprofile_password_current', $data)) {
			$authenticator = $this->securityService->getAuthenticator();
			$authenticator->setUsername($userprofile->userprofile_username);
			$authenticator->setPassword($data['userprofile_password_current']);
			$authSuccess = $authenticator->authenticate();

			if (!$authSuccess) {
				$errors[] = array(
								'field' => 'userprofile_password_current',
								'msg'   => $this->localizationService->getMessage('incorrectPasswordError'),
								'extra' => null
							);
			}
		}

		// Check the password fields to make sure they match
		if ($userprofile->userprofile_password != '' && $userprofile->userprofile_password != $data['userprofile_password_confirm']) {
			$errors[] = array(
							'field' => 'userprofile_password_confirm',
							'msg'   => $this->localizationService->getMessage('passwordMatchError'),
							'extra' => null
						);
		}

		// If the data is valid, save it
		if (count($errors) == 0) {
			// Begin transaction
			$this->userprofileGateway->beginTransaction();

			try {
				// Save the userprofile record
				$this->userprofileGateway->save($userprofile);

				// Save the person record
				$person->asp_client_id = $this->configService->getClientId();
				$validator->validate($person);
				$errors    = array_merge($errors, $validator->getErrors());
				$this->personGateway->save($person);
				
				// Save the staff record
				$staff->person_id = $person->person_id;
				$validator->validate($staff);
				$errors = array_merge($errors, $validator->getErrors());
				if (!count($validator->getErrors())) {
					$this->staffGateway->save($staff);
				}
				
				// Save the user role record
				$userprofilerole->userprofile_id = $userprofile->userprofile_id;
				$userprofilerole->tablekey_id    = $staff->staff_id;
				$validator->validate($userprofilerole);
				$errors = array_merge($errors, $validator->getErrors());
				if (!count($validator->getErrors())) {
					$this->userprofileroleGateway->save($userprofilerole);
				}

				// Save the address records
				$address->table_name = 'staff';
				$address->tablekey_id = $staff->staff_id;
				$address->addresstype_id = $this->addressTypeGateway->find('addresstype_name = ?', array('Home'));
				$address->addresstype_id = $address->addresstype_id[0]['addresstype_id'];
				$validator->validate($address);
				$errors    = array_merge($errors, $validator->getErrors());
				if (!count($validator->getErrors())) {
					$this->addressGateway->save($address);
				}

				// Save the email record
				$email->table_name = 'staff';
				$email->tablekey_id = $staff->staff_id;
				$email->emailtype_id = $this->emailTypeGateway->find('emailtype_name = ?', array('Home'));
				$email->emailtype_id = $email->emailtype_id[0]['emailtype_id'];
				$validator->validate($email);
				$errors    = array_merge($errors, $validator->getErrors());
				if (!count($validator->getErrors())) {
					$this->emailGateway->save($email);
				}

				// Save the home phone record
				$homePhone->table_name = 'staff';
				$homePhone->tablekey_id = $staff->staff_id;
				$homePhone->phonetype_id = $this->phoneTypeGateway->find(array('phonetype_name'=>'?'), array('Home'));
				$homePhone->phonetype_id = $homePhone->phonetype_id[0]['phonetype_id'];
				$validator->validate($homePhone);
				$errors    = array_merge($errors, $validator->getErrors());
				if (!count($validator->getErrors())) {
					$this->phoneGateway->save($homePhone);
				}

				// Save the work phone record
				$workPhone->table_name = 'staff';
				$workPhone->tablekey_id = $staff->staff_id;
				$workPhone->phonetype_id = $this->phoneTypeGateway->find(array('phonetype_name'=>'?'), array('Work'));
				$workPhone->phonetype_id = $workPhone->phonetype_id[0]['phonetype_id'];
				$validator->validate($workPhone);
				$errors    = array_merge($errors, $validator->getErrors());
				if (!count($validator->getErrors())) {
					$this->phoneGateway->save($workPhone);
				}
			} catch(\Exception $e) {
				// Add a global error to the error array
				$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
			}
		}

		if (count($errors)) {
			$this->userprofileGateway->rollback();
		} else {
			$this->userprofileGateway->commit();
		}

		return array(
			'success'        => (count($errors)) ? false : true,
			'errors'         => $errors,
			'userprofile_id' => $userprofile->userprofile_id
		);
	}

	/**
	 * Saves property assignments for a user
	 *
	 * @param  int   $userprofile_id The ID for the user we want to assign properties to
	 * @param  array $property_id_list
	 * @return boolean
	 */
	public function savePropertyAssignment($userprofile_id, $property_id_list, $isCodingOnly=false) {
		$gateway = ($isCodingOnly) ? 'propertyUserCodingGateway' : 'propertyUserprofileGateway';
		// Start a DB transaction
		$this->$gateway->beginTransaction();

		$success = true;
		try {
			// Remove all property associations for this user
			$this->$gateway->delete('userprofile_id = ?', array($userprofile_id));

			// Insert new property associations for this user
			foreach ($property_id_list as $property_id) {
				$this->$gateway->insert(array(
					'userprofile_id' => $userprofile_id,
					'property_id'    => $property_id
				));
			}

			// Commit the data
			$this->$gateway->commit();
		} catch(\Exception $e) {
			// If there was an error, rollback the transaction
			$this->$gateway->rollback();
			// Change success to indicate failure
			$success = false;
		}

		return $success;
	}

	public function saveDashboardSettings($userprofile_id, $userprofile_preferred_property, $userprofile_preferred_region, $userprofile_default_dashboard) {
		$errors = array();

		try {
			$this->userprofileGateway->save(array(
				'userprofile_id'                 => $userprofile_id,
				'userprofile_preferred_property' => $userprofile_preferred_property,
				'userprofile_preferred_region'   => $userprofile_preferred_region,
				'userprofile_default_dashboard'  => $userprofile_default_dashboard
			));
		} catch(\Exception $e) {
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e));
		}

		return array(
			'success' => (count($errors)) ? false : true,
			'errors'  => $errors
		);
	}

	public function saveDashboardLayout($userprofile_id, $userprofile_dashboard_layout) {
		$errors = array();

		try {
			$this->userprofileGateway->save(array(
				'userprofile_id'               => $userprofile_id,
				'userprofile_dashboard_layout' => $userprofile_dashboard_layout
			));
		} catch(\Exception $e) {
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e));
		}

		return array(
			'success' => (count($errors)) ? false : true,
			'errors'  => $errors
		);
	}

	public function saveDisplaySettings($data) {
		// Begin transaction
		$this->userprofileGateway->beginTransaction();
		$errors = array();

		try {
			$userprofile = new \NP\user\UserprofileEntity($data['userprofile']);
			$validator = new EntityValidator();
			$validator->validate($userprofile);
			$errors    = $validator->getErrors();

			if (!count($errors)) {
				$this->userprofileGateway->save(array(
					'userprofile_id'                           => $userprofile->userprofile_id,
					'userprofile_splitscreen_size'             => $userprofile->userprofile_splitscreen_size,
					'userprofile_splitscreen_isHorizontal'     => $userprofile->userprofile_splitscreen_isHorizontal,
					'userprofile_splitscreen_ImageOrder'       => $userprofile->userprofile_splitscreen_ImageOrder,
					'userprofile_splitscreen_LoadWithoutImage' => $userprofile->userprofile_splitscreen_LoadWithoutImage
				));

				$this->userprofileGateway->commit();
			}
		} catch(\Exception $e) {
			$this->userprofileGateway->rollback();
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e));
		}

		return array(
			'success' => (count($errors)) ? false : true,
			'errors'  => $errors
		);
	}

	public function getMobileInfo($userprofile_id) {
		$res = $this->mobInfoGateway->find(
			array('userprofile_id'=>'?','mobinfo_status'=>'?'), 
			array($userprofile_id,'active'),
			null,
			array('mobinfo_id','mobinfo_phone','userprofile_id','mobinfo_activated_datetm','mobinfo_deactivated_datetm','mobinfo_status')
		);
		if (count($res)) {
			return $res[0];
		} else {
			return null;
		}
	}

	public function saveMobileInfo($data) {
		// Begin transaction
		$this->mobInfoGateway->beginTransaction();

		$errors = array();
		try {
			// Create the entity
			$mobInfo = new MobInfoEntity($data['mobinfo']);

			// Check if somebody else already registered this number
			if ($this->mobInfoGateway->isDuplicate($mobInfo->userprofile_id, $mobInfo->mobinfo_phone)) {
				$errors[] = array(
								'field' => 'mobinfo_phone',
								'msg'   => $this->localizationService->getMessage('duplicateMobileNumberError'),
								'extra' => null
							);
			}

			$user = $this->userprofileGateway->findProfileById($mobInfo->userprofile_id);
			if ($user['email_address'] === '' || $user['email_address'] === null) {
				$errors[] = array(
								'field' => 'global',
								'msg'   => $this->localizationService->getMessage('noEmailSetupError')
							);
			}

			// Validate the record
			$validator = new EntityValidator();
			$validator->validate($mobInfo);
			$errors    = array_merge($errors, $validator->getErrors());

			// If not errors, we can save and commit the transaction
			if (!count($errors)) {
				// Only do this if registering a new device
				if ($data['isNewDevice']) {
					// Disable the current device
					$this->disableMobileDevices($mobInfo->mobinfo_id);

					// Clear out the ID from the entity so a new record gets saved
					$mobInfo->mobinfo_id = null;
				}

				// Add activated date if dealing with new record
				$sendEmail = false;
				if ($mobInfo->mobinfo_id === null) {
					$sendEmail = true;
					$mobInfo->mobinfo_activated_datetm = \NP\util\Util::formatDateForDB();
				}

				$this->mobInfoGateway->save($mobInfo);
			}
		} catch(\Exception $e) {
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e));
		}

		if (!count($errors)) {
			$this->mobInfoGateway->commit();

			// If dealing with a new device, send an email notification
			if ($sendEmail === true) {
				$emailMessage = new \NP\core\notification\EmailMessage();
				$emailMessage->setSubject($this->localizationService->getMessage('mobileDeviceEmailSubject'))
							->setFrom( $this->configService->get('PN.Main.FromEmail') )
							->setTo($user['email_address'])
							->setTemplate( $this->localizationService->getMessage('mobileDeviceEmailBody') )
							->compile( array('mobinfo_phone'=>$mobInfo->mobinfo_phone) );

				$this->notificationService->sendEmail($emailMessage);
			}
		} else {
			$this->mobInfoGateway->rollback();
		}

		// Blank out the pin from the returned data so it gets cleared out
		$updatedData = $mobInfo->toArray();
		$updatedData['mobinfo_pin'] = '';

		return array(
			'success'     => (count($errors)) ? false : true,
			'updatedData' => $updatedData,
			'errors'      => $errors
		);
	}

	/**
	 * Disables one or more mobile numbers
	 *
	 * @param int|array $mobinfo_id_list Array of mobinfo_id to be disabled; can be an integer if disabling a single number
	 */
	public function disableMobileDevices($mobinfo_id_list) {
		if (!is_array($mobinfo_id_list)) {
			$mobinfo_id_list = array($mobinfo_id_list);
		}
		foreach ($mobinfo_id_list as $mobinfo_id) {
			$this->mobInfoGateway->update(
				array(
					'mobinfo_deactivated_datetm' => \NP\util\Util::formatDateForDB(),
					'mobinfo_status'             => 'inactive'
				),
				array('mobinfo_id' => '?'),
				array($mobinfo_id)
			);
		}
	}

	/**
	 * Cancels an active/future delegation
	 *
	 * @param int $delegation_id The ID of the delegation to cancel
	 */
	public function cancelDelegation($delegation_id) {
		$this->delegationGateway->update(array(
			'Delegation_Id'     => $delegation_id,
			'Delegation_Status' => 0
		));
	}

	public function getAllowedDelegationUsers($userprofile_id) {
		return $this->delegationGateway->findAllowedDelegationUsers($userprofile_id);
	}

	public function getDelegation($delegation_id) {
		// We can't use findById because of case issues
		$res = $this->delegationGateway->findById($delegation_id);

		$res['delegation_properties'] = \NP\util\Util::valueList($this->getDelegationProperties($delegation_id), 'property_id');

		return $res;
	}

	public function getDelegationProperties($delegation_id) {
		return $this->delegationPropGateway->findDelegationProperties($delegation_id);
	}

	public function hasActiveDelegation($userprofile_id) {
		$activeDelegs = $this->getDelegationsTo($userprofile_id, 1);
		return (count($activeDelegs)) ? true : false;
	}

	public function saveDelegation($data) {
		$this->delegationGateway->beginTransaction();

		$errors = array();
		try {
			// Create the entity
			$delegation = new DelegationEntity($data['delegation']);

			// If dealing with a new delegation, set created values
			if ($delegation->Delegation_Id === null) {
				$delegation->delegation_createdby = $this->securityService->getUserId();
				$delegation->Delegation_CreatedDate = \NP\util\Util::formatDateForDB();
			}

			// Validate the entity
			$validator = new EntityValidator();
			$validator->validate($delegation);
			$errors    = $validator->getErrors();

			// Validate to make sure at least one property is assigned
			if (!array_key_exists('delegation_properties', $data) || !is_array($data['delegation_properties']) || !count($data['delegation_properties'])) {
				$errors[] = array(
								'field' => 'delegation_properties',
								'msg'   => $this->localizationService->getMessage('noDelegationPropertyError')
							);
			}

			// If there are no errors we can save everything
			if (!count($errors)) {
				$this->delegationGateway->save($delegation);

				$this->saveDelegationProperties($delegation->Delegation_Id, $data['delegation_properties']);
			}
		} catch(\Exception $e) {
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e));
		}

		if (count($errors)) {
			$this->delegationGateway->rollback();
		} else {
			$this->delegationGateway->commit();

			// If dealing with a new delegation, send an email notification
			if ($data['delegation']['Delegation_Id'] === null) {
				// We don't want the process to fail just because of email notification, so we try/catch
				try {
					// Get all the data needed for the email content
					$fromUser = $this->userprofileGateway->findProfileById($delegation->UserProfile_Id);
					$toUser = $this->userprofileGateway->findProfileById($delegation->Delegation_To_UserProfile_Id);
					$dateFormat = $this->configService->get('PN.Intl.DateFormat');
					$startDate = new \DateTime($delegation->Delegation_StartDate);
					$stopDate = new \DateTime($delegation->Delegation_StopDate);
					$delegProps = \NP\util\Util::valueList(
						$this->delegationPropGateway->findDelegationProperties($delegation->Delegation_Id),
						'property_name'
					);

					$subject = $this->localizationService->getMessage('newDelegationEmailSubject');
					$body = $this->localizationService->getMessage('newDelegationEmailBody') . 
							$this->localizationService->getMessage('emailNotificationFooter');
					$from = $this->configService->get('PN.Main.FromEmail');

					// Determine recipients
					$recipients = explode(';', $this->configService->get('PN.General.delegationEmail'));
					if (strlen($fromUser['email_address']) > 0) {
						$recipients[] = $fromUser['email_address'];
					}
					if (strlen($toUser['email_address']) > 0) {
						$recipients[] = $toUser['email_address'];
					}

					// Build email message
					$emailMessage = new \NP\core\notification\EmailMessage();
					$emailMessage->setSubject($subject)
								->setFrom($from)
								->setTemplate($body)
								->compile(array(
									'person_firstname'        => $fromUser['person_firstname'],
									'person_lastname'         => $fromUser['person_lastname'],
									'userprofile_username'    => $fromUser['userprofile_username'],
									'to_person_firstname'     => $toUser['person_firstname'],
									'to_person_lastname'      => $toUser['person_lastname'],
									'to_userprofile_username' => $toUser['userprofile_username'],
									'delegation_startdate'    => $startDate->format($dateFormat),
									'delegation_stopdate'     => $stopDate->format($dateFormat),
									'property_name_list'      => implode(', ', $delegProps)
								));

					$emailValidator = new \Zend\Validator\EmailAddress();

					// Loop through all recipients to make sure they're valid
					$validRecipients = array();
					foreach ($recipients as $recipient) {
						// Only send email if address is valid
						if ($emailValidator->isValid($recipient)) {
							$validRecipients[] = $recipient;
						}
					}

					$emailMessage->setTo($validRecipients);
					$this->notificationService->sendEmail($emailMessage);
				// If an error occurs, just catch it and log it to be dealt with later
				} catch(\Exception $e) {
					$this->handleUnexpectedError($e);
				}
			}
		}

		return array(
			'success' => (count($errors)) ? false : true,
			'errors'  => $errors
		);
	}

	public function saveDelegationProperties($delegation_id, $delegation_properties) {
		$this->delegationPropGateway->delete(array('delegation_id'=>'?'), array($delegation_id));
		foreach ($delegation_properties as $property_id) {
			$this->delegationPropGateway->save(array(
				'delegation_id' => $delegation_id,
				'property_id'   => $property_id
			));
		}
	}

	/**
	 * Gets roles
	 *
	 * @return array
	 */
	public function getRoles() {
		return $this->roleGateway->find(null, array(), 'role_name');
	}

	/**
	 * Get a specific role
	 *
	 * @param  int   $role_id Id of the role to retrieve
	 * @return array
	 */
	public function getRole($role_id) {
		$role = $this->roleGateway->findById($role_id);
		// Get email alerts for role
		$role['email_alerts'] = $this->notificationService->getRoleNotifications($role_id);
		// Get email alert hours for role
		$role['email_hours'] = $this->notificationService->getRoleEmailFrequency($role_id);
		// Get modules assigned
		$role['permissions'] = $this->securityService->getRolePermissions($role_id);

		return $role;
	}

	/**
	 * Activate a list of users
	 *
	 * @param  int    $userprofile_updated_by The id of the user performing the operation 
	 * @param  array  $userprofile_id_list    List of user IDs for the users who's activation you want to change
	 */
	public function activateUsers($userprofile_updated_by, $userprofile_id_list) {
		$this->toggleUserActivation('active', $userprofile_updated_by, $userprofile_id_list);
	}

	/**
	 * Inactivate a list of users
	 *
	 * @param  int    $userprofile_updated_by The id of the user performing the operation 
	 * @param  array  $userprofile_id_list    List of user IDs for the users who's activation you want to change
	 */
	public function inactivateUsers($userprofile_updated_by, $userprofile_id_list) {
		$this->toggleUserActivation('inactive', $userprofile_updated_by, $userprofile_id_list);
	}

	/**
	 * Changes the user's activation status to a specified status
	 *
	 * @param  string $status                 The status to change the user to
	 * @param  int    $userprofile_updated_by The id of the user performing the operation 
	 * @param  array  $userprofile_id_list    List of user IDs for the users who's activation you want to change
	 */
	public function toggleUserActivation($status, $userprofile_updated_by, $userprofile_id_list) {
		foreach ($userprofile_id_list as $userprofile_id) {
			$user = $this->userprofileGateway->findById($userprofile_id);
			if ($user['userprofile_status'] != $status) {
				$user = new UserprofileEntity($user);
				$user->userprofile_updated_by = $userprofile_updated_by;
				$user->userprofile_status = $status;
				$this->userprofileGateway->save($user);
			}
		}
	}

	/**
	 * Returns a list of roles optionally filtered by module the role has access
	 */
	public function getRolesByModule($module_id=null, $pageSize=null, $page=1, $sort='role_name') {
		return $this->roleGateway->findRolesByModule($module_id, $pageSize, $page, $sort);
	}

	/**
	 * Saves a role
	 *
	 * @param  array $data A data set of role information to be saved 
	 * @return array       Array with status info on the operation
	 */
	public function saveRole($data) {
		$this->roleGateway->beginTransaction();

		try {
			$data['role']['role_dashboard_layout'] = $data['dashboard_layout'];
			$role     = new \NP\user\RoleEntity($data['role']);
			$validator = new EntityValidator();
			$validator->validate($role);
			$errors   = $validator->getErrors();

			// Check the username to make sure it's unique
			if ($role->role_name != '' && !$this->roleGateway->isRoleNameUnique($role->role_name, $role->role_id)) {
				$errors[] = array(
								'field' => 'role_name',
								'msg'   => $this->localizationService->getMessage('duplicateGroupNameError'),
								'extra' => null
							);
			}

			// If no errors, save the role
			if (!count($errors)) {
				$this->roleGateway->save($role);
			}

			// If no errors, save tree position
			if (!count($errors)) {
				// Find tree ID for parent role
				$parentTree = $this->treeGateway->find(
					array('table_name'=>'?', 'tablekey_id'=>'?'),
					array('role', $data['parent_role_id'])
				);
				$parentTree = $parentTree[0];

				// Create tree record
				$tree = new TreeEntity(array(
					'tree_parent' => $parentTree['tree_id'],
					'table_name' => 'role',
					'tablekey_id' => $role->role_id
				));
				$validator->validate($tree);

				// If tree record is valid, save it
				if (!$validator->getErrors()) {
					$this->treeGateway->delete(
						array('table_name'=>'?', 'tablekey_id'=>'?'),
						array('role', $role->role_id)
					);
					$this->treeGateway->save($tree);
				// Else create an error record
				} else {
					$errors[] = array('field'=>'global', 'msg'=>$this->localizationService->getMessage('unexpectedError'), 'extra'=>null);
				}
			}

			// If no errors, save role permissions
			if (!count($errors)) {
				$res = $this->securityService->saveRolePermissions($role->role_id, $data['permissions']);
				if (!$res['success']) {
					$errors[] = array('field'=>'global', 'msg'=>$res['error'], 'extra'=>null);
				}
			}

			// If no errors, save email alerts and email frequencies
			if (!count($errors)) {
				// Save new role email alerts
				$res = $this->notificationService->saveNotifications('role', $role->role_id, $data['emailalerts'], $data['emailalerthours']);
				if (!$res['success']) {
					$errors[] = array('field'=>'global', 'msg'=>$res['error'], 'extra'=>null);
				}
			}

			// If no errors and overwrite user email flag is on
			if (!count($errors) && $data['email_overwrite']) {
				$res = $this->notificationService->resetUserEmailAlertSettings('role', $role->role_id);
				if (!$res['success']) {
					$errors[] = array('field'=>'global', 'msg'=>$res['error'], 'extra'=>null);
				}
			}

			// If flag is set to true, set all user dashboards to match the role
			if (!count($errors) && $data['dashboard_to_users']) {
				$roleUsers = $this->getAll(null, null, $role->role_id);
				foreach ($roleUsers as $roleUser) {
					$this->saveDashboardLayout($roleUser['userprofile_id'], $role->role_dashboard_layout);
				}
			}
		} catch(\Exception $e) {
			// Add a global error to the error array
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
		}

		if (count($errors)) {
			$this->roleGateway->rollback();
		} else {
			$this->roleGateway->commit();
		}

		return array(
			'success' => (count($errors)) ? false : true,
			'errors'  => $errors,
			'role_id' => $role->role_id
		);
	}

	/**
	 * Creates a copy of a role with the same properties
	 *
	 * @param  int   $role_id
	 * @return array
	 */
	public function copyRole($role_id) {
		$this->roleGateway->beginTransaction();

		$role = $this->roleGateway->findById($role_id);

		try {
			// Clear out certain fields from the copied record
			$role['role_id'] = null;
			$role['role_updated_by'] = null;
			$role['role_updated_datetm'] = null;

			// Create the role name, making sure it's unique
			$role['role_name'] = "{$role['role_name']} - copy";
			$copyNum = 2;
			while ( count($this->roleGateway->find('role_name = ?', array($role['role_name']))) ) {
				$role['role_name'] = "{$role['role_name']} {$copyNum}";
				$copyNum++;
			}

			// Create the role record
			$role     = new \NP\user\RoleEntity($role);
			$validator = new EntityValidator();
			$validator->validate($role);
			$errors   = $validator->getErrors();

			if (!count($errors)) {
				$this->roleGateway->save($role);
			}

			if (!count($errors)) {
				// Get the tree record for role we're copying from
				$tree = $this->treeGateway->find(
					array('table_name'=>'?', 'tablekey_id'=>'?'),
					array('role', $role_id)
				);
				$tree = $tree[0];

				// Create a new tree record for the new role
				$tree['tree_id'] = null;
				$tree['tablekey_id'] = $role->role_id;
				$tree = new \NP\system\TreeEntity($tree);

				// Validate and save the tree record
				$validator->validate($tree);
				$errors   = array_merge($errors, $validator->getErrors());

				if (!count($errors)) {
					$this->treeGateway->save($tree);
				}
			}

			if (!count($errors)) {
				$res = $this->securityService->copyRolePermissions($role_id, $role->role_id);
				if (!$res['success']) {
					$errors[] = array('field'=>'global', 'msg'=>$res['error'], 'extra'=>null);
				}
			}

			if (!count($errors)) {
				$res = $this->notificationService->copyEmailSettingsToRole($role_id, $role->role_id);
				if (!$res['success']) {
					$errors[] = array('field'=>'global', 'msg'=>$res['error'], 'extra'=>null);
				}
			}
		} catch(\Exception $e) {
			// Add a global error to the error array
			$errors[] = array('field'=>'global', 'msg'=>$this->handleUnexpectedError($e), 'extra'=>null);
		}

		if (count($errors)) {
			$this->roleGateway->rollback();
		} else {
			$this->roleGateway->commit();
		}

		return array(
			'success'   => (count($errors)) ? false : true,
			'errors'    => $errors,
			'role_id'   => $role->role_id
		);
	}

    public function findMobileInfo($pageSize = null, $page = null, $order = 'person_lastname') {
        $mobiles = $this->userprofileGateway->findMobileInfo($pageSize, $page, $order);

        return $mobiles;
    }
}

?>