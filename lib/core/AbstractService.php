<?php

namespace NP\core;

abstract class AbstractService implements LoggingAwareInterface {
	protected $loggingService;

	public function setLoggingService(\NP\system\LoggingService $loggingService) {
		$this->loggingService = $loggingService;
	}
}

?>