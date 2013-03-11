<?php

namespace NP\core;

/**
 * This is an abstract class that must be extended by all services in the system.
 * 
 * @abstract
 * @author Thomas Messier
 */
abstract class AbstractService {
	/**
	 * The logging service singleton
	 * 
	 * The logging service singleton gets automatically injected via setter injection
	 * (setLoggingService() function).
	 *
	 * @var \NP\system\LoggingService The logging service singleton
	 */
	protected $loggingService;

	/**
	 * @internal Setter function required by Zend Di to set the logging service via setter injection
	 * @param \NP\system\LoggingService $loggingService
	 */
	public function setLoggingService(\NP\system\LoggingService $loggingService) {
		$this->loggingService = $loggingService;
	}
}

?>