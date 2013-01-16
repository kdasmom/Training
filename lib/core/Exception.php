<?php

namespace NP\core;

class Exception extends \Exception {
	
	public function __construct($message) {
		parent::__construct("<b>".$message."</b>");
	}
	
}

?>