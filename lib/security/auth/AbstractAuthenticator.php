<?php

namespace NP\security\auth;

/**
 * Abstract authentication class that implements some functions that repeat themselves accross some implementations
 *
 * @author Thomas Messier
 */
abstract class AbstractAuthenticator implements AuthenticatorInterface {

	protected $username, $password;
	protected $errors = array();

	public function showLogin() {
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			return false;
		} else {
			return true;
		}
	}

	public function getUsername() {
		return $this->username;
	}

	public function setUsername($username) {
		$this->username = $username;
	}

	public function getPassword() {
		return $this->password;
	}

	public function setPassword($password) {
		$this->password = $password;
	}

	public function getErrors() {
		return $this->errors;
	}
}

?>