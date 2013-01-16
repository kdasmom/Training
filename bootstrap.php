<?php
use Zend\Loader\StandardAutoloader;
use Zend\Di\Di;

// Set include paths (add Zend to the path)
set_include_path(get_include_path() . PATH_SEPARATOR . 'C:\\wwwroot\\Zend_2.0.4\\library\\Zend');
require_once("lib\util\FirePHP.class.php");

// Load appropriate config file for environment
require_once("config/config.php");

// Setup the Zend Autoloader
require_once('\Loader\StandardAutoloader.php');

$autoLoader = new StandardAutoloader(array(
    'namespaces' => array(
    	'Zend' => 'C:\\wwwroot\\Zend_2.0.4\\library\\Zend',
        'NP' => 'C:\\wwwroot\\NexusPayablesPHP\\lib',
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