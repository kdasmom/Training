<?php

namespace NP\security;

/**
 * Interface for service interceptors. Needs to be implemented by all service interceptors.
 *
 * @author Thomas Messier
 */
interface InterceptorInterface {

	/**
	 * Function that will be called to perform security checks on the call made to the service
	 * 
	 * @param  string $action The function being called in the service
	 * @param  array  $params The arguments passed to the function
	 * @return boolean        Returns true if the call passes security checks, false otherwise
	 */
	public function secure($action, $params);
}

?>