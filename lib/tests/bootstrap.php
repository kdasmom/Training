<?php
use Zend\Loader\StandardAutoloader;

// Load appropriate config file for environment
require_once("../../config/config.php");

// Set include paths (add Zend to the path)
set_include_path(get_include_path() . PATH_SEPARATOR . $__CONFIG['zendPath']);

// Setup the Zend Autoloader
require_once('library\Zend\Loader\StandardAutoloader.php');

$autoLoader = new StandardAutoloader(array(
    'namespaces' => array(
    	'Zend' => $__CONFIG['zendPath'] . '/library/Zend',
        'NP' => $__CONFIG['appRoot'] . 'lib\\',
    )
));
$autoLoader->register();
?>