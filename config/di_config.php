<?php

require_once("vendor/pimple/pimple/lib/Pimple.php");

$reloadCache = false;
if (array_key_exists("reloadconfiguration", $_GET)) {
	$reloadCache = true;
}

// Initialize the DI Framework
$di = new Pimple();

// DI Parameters
$di['locale'] = 'En';
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

$di['mailHost'] = $__CONFIG['mailServer']['host'];
$di['mailPort'] = $__CONFIG['mailServer']['port'];
$di['mailUsername'] = $__CONFIG['mailServer']['username'];
$di['mailPassword'] = $__CONFIG['mailServer']['password'];
$di['mailEncryptionType'] = $__CONFIG['mailServer']['encryptionType'];

// DI Definitions
$diDefinition = array(
	'Zend\Cache\Storage\Adapter\WinCache',
	'NP\core\GatewayManager',
	'NP\core\db\Adapter'                             => array('dbServer','dbName','dbUsername','dbPassword'),
	'NP\core\notification\Emailer'                   => array('mailHost','mailPort','mailUsername','mailPassword','mailEncryptionType'),
	'NP\core\validation\EntityValidator'             => array('LocalizationService','Adapter'),
	'NP\budget\BudgetGateway'                        => array('Adapter','FiscalCalService'),
	'NP\budget\BudgetService'                        => array('SoapService'),
	'NP\core\Config'                                 => array('config','reloadCache','WinCache','SiteService','ConfigsysGateway'),
	'NP\import\GLActualImportEntityValidator'        => array('LocalizationService','Adapter','IntegrationPackageGateway','GLAccountGateway','PropertyGateway','Config','SoapService'),
	'NP\import\GLBudgetImportEntityValidator'        => array('LocalizationService','Adapter','IntegrationPackageGateway','GLAccountGateway','PropertyGateway','Config','SoapService'),
	'NP\import\GLCategoryImportEntityValidator'      => array('LocalizationService','Adapter','IntegrationPackageGateway','GLAccountGateway'),
	'NP\import\GLCodeImportEntityValidator'          => array('LocalizationService','Adapter','IntegrationPackageGateway','GLAccountGateway'),
	'NP\import\InvoicePaymentImportEntityValidator'  => array('LocalizationService','Adapter','IntegrationPackageGateway','VendorGateway','PropertyGateway','SoapService'),
	'NP\import\PropertyImportEntityValidator'        => array('LocalizationService','Adapter','Config','IntegrationPackageGateway','StateGateway','PnCustomFieldsGateway','PnUniversalFieldGateway'),
	'NP\import\PropertyGLImportEntityValidator'      => array('LocalizationService','Adapter','IntegrationPackageGateway','PropertyGateway','GlAccountGateway','PropertyGlAccountGateway'),
	'NP\import\SplitImportEntityValidator'           => array('LocalizationService','Adapter','IntegrationPackageGateway','VendorGateway','PropertyGateway','UnitGateway','GlAccountGateway','DfSplitGateway','PnUniversalFieldGateway','ConfigService'),
	'NP\import\UnitImportEntityValidator'            => array('LocalizationService','Adapter','IntegrationPackageGateway','PropertyGateway','UnitGateway','UnitTypeGateway'),
	'NP\import\UnitTypeImportEntityValidator'        => array('LocalizationService','Adapter','IntegrationPackageGateway','PropertyGateway','UnitTypeGateway'),
	'NP\import\UserImportEntityValidator'            => array('LocalizationService','Adapter','Config','StateGateway','UserprofileGateway'),
	'NP\import\UserPropertyImportEntityValidator'    => array('LocalizationService','Adapter','UserprofileGateway','PropertyGateway','PropertyUserprofileGateway'),
	'NP\import\VendorFavoriteImportEntityValidator'  => array('LocalizationService','Adapter','IntegrationPackageGateway','VendorsiteGateway','PropertyGateway','VendorFavoriteGateway'),
	'NP\import\VendorUtilityImportEntityValidator'   => array('LocalizationService','Adapter','PropertyGateway','UnitGateway'),
	'NP\import\VendorInsuranceImportEntityValidator' => array('LocalizationService','Adapter','IntegrationPackageGateway','VendorGateway','PropertyGateway'),
	'NP\import\VendorImportEntityValidator'          => array('LocalizationService','Adapter','Config','IntegrationPackageGateway','StateGateway','VendorTypeGateway','GlAccountGateway','SoapService'),
	'NP\import\VendorGLImportEntityValidator'        => array('LocalizationService','Adapter','IntegrationPackageGateway','VendorGateway','GlAccountGateway','VendorGlAccountsGateway'),
	'NP\invoice\InvoiceGateway'                      => array('Adapter','FiscalCalService','RoleGateway','RegionGateway'),
	'NP\invoice\InvoiceService'                      => array('SecurityService','FiscalCalService','BudgetService'),
	'NP\invoice\InvoiceServiceInterceptor',
	'NP\locale\LocalizationService'                  => array('locale','LoggingService'),
	'NP\notification\NotificationService'            => array('Config','Emailer'),
	'NP\po\PurchaseOrderGateway'                     => array('Adapter','RoleGateway'),
	'NP\po\PoService'                                => array('BudgetService'),
	'NP\po\ReceiptGateway'                           => array('Adapter','RoleGateway'),
	'NP\property\PropertyService'                    => array('SecurityService','InvoiceService','PoService','FiscalCalService'),
	'NP\security\SecurityService'                    => array('config','SiteService','SessionService'),
	'NP\system\ConfigService'                        => array('Config','SecurityService','SiteService','IntegrationPackageGateway', 'ConfigsysGateway'),
	'NP\system\LoggingService'                       => array('logPath','enabledNamespaces','fileEnabled','debugEnabled'),
	'NP\system\SessionService'                       => array('Config','SiteService'),
	'NP\system\SiteService'                          => array('WinCache','configPath','reloadCache'),
	'NP\user\DelegationGateway'                      => array('Adapter','RoleGateway'),
	'NP\user\UserService'                            => array('SecurityService','NotificationService'),
	'NP\vendor\validation\VendorEntityValidator'     => array('LocalizationService','Adapter', 'VendorGateway', 'ConfigService'),
	'NP\vendor\VendorService'                        => array('VendorEntityValidator'),
	'NP\workflow\WfRuleGateway'                      => array('Adapter','UserprofileroleGateway'),
);

// Now we're gonna figure out some automatic definitions for gateways and services
$rootLibDir = "{$__CONFIG['appRoot']}lib";
$setAutoDi = function($directory, $recursive) use (&$setAutoDi, &$diDefinition, $rootLibDir) {
	// Recursively scan through lib directory
    if ($handle = opendir($directory)) {
        while (false !== ($file = readdir($handle))) {
        	// Check if dealing with a valid file
            if ($file != "." && $file != "..") {
            	// If directory, just recurse 
                if (is_dir($directory. "/" . $file)) {
                    if($recursive) {
                        $setAutoDi($directory. "/" . $file, $recursive);
                    }
                // If file, process it
                } else {
                	$className = explode('.', $file);
                	$className = array_shift($className);
                	$suffix = substr($className, -7);
                	// If we're dealing with a gateway or service, we can process it
                	if ($suffix == 'Gateway' || $suffix == 'Service') {
                		$module = explode('/', $directory);
	                	$module = array_pop($module);
	                	$classPath = "NP\\{$module}\\{$className}";
	                	// If this service or class hasn't year been defined, add it to the definitions
	                	if (!array_key_exists($classPath, $diDefinition)) {
	                		// Gateway always takes an Adapter as first argument
	                		if ($suffix == 'Gateway') {
	                			$diDefinition[$classPath] = array('Adapter');
	                		// Service requires no arguments
	                		} else {
	                			$diDefinition[] = $classPath;
	                		}
	                	}
                	}
                }
            }
        }
        closedir($handle);
    }
};

// Call the recursive function
$setAutoDi($rootLibDir, true);

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

        // Inject DI container via setter injection to all services and gateways
        if ($r->hasMethod('setPimple')) {
            $obj->setPimple($di);
        }

		// Inject the GatewayManager via setter injection
		if ($r->hasMethod('setGatewayManager')) {
			$obj->setGatewayManager($di['GatewayManager']);
		}

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

		// Inject the Locale service via setter injection to all interceptors
		if ($r->hasMethod('setLocalizationService')) {
			$obj->setLocalizationService($di['LocalizationService']);
		}

		// Inject the entity validator via setter injection to all interceptors
		if ($r->hasMethod('setEntityValidator')) {
			$obj->setEntityValidator($di['EntityValidator']);
		}

		// Return object
		return $obj;
	});
}