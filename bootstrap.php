<?php
use Zend\Loader\StandardAutoloader;

session_start();

// Load appropriate config file for environment
require_once("config/config.php");

// Set include paths (add Zend to the path)
set_include_path(get_include_path() . PATH_SEPARATOR . $__CONFIG['zendPath']);

// Include a couple third party library files that aren't namespaced
require_once("vendor\FirePHP\FirePHP.class.php");
require_once("vendor\dBug\dBug.php");
require_once("vendor\SwiftMailer\lib\swift_required.php");

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

?>