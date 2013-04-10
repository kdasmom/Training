<?php

use Zend\Json\Json;

// Bootstrap
require_once("bootstrap.php");

//$di->get('NP\services\SecurityService')->logout();

// Handle request
$isAuth = $di["SecurityService"]->isSessionAuthenticated();

if (!array_key_exists("config", $_REQUEST)) {
	$isArrayRequest = false;
	$config = array($_REQUEST);
} else {
	$isArrayRequest = true;
	$config = Json::decode($_REQUEST["config"], Json::TYPE_ARRAY);
}

if ( is_array($config) && $isAuth ) {
	$results = array();
	// Loop through the batch of requests
	foreach($config as $request) {
		// Determine the correct service and action to run
		$service = $di[$request["service"]];
		
		$reflectionMethod = new ReflectionMethod($service, $request["action"]);
		$params = $reflectionMethod->getParameters();
		$paramVals = array();
		
		foreach($params as $param) {
			if (array_key_exists($param->getName(), $request)) {
				$paramVals[] = $request[$param->getName()];
			} else {
				$paramVals[] = $param->getDefaultValue();
			}
		}
		
		// If there's a security interceptor for this service, secure the call
		$interceptor = get_class($service) . 'Interceptor';
		if (class_exists($interceptor)) {
			$interceptor = explode('\\', $interceptor);
			$interceptor = array_pop($interceptor);
			$isAuth = $di[$interceptor]->secure($request["action"], $request);
		}

		if ($isAuth) {
			// Call the service function
			$res = call_user_func_array(array($service, $request["action"]), $paramVals);
			
			// Add the result to the results array
			array_push($results, $res);
		}
	}
	
	// Return all results in JSON format
	if ($isAuth) {
		if ($isArrayRequest) {
			echo Json::encode($results);
		} else {
			echo Json::encode($results[0]);
		}
	}
}

if (!$isAuth) {
	echo 'authenticationFailure';
}

?>