<?php

namespace NP\security\auth;

/**
 * Class to performan standard authentication, which involves querying the NexusPayables database to check
 * is the username is present and if the password is correct
 *
 * @author Thomas Messier
 */
class StandardAuthenticator implements AuthenticatorInterface {

	protected $userprofileGateway;
	protected $username;
	protected $errors = array();

	public function __construct(\NP\user\UserprofileGateway $userprofileGateway) {
		$this->userprofileGateway = $userprofileGateway;
	}

	public function showLogin() {
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			return false;
		} else {
			return true;
		}
	}

	public function authenticate() {
		// Run the gateway function to authenticate in the NexusPayables database
		$success = $this->userprofileGateway->authenticate($_POST["username"], $_POST["pwd"]);

		// If authentication succeeds, set the username
		if ($success) {
			$this->username = $_POST["username"];
		// Otherwise add an error
		} else {
			$this->errors[] = 'Username or password is incorrect. Please try again.';
		}

		return $success;
	}

	public function getUser() {
		return $this->username;
	}

	public function getErrors() {
		return $this->errors;
	}
}

?>