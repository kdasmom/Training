<?php
use Zend\Loader\StandardAutoloader;

// Load appropriate config file for environment
require_once("config/config.php");

// Set include paths (add Zend to the path)
set_include_path(get_include_path() . PATH_SEPARATOR . $__CONFIG['zendPath']);

// Include a couple third party library files that aren't namespaced
require_once("vendor\FirePHP\FirePHP.class.php");
require_once("vendor\dBug\dBug.php");
require_once("vendor\SwiftMailer\lib\swift_required.php");
require_once("vendor\chromephp\ChromePhp.php");

// Setup the Zend Autoloader
require_once('library\Zend\Loader\StandardAutoloader.php');

$autoLoader = new StandardAutoloader(array(
    'namespaces' => array(
    	'Zend' => $__CONFIG['zendPath'] . '/library/Zend',
        'NP' => $__CONFIG['appRoot'] . 'lib\\',
    )
));
$autoLoader->register();

// Load DI configuration 
require_once("config/di_config.php"); // Keep DI configs in a separate file to keep this one clean

// Force the use of libxml_get_errors() to get XML errors
libxml_use_internal_errors(true);

// Set a generic error handler to catch errors
// (this is especially needed to catch warnings and notices since they aren't caught by try/catch blocks)
set_error_handler(function ($errno, $errstr, $errfile, $errline, $errcontext) use ($di) {
	// Throw an ErrorException so the exception handler function can pick up
	throw new \ErrorException($errstr, 0, $errno, $errfile, $errline);
});

function np_global_exception_handler($e) {
	global $di;
	// Log error
	$errorMsg = "File: {$e->getFile()};\nLine: {$e->getLine()};\nMessage: {$e->getMessage()};\nTrace: {$e->getTraceAsString()}";
	$di['LoggingService']->log('error', $errorMsg);

    // Throw an HTTP 500 error
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
};
if($__CONFIG['serverType'] !== 'dev') {
    set_exception_handler('np_global_exception_handler');
}

// Use this to catch errors not caught by the other handlers
register_shutdown_function(function() use ($di) {
    $isError = false;
    if ($error = error_get_last()){
        switch($error['type']){
            case E_ERROR:
            case E_CORE_ERROR:
            case E_COMPILE_ERROR:
                $isError = true;
                break;
        }
    }

    if ($isError){
    	// Throw an ErrorException so the exception handler function can pick up
		$e = new \ErrorException($error['message'], 0, $error['type'], $error['file'], $error['line']);
		np_global_exception_handler($e);
    }
});
