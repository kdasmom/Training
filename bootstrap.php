<?php
use Zend\Loader\StandardAutoloader;
use Zend\Di\Di;

// Load appropriate config file for environment
require_once("config/config.php");

// Set include paths (add Zend to the path)
set_include_path(get_include_path() . PATH_SEPARATOR . $__CONFIG['zendPath']);
require_once("lib\util\FirePHP.class.php");

// Setup the Zend Autoloader
require_once('\Loader\StandardAutoloader.php');

$autoLoader = new StandardAutoloader(array(
    'namespaces' => array(
    	'Zend' => $__CONFIG['zendPath'],
        'NP' => $__CONFIG['appRoot'] . 'lib\\',
    )
));
$autoLoader->register();

// Init Zend DI
$di = new Di();

// Load DI configuration 
require_once("config/di_config.php"); // Keep DI configs in a separate file to keep this one clean

// Use this so config gets reinitialized if needed
if ($reloadCache) {
	$di->get('NP\\system\\ConfigService');
}

?>