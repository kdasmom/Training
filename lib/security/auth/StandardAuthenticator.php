<?php

namespace NP\security\auth;

/**
 * Class to perform standard authentication, which involves querying the NexusPayables database to check
 * is the username is present and if the password is correct
 *
 * @author Thomas Messier
 */
class StandardAuthenticator extends AbstractAuthenticator implements AuthenticatorInterface {

	protected $userprofileGateway;
	
	public function __construct(\NP\user\UserprofileGateway $userprofileGateway) {
		$this->userprofileGateway = $userprofileGateway;
	}

	public function authenticate() {
		// Run the gateway function to authenticate in the NexusPayables database
		$success = $this->userprofileGateway->authenticate($this->getUsername(), $this->getPassword());

		// If authentication succeeds, set the username
		if (!$success) {
			$this->errors[] = 'Username or password is incorrect. Please try again.';
		}

		return $success;
	}
}

?>