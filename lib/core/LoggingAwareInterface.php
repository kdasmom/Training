<?php
namespace NP\core;

/**
 * @author Thomas Messier
 */
interface LoggingAwareInterface {
	/**
	 * @internal Setter function required by Zend Di to set the logging service via setter injection
	 * @param NP\system\LoggingService $loggingService
	 */
	public function setLoggingService(\NP\system\LoggingService $loggingService);
}
?>