<?php

namespace NP\system;

use NP\core\AbstractService;

use Zend\Log\Logger;
use Zend\Log\Writer;
use FirePHP as FirePHPClass;
use ChromePhp as ChromePhpClass;

/**
 * Service class for operations related to logging
 *
 * The logging service provides a flexible way to log info based on several configuration parameters found in
 * the constructor. It allows you to enable logging to files or to a debug stream (FirePHP or ChromePhp) and also allows
 * you to debug to different namespaces (basically categories), which allows you to easily turn logging on and
 * off for specific parts of your app. So for example, if you initialize the Logging service with only the
 * "mail" namespace enabled, a call like $loggingService->log('mail', 'This is my message') will write to a log,
 * but $loggingService->log('invoice', 'This is another message') will not because the "invoice" namespace is
 * not enabled.
 *
 * @author Thomas Messier
 */
class LoggingService {
	/**
	 * @var array An array of loggers stored with namespace as the key
	 */
	protected $loggers = array();
	
	/**
	 * @param string  $logPath           Path where you want log files written
	 * @param array   $enabledNamespaces Namespaces that are enabled (determines if logging happens or not)
	 * @param boolean $fileEnabled       Whether or not file logging is enabled
	 * @param boolean $debugEnabled      Whether or not debug logging (via FirePHP) is enabled
	 */
	public function __construct($logPath, $enabledNamespaces, $fileEnabled, $debugEnabled) {
		$this->logPath = $logPath;
		$this->enabledNamespaces = $enabledNamespaces;
		$this->fileEnabled = $fileEnabled;
		$this->debugEnabled = $debugEnabled;
	}
	
	/**
	 * Logs a message
	 *
	 * @param string $namespace Namespace for the item being logged
	 * @param string $message   Log message
	 * @param array  $details   Additional details for the logged item
	 */
	public function log($namespace, $message, $details=array()) {
		// Only create the logger if firePHP debugging is on or if the namespace is on or if it's set to 'error' (always on)
		if ( ($namespace == 'error' || in_array($namespace, $this->enabledNamespaces)) && ($this->fileEnabled || $this->debugEnabled) ) {
			// If we've already created the logger for this request, just retrieve it
			if (array_key_exists($namespace, $this->loggers)) {
				$logger = $this->loggers[$namespace];
			//  else build it
			} else {
				$logger = new Logger();
				// If file logging is enabled, create a Stream writer
				if ($this->fileEnabled) {
					// If log path doesn't exist, create it
					if (!is_dir($this->logPath)) {
						mkdir($this->logPath, 0644, true);
					}
					$writer = new Writer\Stream($this->logPath.'\\'.$namespace.'.log');
					$logger->addWriter($writer);
				}
				// If debug logging is enabled, create FirePHP and ChromePhp writers
				if ($this->debugEnabled) {
					$writer = new Writer\FirePhp(new Writer\FirePhp\FirePhpBridge(FirePHPClass::getInstance(true)));
					$logger->addWriter($writer);
					$writer = new Writer\ChromePhp(new Writer\ChromePhp\ChromePhpBridge(ChromePhpClass::getInstance()));
					$logger->addWriter($writer);
				}
				$this->loggers[$namespace] = $logger;
			}
			// Log the message
			$fn = ($namespace == 'error') ? 'err' : 'info';
			$logger->$fn($message, $details);
		}
	}
	
}

?>