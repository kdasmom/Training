<?php

require_once("vendor/pimple/pimple/lib/Pimple.php");

$reloadCache = false;
if (array_key_exists("reloadconfiguration", $_GET)) {
	$reloadCache = true;
}

// Initialize the DI Framework
$di = new Pimple();

// DI Parameters
$di['reloadCache'] = $reloadCache;
$di['configPath'] = $__CONFIG['appRoot'] . 'config\\site_config.xml';

$di['logPath'] = $di->share(function($di) use ($__CONFIG) {
	return $__CONFIG['logPath'].'\\'.$di['SiteService']->getAppName();
});
$di['enabledNamespaces'] = $__CONFIG['enabledNamespaces'];
$di['fileEnabled']       = $__CONFIG['fileLogEnabled'];
$di['debugEnabled']      = $__CONFIG['debugLogEnabled'];

$di['dbServer'] = $__CONFIG['datasource']['hostname'];
$di['dbName'] = $di->share(function($di) use ($__CONFIG) {
	return $di['SiteService']->getDatabaseName();
});
$di['dbUsername'] = $__CONFIG['datasource']['username'];
$di['dbPassword'] = $__CONFIG['datasource']['password'];
$di['sessionDuration'] = $__CONFIG['sessionDuration'];

// DI Definitions
$diDefinition = array(
	'Zend\Cache\Storage\Adapter\WinCache',
	'NP\core\db\Adapter'                       => array('dbServer','dbName','dbUsername','dbPassword'),
	'NP\gl\GLAccountGateway'                   => array('Adapter','ConfigService'),
	'NP\gl\GLService'                          => array('GLAccountGateway'),
	'NP\invoice\InvoiceGateway'                => array('Adapter','ConfigService','RoleGateway'),
	'NP\invoice\InvoiceItemGateway'            => array('Adapter'),
	'NP\invoice\InvoiceService'                => array('SecurityService','InvoiceGateway','InvoiceItemGateway'),
	'NP\property\FiscalcalGateway'             => array('Adapter'),
	'NP\property\PropertyGateway'              => array('Adapter'),
	'NP\property\PropertyService'              => array('SecurityService','PropertyGateway','FiscalcalGateway','UnitGateway'),
	'NP\property\RegionGateway'                => array('Adapter'),
	'NP\property\UnitGateway'                  => array('Adapter'),
	'NP\system\ConfigsysGateway'               => array('Adapter'),
	'NP\system\ConfigService'                  => array('WinCache','SiteService','ConfigsysGateway','PNUniversalFieldGateway','IntegrationRequirementsGateway','reloadCache'),
	'NP\system\PNUniversalFieldGateway'        => array('Adapter'),
	'NP\system\IntegrationRequirementsGateway' => array('Adapter'),
	'NP\system\PicklistGateway'                => array('Adapter'),
	'NP\system\PicklistService'                => array('PicklistGateway'),
	'NP\system\LoggingService'                 => array('logPath','enabledNamespaces','fileEnabled','debugEnabled'),
	'NP\system\Session'                        => array('sessionDuration'),
	'NP\system\SecurityService'                => array('Session','UserprofileGateway','UserprofileLogonGateway','ModulePrivGateway'),
	'NP\system\SiteService'                    => array('WinCache','configPath','reloadCache'),
	'NP\user\DelegationGateway'                => array('Adapter'),
	'NP\user\ModulePrivGateway'                => array('Adapter'),
	'NP\user\RoleGateway'                      => array('Adapter'),
	'NP\user\UserprofileGateway'               => array('Adapter'),
	'NP\user\UserSettingGateway'               => array('Adapter'),
	'NP\user\UserService'                      => array('SecurityService','InvoiceService','PropertyGateway','RegionGateway','GLAccountGateway','DelegationGateway','UserSettingGateway','UserprofileGateway','RoleGateway'),
	'NP\user\UserprofileLogonGateway'          => array('Adapter'),
	'NP\vendor\VendorGateway'                  => array('Adapter','ConfigService','PropertyService'),
	'NP\vendor\VendorService'                  => array('VendorGateway'),
);

// Loop through all the definitions
foreach($diDefinition as $classPath=>$dependencies) {
	// If the item is not a key/value pair, assume there are no dependencies
	if (is_numeric($classPath)) {
		$classPath = $dependencies;
		$dependencies = array();
	}
	// Alias is the name of the class
	$alias = array_pop(explode('\\', $classPath));

	// Add each class to the dependecy injection container as a singleton
	$di[$alias] = $di->share(function($di) use ($alias, $classPath, $dependencies) {
		// Build an array of arguments for instantiating the class
		$args = array();
		foreach($dependencies as $dep) {
			$args[] = $di[$dep];
		}
		
		// Instantiate the class using reflection (due to variable number of arguments)
		$r = new ReflectionClass($classPath);
		$obj = $r->newInstanceArgs($args);

		// Inject the Logging service via setter injection to all services and gateways
		if ($r->hasMethod('setLoggingService')) {
			$obj->setLoggingService($di['LoggingService']);
		}

		// Return object
		return $obj;
	});
}