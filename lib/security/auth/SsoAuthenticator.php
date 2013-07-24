<?php

namespace NP\security\auth;

/**
 * Class to performan LDAP authentication.
 *
 * @author Thomas Messier
 */
class SsoAuthenticator extends LdapAuthenticator implements AuthenticatorInterface {

	public function authenticate() {
		if ( $this->isWindowsAuthenticated() ) {
			// Extract the username by removing any domain info to the REMOTE_USER server variable
			$username = explode('\\', $_SERVER['REMOTE_USER']);
			$username = array_pop($username);

			// Set the username
			$this->setUsername($username);

			// Return the authentication as successful
			return true;
		} else {
			return parent::authenticate();
		}
	}

	public function showLogin() {
		if ( $this->isWindowsAuthenticated() ) {
			return false;
		} else {
			return parent::showLogin();
		}
	}

	protected function isWindowsAuthenticated() {
		return (array_key_exists('REMOTE_USER', $_SERVER) && $_SERVER['REMOTE_USER'] !== '' && $_SERVER['REMOTE_USER'] !== null);
	}
}

?>