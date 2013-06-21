<?php

namespace NP\user;

use NP\core\AbstractService;
use NP\core\validation\EntityValidator;
use NP\security\SecurityService;
use NP\contact\PersonGateway;
use NP\contact\AddressGateway;
use NP\contact\EmailGateway;
use NP\contact\PhoneGateway;

/**
 * Service class for operations related to application users
 *
 * @author Thomas Messier
 */
class UserService extends AbstractService {
	protected $securityService, $delegationGateway, $userSettingGateway, $userprofileGateway, $roleGateway,
			  $personGateway, $addressGateway, $emailGateway, $phoneGateway, $propertyUserprofileGateway,
			  $mobInfoGateway, $delegationPropGateway;

	public function __construct(SecurityService $securityService, DelegationGateway $delegationGateway, UserSettingGateway $userSettingGateway, 
								UserprofileGateway $userprofileGateway, RoleGateway $roleGateway, PersonGateway $personGateway,
								AddressGateway $addressGateway, EmailGateway $emailGateway, PhoneGateway $phoneGateway,
								PropertyUserprofileGateway $propertyUserprofileGateway, MobInfoGateway $mobInfoGateway,
								DelegationPropGateway $delegationPropGateway) {
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
	}

	/**
	 * Gets info for a user
	 *
	 * @param  int   $userprofile_id ID for the user
	 * @return array
	 */
	public function get($userprofile_id) {
		return $this->userprofileGateway->findProfileById($userprofile_id);
	}

	/**
	 * Get all users in the application
	 *
	 * @param  string $userprofile_status The status of the user (optional); valid values are 'active' or 'inactive'
	 * @return array
	 */
	public function getAll($userprofile_status=null) {
		$where = null;
		$params = array();
		if ($userprofile_status !== null) {
			$where = 'userprofile_status = ?';
			$params[] = $userprofile_status;
		}

		return $this->userprofileGateway->find($where, $params, 'p.person_lastname, p.person_firstname');
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
	 * Saves information for a user
	 *
	 * @param  array $data A data set of user information to be saved 
	 * @return array       Array with status info on the operation
	 */
	public function saveUserInfo($data) {
		// Get entities
		$userprofile = new \NP\user\UserprofileEntity($data['userprofile']);
		$person      = new \NP\contact\PersonEntity($data['person']);
		$address     = new \NP\contact\AddressEntity($data['address']);
		$email       = new \NP\contact\EmailEntity($data['email']);
		$homePhone   = new \NP\contact\PhoneEntity($data['home_phone']);
		$workPhone   = new \NP\contact\PhoneEntity($data['work_phone']);

		// Update the userprofile object
		$userprofile->userprofile_updated_by = $this->securityService->getUserId();
		$userprofile->userprofile_updated_datetm = \NP\util\Util::formatDateForDB();

		// Run validation
		$validator = new EntityValidator();
		$validator->validate($userprofile);
		$errors    = $validator->getErrors();
		$validator->validate($person);
		$errors    = array_merge($errors, $validator->getErrors());
		$validator->validate($address);
		$errors    = array_merge($errors, $validator->getErrors());
		$validator->validate($email);
		$errors    = array_merge($errors, $validator->getErrors());

		// Check the current password entered if user is not an admin
		$isAdmin = $this->isAdmin($userprofile->userprofile_id);
		if (!$isAdmin) {
			$id = $this->securityService->authenticate($userprofile->userprofile_username, $data['userprofile_password_current']);
			if ($id == 0) {
				$errors[] = array('field'=>'userprofile_password_current', 'msg'=>'The password entered was incorrect', 'extra'=>null);
			}
		}

		// Check the password fields to make sure they match
		if ($userprofile->userprofile_password != '' && $userprofile->userprofile_password != $data['userprofile_password_confirm']) {
			$errors[] = array('field'=>'userprofile_password_confirm', 'msg'=>'The password fields need to match', 'extra'=>null);
		}

		// If the data is valid, save it
		if (count($errors) == 0) {
			// Begin transaction
			$adapter = $this->userprofileGateway->getAdapter();
			$adapter->beginTransaction();

			try {
				// Save the userprofile record
				$this->userprofileGateway->save($userprofile);
				
				// Save the person record
				$this->personGateway->save($person);

				// Save the address records
				$this->addressGateway->save($address);

				// Save the email record
				$this->emailGateway->save($email);

				// Save the home phone record
				$this->phoneGateway->save($homePhone);

				// Save the work phone record
				$this->phoneGateway->save($workPhone);

				// Save property assignments
				$success = $this->savePropertyAssignment($userprofile->userprofile_id, $data['user_properties']);
				if (!$success) {
					throw new \NP\core\Exception('Failed to save user property assignments');
				}

				// Commit the transaction
				$adapter->commit();
			} catch(\Exception $e) {
				// If there was an error, rollback the transaction
				$adapter->rollback();
				// Add a global error to the error array
				$errors[] = array('field'=>'global', 'msg'=>"Unexpected error", 'extra'=>null);
			}
		}

		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors,
		);
	}

	/**
	 * Saves property assignments for a user
	 *
	 * @param int    $userprofile_id The ID for the user we want to assign properties to
	 * @param string 
	 */
	public function savePropertyAssignment($userprofile_id, $property_id_list) {
		$adapter = $this->propertyUserprofileGateway->getAdapter();

		// Start a DB transaction
		$adapter->beginTransaction();

		$success = true;
		try {
			// Remove all property associations for this user
			$this->propertyUserprofileGateway->delete('userprofile_id = ?', array($userprofile_id));

			// Insert new property associations for this user
			foreach ($property_id_list as $property_id) {
				$this->propertyUserprofileGateway->insert(array(
					'userprofile_id' => $userprofile_id,
					'property_id'    => $property_id
				));
			}

			// Commit the data
			$adapter->commit();
		} catch(\Exception $e) {
			// If there was an error, rollback the transaction
			$adapter->rollback();
			// Change success to indicate failure
			$success = false;
		}

		return $success;
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
			$errors[] = array('field'=>'global', 'msg'=>'Unexpected error');
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
				$errors[] = array('field'=>'mobinfo_phone', 'msg'=>'This mobile number is already in use by another user. Please enter another number.');
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
				if ($mobInfo->mobinfo_id === null) {
					$mobInfo->mobinfo_activated_datetm = \NP\util\Util::formatDateForDB();
				}

				$this->mobInfoGateway->save($mobInfo);

				$this->mobInfoGateway->commit();	
			}
		} catch(\Exception $e) {
			$this->mobInfoGateway->rollback();
			$errors[] = array('field'=>'global', 'msg'=>'Unexpected error');
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
				$errors[] = array('field'=>'delegation_properties', 'msg'=>'You must delegate at least one property.');
			}

			// If there are no errors we can save everything
			if (!count($errors)) {
				$this->delegationGateway->save($delegation);

				$this->saveDelegationProperties($delegation->Delegation_Id, $data['delegation_properties']);

				$this->delegationGateway->commit();	
			}
		} catch(\Exception $e) {
			$this->delegationGateway->rollback();
			$errors[] = array('field'=>'global', 'msg'=>'Unexpected database error');
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
}

?>