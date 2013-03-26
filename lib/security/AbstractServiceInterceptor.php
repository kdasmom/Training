<?php

namespace NP\security;

use NP\security\SecurityService;

/**
 * Abstract service interceptor that makes it easy to define separate interceptor functions that match
 * the name of the function in your service instead of one secure() method for everything
 *
 * @author Thomas Messier
 */
abstract class AbstractServiceInterceptor implements InterceptorInterface {

	/**
	 * @var \NP\security\SecurityService
	 */
	protected $securityService;

	/**
	 * @internal Setter function required by DI framework to set the security service via setter injection
	 * @param \NP\security\SecurityService $securityService
	 */
	public function setSecurityService(SecurityService $securityService) {
		$this->securityService = $securityService;
	}

	abstract function secure($action, $params);
}

?>