<?php

namespace NP\core;

/**
 * This is an abstract class that must be extended by all services in the system.
 * 
 * @abstract
 * @author Thomas Messier
 */
abstract class AbstractService {
	
	protected $loggingService, $localizationService, $gatewayManager, $entityValidator;

	/**
	 * @internal Setter function required by DI framework to set the logging service via setter injection
	 * @param \NP\system\LoggingService $loggingService
	 */
	public function setLoggingService(\NP\system\LoggingService $loggingService) {
		$this->loggingService = $loggingService;
	}

	/**
	 * @internal Setter function required by DI framework to set the GatewayManager via setter injection
	 * @param \NP\core\GatewayManager $gatewayManager
	 */
	public function setGatewayManager(\NP\core\GatewayManager $gatewayManager) {
		$this->gatewayManager = $gatewayManager;
	}

	/**
	 * @internal Setter function required by DI framework to set the localization service via setter injection
	 * @param \NP\locale\LocalizationService $localizationService
	 */
	public function setLocalizationService(\NP\locale\LocalizationService $localizationService) {
		$this->localizationService = $localizationService;
	}

	/**
	 * Shortcut for translating
	 */
	public function translate($phrase) {
		return $this->localizationService->translate($phrase);
	}

	/**
	 * @internal Setter function required by DI framework to set the entity validator via setter injection
	 * @param \NP\core\validation\EntityValidator $entityValidator
	 */
	public function setEntityValidator(\NP\core\validation\EntityValidator $entityValidator) {
		$this->entityValidator = $entityValidator;
	}

	/**
	 * Magic function to get gateways from the gateway manager
	 *
	 * @param string $name
	 */
	public function __get($name) {
		return $this->gatewayManager->get(ucfirst($name));
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
