<?php

namespace NP\core;

/**
 * A generic Exception implementation for NexusPayables
 * 
 * @author Thomas Messier
 */
class Exception extends \Exception {
	
	public function __construct($message, $code=0, $previous=null) {
		parent::__construct("<b>".$message."</b>", $code, $previous);
	}
	
}

?>