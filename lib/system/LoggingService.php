<?php

namespace NP\system;

use NP\core\AbstractService;

use Zend\Log\Logger;
use Zend\Log\Writer;
use FirePHP as FirePHPClass;

class LoggingService {
	
	private $loggers = array();
	
	public function __construct($logPath, $enabledNamespaces, $fileEnabled, $debugEnabled) {
		$this->logPath = $logPath;
		$this->enabledNamespaces = $enabledNamespaces;
		$this->fileEnabled = $fileEnabled;
		$this->debugEnabled = $debugEnabled;
	}
	
	public function log($namespace, $message, $details=array()) {
		// Only create the logger if firePHP debugging is on or if the namespace is on
		if ( in_array($namespace, $this->enabledNamespaces) && ($this->fileEnabled || $this->debugEnabled) ) {
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
				// If debug logging is enabled, create a FirePHP writer
				if ($this->debugEnabled) {
					$writer = new Writer\FirePhp(new Writer\FirePhp\FirePhpBridge(FirePHPClass::getInstance(true)));
					$logger->addWriter($writer);
				}
			}
			// Log the message
			$logger->info($message, $details);
		}
	}
	
}

?>