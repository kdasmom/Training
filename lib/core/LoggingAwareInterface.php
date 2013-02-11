<?php
namespace NP\core;

interface LoggingAwareInterface {
	public function setLoggingService(\NP\system\LoggingService $loggingService);
}
?>