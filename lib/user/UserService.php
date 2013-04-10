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
	 * @var \NP\contact\PersonGateway
	 */
	protected $personGateway;

	/**
	 * @var \NP\contact\AddressGateway
	 */
	protected $addressGateway;

	/**
	 * @var \NP\contact\EmailGateway
	 */
	protected $emailGateway;

	/**
	 * @var \NP\contact\PhoneGateway
	 */
	protected $phoneGateway;

	/**
	 * @var \NP\user\PropertyUserprofileGateway
	 */
	protected $propertyUserprofileGateway;

	/**
	 * @param \NP\security\SecurityService        $securityService            SecurityService object injected
	 * @param \NP\invoice\DelegationGateway       $delegationGateway          DelegationGateway object injected
	 * @param \NP\user\UserprofileGateway         $userprofileGateway         UserprofileGateway object injected
	 * @param \NP\user\RoleGateway                $roleGateway                RoleGateway object injected
	 * @param \NP\contact\PersonGateway           $personGateway              PersonGateway object injected
	 * @param \NP\contact\AddressGateway          $addressGateway             AddressGateway object injected
	 * @param \NP\contact\EmailGateway            $emailGateway               EmailGateway object injected
	 * @param \NP\contact\PhoneGateway            $phoneGateway               PhoneGateway object injected
	 * @param \NP\user\PropertyUserprofileGateway $propertyUserprofileGateway PropertyUserprofileGateway object injected
	 */
	public function __construct(SecurityService $securityService, DelegationGateway $delegationGateway, UserSettingGateway $userSettingGateway, 
								UserprofileGateway $userprofileGateway, RoleGateway $roleGateway, PersonGateway $personGateway,
								AddressGateway $addressGateway, EmailGateway $emailGateway, PhoneGateway $phoneGateway,
								PropertyUserprofileGateway $propertyUserprofileGateway) {
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
		$userprofile->userprofile_updated_datetm = \NP\util\Util::formatDateForDB(time());

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
}

?>