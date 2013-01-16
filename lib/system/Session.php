<?php

namespace NP\system;

class Session {
	
	public function __construct($sessionDuration=30) {
		session_start();
		if (isset($_SESSION['__LAST_ACTIVITY']) && (time() - $_SESSION['__LAST_ACTIVITY'] > ($sessionDuration*60))) {
			// last request was more than 30 minutes ago
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