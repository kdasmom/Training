<?php

namespace NP\system;

use NP\core\Config;

/**
 * Service class for operations related to sessions. Basically a session facade
 *
 * @author Thomas Messier
 */
class SessionService {
	
	public function __construct(Config $config, SiteService $siteService) {
		$sessionDuration = $config->get('main.util.logofftime', 1800);
		$loginUrl = $siteService->getLoginUrl();
		$loginUrl = rtrim(preg_replace('/https?:\/\//i', '', $loginUrl));
		$loginUrl = explode('/', $loginUrl);

		// Make cookie last 1 day (note this is not the session length)
		$cookieLifeTime = 60*60*24;

		// Setup cookie parameters based on the type of URL (if we have a unique domain or domain and sub directory)
		if (count($loginUrl) > 1) {
			session_set_cookie_params($cookieLifeTime, $loginUrl[1], $loginUrl[0]);
		} else {
			session_set_cookie_params($cookieLifeTime, '/', $loginUrl[0]);
		}
		session_start();

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