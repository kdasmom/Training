<?php

namespace NP\core;

/**
 * This is an abstract class that must be extended by all services in the system.
 * 
 * @abstract
 * @author Thomas Messier
 */
abstract class AbstractService {
	
	protected $loggingService, $localizationService;

	/**
	 * @internal Setter function required by DI framework to set the logging service via setter injection
	 * @param \NP\system\LoggingService $loggingService
	 */
	public function setLoggingService(\NP\system\LoggingService $loggingService) {
		$this->loggingService = $loggingService;
	}

	/**
	 * @internal Setter function required by DI framework to set the localization service via setter injection
	 * @param \NP\locale\LocalizationService $localizationService
	 */
	public function setLocalizationService(\NP\locale\LocalizationService $localizationService) {
		$this->localizationService = $localizationService;
	}

	/**
	 * Utility function to handle unexpected exceptions caught in catch blocks
	 *
	 * @param  \Exception $e
	 * @return string
	 */
	public function handleUnexpectedError($e) {
		$errorMsg = "File: {$e->getFile()};\nLine: {$e->getLine()};\nMessage: {$e->getMessage()};\nTrace: {$e->getTraceAsString()};";
		$this->loggingService->log('error', $errorMsg);

		return $this->localizationService->getMessage('unexpectedError');
	}
}

?>