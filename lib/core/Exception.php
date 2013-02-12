<?php

namespace NP\core;

/**
 * A generic Exception implementation for NexusPayables
 * 
 * @author Thomas Messier
 */
class Exception extends \Exception {
	
	public function __construct($message) {
		parent::__construct("<b>".$message."</b>");
	}
	
}

?>