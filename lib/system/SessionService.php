<?php

namespace NP\system;

/**
 * Service class for operations related to sessions. Basically a session facade
 *
 * @author Thomas Messier
 */
class SessionService {
	
	public function __construct($sessionDuration=1800) {
		if (isset($_SESSION['__LAST_ACTIVITY']) && (time() - $_SESSION['__LAST_ACTIVITY'] > $sessionDuration)) {
			session_unset();     // unset $_SESSION variable for the run-time 
			session_destroy();   // destroy session data in storage
		}
		$_SESSION['__LAST_ACTIVITY'] = time();
	}
	
	public function set($key, $val) {
		$_SESSION[$key] = $val;
	}
	
	public function get($key) {
		return $_SESSION[$key];
	}
	
	public function remove($key) {
		unset($_SESSION[$key]);
	}
	
	public function exists($key) {
		return array_key_exists($key, $_SESSION);
	}
	
}

?>