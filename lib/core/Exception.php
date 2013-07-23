<?php

namespace NP\core;

/**
 * A generic Exception implementation for NexusPayables
 * 
 * @author Thomas Messier
 */
class Exception extends \Exception {
	
	public function __construct($message, $code=0, $previous=null) {
		parent::__construct($message, $code, $previous);

		// This is one of the rare places we'll use the global scope for simplicity sake
		global $di;
		$di['LoggingService']->log('error', $message);
	}
	
}

?>