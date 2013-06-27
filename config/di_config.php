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
$di['config'] = $__CONFIG;

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
$di['sessionDuration'] = $di->share(function($di) use ($__CONFIG) {
	return $di['ConfigService']->get('main.util.logofftime', 1800);
});

$di['mailHost'] = $__CONFIG['mailServer']['host'];
$di['mailPort'] = $__CONFIG['mailServer']['port'];
$di['mailUsername'] = $__CONFIG['mailServer']['username'];
$di['mailPassword'] = $__CONFIG['mailServer']['password'];
$di['mailEncryptionType'] = $__CONFIG['mailServer']['encryptionType'];

// DI Definitions
$diDefinition = array(
	'Zend\Cache\Storage\Adapter\WinCache',
	'NP\core\db\Adapter'                       => array('dbServer','dbName','dbUsername','dbPassword'),
	'NP\core\notification\Emailer'             => array('mailHost','mailPort','mailUsername','mailPassword','mailEncryptionType'),
	'NP\budget\BudgetGateway'                  => array('Adapter'),
	'NP\budget\GlAccountYearGateway'           => array('Adapter'),
	'NP\budget\BudgetService'                  => array('BudgetGateway','GlAccountYearGateway'),
	'NP\catalog\LinkVcitemcatGlGateway'        => array('Adapter'),
	'NP\catalog\LinkVcPropertyGateway'         => array('Adapter'),
	'NP\catalog\LinkVcVccatGateway'            => array('Adapter'),
	'NP\catalog\LinkVcVendorGateway'           => array('Adapter'),
	'NP\catalog\VcGateway'                     => array('Adapter'),
	'NP\catalog\VcCatGateway'                  => array('Adapter'),
	'NP\catalog\VcItemGateway'                 => array('Adapter'),
	'NP\catalog\CatalogService'                => array('VcGateway','LinkVcitemcatGlGateway','LinkVcPropertyGateway','LinkVcVccatGateway','LinkVcVendorGateway','VcItemGateway','VcCatGateway','VendorGateway'),
	'NP\contact\AddressGateway'                => array('Adapter'),
	'NP\contact\EmailGateway'                  => array('Adapter'),
	'NP\contact\PersonGateway'                 => array('Adapter'),
	'NP\contact\PhoneGateway'                  => array('Adapter'),
	'NP\contact\PhoneTypeGateway'              => array('Adapter'),
	'NP\gl\GLAccountGateway'                   => array('Adapter'),
	'NP\gl\GLService'                          => array('GLAccountGateway'),
	'NP\invoice\InvoiceGateway'                => array('Adapter','RoleGateway'),
	'NP\invoice\InvoiceItemGateway'            => array('Adapter'),
	'NP\invoice\InvoiceService'                => array('SecurityService','InvoiceGateway','InvoiceItemGateway','BudgetService'),
	'NP\invoice\InvoiceServiceInterceptor',
	'NP\notification\EmailAlertGateway'        => array('Adapter'),
	'NP\notification\EmailAlertHourGateway'    => array('Adapter'),
	'NP\notification\EmailAlertTypeGateway'    => array('Adapter'),
	'NP\notification\NotificationService'      => array('EmailAlertTypeGateway','EmailAlertGateway','EmailAlertHourGateway', 'UserprofileGateway'),
	'NP\po\PoItemGateway'                      => array('Adapter'),
	'NP\po\PurchaseOrderGateway'               => array('Adapter'),
	'NP\po\PoService'                          => array('PurchaseOrderGateway','PoItemGateway','BudgetService'),
	'NP\property\FiscalcalGateway'             => array('Adapter'),
	'NP\property\FiscalcalMonthGateway'        => array('Adapter'),
	'NP\property\FiscalDisplayTypeGateway'     => array('Adapter'),
	'NP\property\PropertyGateway'              => array('Adapter'),
	'NP\property\PropertyGlAccountGateway'     => array('Adapter'),
	'NP\property\PropertyService'              => array('SecurityService','PropertyGateway','RegionGateway','FiscalcalGateway','PropertyUserprofileGateway','UnitGateway','UserprofileGateway','InvoiceService','PoService','WfRuleTargetGateway','FiscalDisplayTypeGateway','FiscalcalMonthGateway','AddressGateway','PhoneGateway','PhoneTypeGateway','RecAuthorGateway','PnCustomFieldsGateway','PnCustomFieldDataGateway','PropertyGlAccountGateway','UnitTypeGateway','UnitTypeValGateway','UnitTypeMeasGateway'),
	'NP\property\RegionGateway'                => array('Adapter'),
	'NP\property\UnitGateway'                  => array('Adapter'),
	'NP\property\UnitTypeGateway'              => array('Adapter'),
	'NP\property\UnitTypeValGateway'           => array('Adapter'),
	'NP\property\UnitTypeMeasGateway'          => array('Adapter'),
	'NP\security\SecurityService'              => array('SessionService','UserprofileGateway','RoleGateway','UserprofileLogonGateway','ModulePrivGateway','RegionGateway','PropertyGateway','ConfigService'),
	'NP\system\ConfigsysGateway'               => array('Adapter'),
	'NP\system\ConfigService'                  => array('config','WinCache','SiteService','ConfigsysGateway','PnUniversalFieldGateway','IntegrationRequirementsGateway','IntegrationPackageGateway','LookupcodeGateway','PnCustomFieldsGateway','reloadCache'),
	'NP\system\NotificationService'            => array('Emailer'),
	'NP\system\PicklistService'                => array('IntegrationPackageGateway','RegionGateway'),
	'NP\system\PnCustomFieldsGateway'          => array('Adapter'),
	'NP\system\PnCustomFieldDataGateway'       => array('Adapter'),
	'NP\system\PnUniversalFieldGateway'        => array('Adapter'),
	'NP\system\IntegrationRequirementsGateway' => array('Adapter'),
	'NP\system\IntegrationPackageGateway'      => array('Adapter'),
	'NP\system\LookupcodeGateway'              => array('Adapter'),
	'NP\system\UserMessageGateway'             => array('Adapter'),
	'NP\system\UserMessageRecipientGateway'    => array('Adapter'),
	'NP\system\MessageService'                 => array('UserMessageGateway','UserMessageRecipientGateway'),
	'NP\system\LoggingService'                 => array('logPath','enabledNamespaces','fileEnabled','debugEnabled'),
	'NP\system\SessionService'                 => array('sessionDuration'),
	'NP\system\SiteService'                    => array('WinCache','configPath','reloadCache'),
	'NP\user\DelegationGateway'                => array('Adapter','RoleGateway'),
	'NP\user\DelegationPropGateway'            => array('Adapter'),
	'NP\user\MobInfoGateway'                   => array('Adapter'),
	'NP\user\ModulePrivGateway'                => array('Adapter'),
	'NP\user\PropertyUserprofileGateway'       => array('Adapter'),
	'NP\user\RecAuthorGateway'                 => array('Adapter'),
	'NP\user\RoleGateway'                      => array('Adapter'),
	'NP\user\StaffGateway'                     => array('Adapter'),
	'NP\user\UserprofileGateway'               => array('Adapter'),
	'NP\user\UserprofileroleGateway'           => array('Adapter'),
	'NP\user\UserSettingGateway'               => array('Adapter'),
	'NP\user\UserService'                      => array('SecurityService','DelegationGateway','UserSettingGateway','UserprofileGateway','RoleGateway','PersonGateway','AddressGateway','EmailGateway','PhoneGateway','PropertyUserprofileGateway','MobInfoGateway','DelegationPropGateway'),
	'NP\user\UserprofileLogonGateway'          => array('Adapter'),
	'NP\vendor\VendorGateway'                  => array('Adapter','PropertyService'),
	'NP\vendor\VendorService'                  => array('VendorGateway'),
	'NP\workflow\WfRuleTargetGateway'          => array('Adapter'),
);

// Loop through all the definitions
foreach($diDefinition as $classPath=>$dependencies) {
	// If the item is not a key/value pair, assume there are no dependencies
	if (is_numeric($classPath)) {
		$classPath = $dependencies;
		$dependencies = array();
	}
	// Alias is the name of the class
	$alias = explode('\\', $classPath);
	$alias = array_pop($alias);

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

		// Inject the Config service via setter injection to all services and gateways
		if ($r->hasMethod('setConfigService')) {
			$obj->setConfigService($di['ConfigService']);
		}

		// Inject the Security service via setter injection to all interceptors
		if ($r->hasMethod('setSecurityService')) {
			$obj->setSecurityService($di['SecurityService']);
		}

		// Return object
		return $obj;
	});
}