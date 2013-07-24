<?php

namespace NP\security\auth;

use NP\user\UserprofileGateway;
use NP\locale\LocalizationService;

/**
 * Class to perform standard authentication, which involves querying the NexusPayables database to check
 * is the username is present and if the password is correct
 *
 * @author Thomas Messier
 */
class StandardAuthenticator extends AbstractAuthenticator implements AuthenticatorInterface {

	protected $userprofileGateway;
	
	public function __construct(UserprofileGateway $userprofileGateway, LocalizationService $localizationService) {
		$this->userprofileGateway  = $userprofileGateway;
		$this->localizationService = $localizationService;
	}

	public function authenticate() {
		// Run the gateway function to authenticate in the NexusPayables database
		$success = $this->userprofileGateway->authenticate($this->getUsername(), $this->getPassword());

		// If authentication succeeds, set the username
		if (!$success) {
			$this->errors[] = $this->localizationService->getMessage('invalidUsernamePasswordError');
		}

		return $success;
	}
}

?>