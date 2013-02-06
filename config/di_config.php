<?php

$reloadCache = false;
if (array_key_exists("reloadconfiguration", $_GET)) {
	$reloadCache = true;
}

// If on production server, compile definitions to a file
if ($__CONFIG['serverType'] == 'prod') {
	if (!file_exists(__DIR__ . '/di_definition.php')) {
	    $compiler = new Zend\Di\Definition\CompilerDefinition();
	    $compiler->addDirectory($__CONFIG['appRoot'] . 'lib');
	    $compiler->addDirectory($__CONFIG['zendPath'] . '/db');
	    $compiler->compile();
	    $definition = $compiler->toArrayDefinition();
	    
	    file_put_contents(
	        __DIR__ . '/di_definition.php',
	        '<?php return ' . var_export($definition->toArray(), true) . '; ?>'
	    );
	} else {
	    $definition = new Zend\Di\Definition\ArrayDefinition(
	        include __DIR__ . '/di_definition.php'
	    );
	}
	$di->setDefinitionList(new Zend\Di\DefinitionList(array($definition, new Zend\Di\Definition\RuntimeDefinition())));
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