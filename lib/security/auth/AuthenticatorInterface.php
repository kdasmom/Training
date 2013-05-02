<?php

namespace NP\security\auth;

/**
 * Interface to define function needed to authenticate users
 *
 * @author Thomas Messier
 */
interface AuthenticatorInterface {

	/**
	 * Does whatever needs to be done when a user accesses the login page
	 *
	 * @return boolean Returns true if login page needs to be shown, false otherwise
	 */
	public function showLogin();

	/**
	 * Authenticates a user
	 *
	 * @return boolean Returns true if authentication succeeds, false otherwise
	 */
	public function authenticate();

	/**
	 * Returns username of the user that was successfully authenticated
	 *
	 * @return string The username
	 */
	public function getUser();

	/**
	 * Returns authentication errors
	 *
	 * @return array Array of strings with errors
	 */
	public function getErrors();

}

?>