<?php

$reloadCache = false;
if (array_key_exists("reloadconfiguration", $_GET)) {
	$reloadCache = true;
}

$im = $di->instanceManager();

$im->setParameters('NP\system\SiteService', array(
	'configPath' => $__CONFIG['appRoot'] . 'config\\site_config.xml',
    'reloadCache'=> $reloadCache,
));

// Append the DB name to the DSN (must be done here because the SiteService determines the DB based on URL)
//$__CONFIG['datasource']['dsn'] .= $di->get('NP\system\SiteService')->getDdName();  // Use this if using PDO driver
$__CONFIG['datasource']['database'] = $di->get('NP\system\SiteService')->getDdName();  // Use this if using native SQL Server driver
$im->setParameters('Zend\Db\Adapter\Adapter', array(
    'driver'	=> $__CONFIG['datasource']
));

$im->setParameters('NP\system\Session', array(
	'sessionDuration'=> $__CONFIG['sessionDuration'],
));

$im->setParameters('NP\system\ConfigService', array(
	'reloadCache'=> $reloadCache,
));

$im->setParameters('NP\system\LoggingService', array(
    'logPath'			=> $__CONFIG['logPath'].'\\'.$di->get('NP\system\SiteService')->getAppName(),
    'enabledNamespaces'	=> $__CONFIG['enabledNamespaces'],
    'fileEnabled'		=> $__CONFIG['fileLogEnabled'],
    'debugEnabled'		=> $__CONFIG['debugLogEnabled'],
));

/*
 * This is an example of setter injection in case needed
 * 
$im->setInjections(
	'NP\\invoice\\InvoiceItemGateway',
	array('setInvoiceGateway'=>array('invoiceGateway'=>'NP\invoice\InvoiceGateway'))
);
*/

// Function to loop through all files in a directory and inject some objects in them
function __dependencyInjector($im, $dir, $config, $exclude=array()) {
	$files = scandir($dir);
	$ns = explode("\\", $dir);
	$ns = 'NP\\' . $ns[sizeof($ns)-1] . '\\';
	foreach($files as $file) {
	    if ($file != '.' && $file != '..' && !in_array($file, $exclude)) {
	    	$name = explode(".", $file);
			$name = $name[0];
			$im->setInjections(
				$ns . $name,
				$config
			);
	    }
	}
}