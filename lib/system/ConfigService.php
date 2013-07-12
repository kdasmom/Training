<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\core\Exception;

use Zend\Cache\Storage\Adapter\WinCache;

/**
 * Service class for operations related to app configuration
 *
 * @author Thomas Messier
 */
class ConfigService extends AbstractService {
	
	protected $config, $cache, $siteService, $configsysGateway, $intReqGateway, $intPkgGateway, $lookupcodeGateway,
				$pnCustomFieldsGateway, $appName, $cacheName;
	
	/**
	 * @param array                                     $config                  Array with configuration options for the app
	 * @param Zend\Cache\Storage\Adapter\WinCache       $cache                   WinCache object injected
	 * @param \NP\system\SiteService                    $siteService             SiteService object injected
	 * @param \NP\system\ConfigsysGateway               $configsysGateway        ConfigsysGateway object injected
	 * @param \NP\system\PnUniversalFieldGateway        $pnUniversalFieldGateway PnUniversalFieldGateway object injected
	 * @param \NP\system\IntegrationRequirementsGateway $intReqGateway           IntegrationRequirementsGateway object injected
	 * @param \NP\system\IntegrationPackageGateway      $intPkgGateway           IntegrationPackageGateway object injected
	 * @param \NP\system\LookupcodeGateway              $lookupcodeGateway       LookupcodeGateway object injected
	 * @param \NP\system\PnCustomFieldsGateway          $pnCustomFieldsGateway   PnCustomFieldsGateway object injected
	 * @param boolean                                   $reloadCache             Whether to reload the cache at instantiation time (optional); defaults to false
	 */
	public function __construct($config, WinCache $cache, SiteService $siteService, ConfigsysGateway $configsysGateway, 
								PnUniversalFieldGateway $pnUniversalFieldGateway,  IntegrationRequirementsGateway $intReqGateway, 
								IntegrationPackageGateway $intPkgGateway, LookupcodeGateway $lookupcodeGateway,
								PnCustomFieldsGateway $pnCustomFieldsGateway, $reloadCache=false) {
		$this->config                  = $config;
		$this->cache                   = $cache;
		$this->siteService             = $siteService;
		$this->configsysGateway        = $configsysGateway;
		$this->pnUniversalFieldGateway = $pnUniversalFieldGateway;
		$this->intReqGateway           = $intReqGateway;
		$this->intPkgGateway           = $intPkgGateway;
		$this->lookupcodeGateway       = $lookupcodeGateway;
		$this->pnCustomFieldsGateway   = $pnCustomFieldsGateway;
		$this->appName                 = $siteService->getAppName();
		$this->cacheName               = $this->appName . "_config";
		
		if ($reloadCache || !$this->isCacheLoaded()) {
			$this->loadConfigCache();
		}

		// Defaulting locale to "en" for now until we implement this, will then probably come from session
		$this->setLocale('en');
	}
	
	/**
	 * Loads all config settings into the cache
	 */
	protected function loadConfigCache() {
		$configs = array();
		
		// Get all config values from DB and cache them
		$configRows = $this->configsysGateway->find();
		
		foreach ($configRows as $configRow) {
			$configs[strtolower($configRow['configsys_name'])] = $configRow['configsysval_val'];
		}
		$this->cache->setItem($this->cacheName, $configs);
	}
	
	/**
	 * Checks if the config cache is loaded
	 *
	 * @return boolean
	 */
	public function isCacheLoaded() {
		return $this->cache->hasItem($this->cacheName);
	}
	
	/**
	 * Returns all items in the cache
	 *
	 * @return array
	 */
	public function getAll() {
		return $this->cache->getItem($this->cacheName);
	}
	
	/**
	 * Get a specific item from the cache
	 *
	 * @param  string $key        The key for the item you want to retrieve
	 * @param  mixed  $defaultVal Default value to use if $key is not found in the cache (optional); defaults to null
	 * @return mixed
	 */
	public function get($key, $defaultVal=null) {
		$val = "";
		$key = strtolower($key);
		if ( !$this->isCached($key) ) {
			throw new Exception("The value you tried to retrieve doesn't exist");
		}
		$configs = $this->cache->getItem($this->cacheName);
		// Check the cache from DB items first, if found there return
		if ( array_key_exists($key, $configs) ) {
			$val = $configs[$key];
		} else {
			// If item not found in the DB cache, check the site config file cache
			$siteConfigs = $this->siteService->getClient($this->appName);
			
			// If it's found in the cache, return it
			if ( array_key_exists("$key", $siteConfigs) ) {
				$val = $siteConfigs[$key];
			// Otherwise just pull it from the DB
			} else {
				$configRec = $this->configsysGateway->find(array("configsys_name"=>$key));
				if (sizeof($configRec)) {
					$val = $configRec[0]["configsysval_val"];
				}
			}
		}
		
		// If the value is blank, return the default value
		if ($val == "") {
			$val = $defaultVal;
		}
		
		return $val;
	}
	
	/**
	 * Checks if a specific item is in the cache
	 *
	 * @param  string $key        The key for the item you want to check
	 * @return boolean
	 */
	public function isCached($key) {
		$key = strtolower($key);
		
		// If config cache hasn't been initialized for this app, do it now
		if (!$this->isCacheLoaded()) {
			$this->initConfigCache();
		}
		
		// Check if the value is in the cache loaded from DB
		$configs = $this->getAll();
		$exists = array_key_exists($key, $configs);
		
		// If not in values from DB, check the values from the site config file
		if (!$exists) {
			$exists = array_key_exists($key, $this->siteService->getClient($this->appName));
		}
		
		return $exists;
	}
	
	/**
	 * Get custom field data for an entity
	 *
	 * @param  string $customfield_pn_type      The entity type
	 * @param  int    $customfielddata_table_id The id of the entity
	 * @return array                            An associative array with the custom field data
	 */
	public function getCustomFieldData($customfield_pn_type, $customfielddata_table_id) {
		return $this->pnCustomFieldsGateway->findCustomFieldData($customfield_pn_type, $customfielddata_table_id);
	}

	/**
	 * Get all invoice/PO custom field config data
	 *
	 * @return array An associative array with all the relevant configuration values for invoice/po header and line custom fields
	 */
	public function getInvoicePoCustomFields() {
		$arCustomSettings = $this->configsysGateway->getCustomFieldSettings();
		
		$arIntReqs = $this->intReqGateway->find();
		
		$arFields = array(
			"header" => array("fields"=>array()),
			"line" => array("fields"=>array()),
		);
		
		$arTemp = array();
		foreach($arCustomSettings as $rec) {
			$arTemp[$rec["configsys_name"]] = $rec["configsysval_val"];
		}
		
		$arMaxlength = array(
			"header" => array(),
			"line" => array()	
		);
		
		foreach($arIntReqs as $rec) {
			$arMaxlength["header"][7][$rec["integration_package_id"]] = $rec["custom_field7_maxlength"];
			$arMaxlength["header"][8][$rec["integration_package_id"]] = $rec["custom_field8_maxlength"];
			$arMaxlength["line"][7][$rec["integration_package_id"]] = $rec["custom_field7_lineitem_maxlength"];
			$arMaxlength["line"][8][$rec["integration_package_id"]] = $rec["custom_field8_lineitem_maxlength"];
		}
		
		$invOnCount = 0;
		$poOnCount = 0;
		$poLineOnCount = 0;
		$invLineOnCount = 0;
		
		for ($i=1; $i<=8; $i++) {
			if ($i <= 6) {
				$fieldType = 'select';
			} else {
				$fieldType = 'text';
			}
			$lineFieldType = $fieldType;
			if (array_key_exists("CP.CUSTOM_FIELD".$i."_TYPE", $arTemp) && sizeof($arTemp["CP.CUSTOM_FIELD".$i."_TYPE"])) {
				$fieldType = $arTemp["CP.CUSTOM_FIELD".$i."_TYPE"];
			}
			
			// Loop through this twice just to avoid code repetition for header and line item fields
			for ($j=1; $j<=2; $j++) {
				if ($j == 1) { 
					$suffix = '';
					$key = 'header';
					$invOnCount += $arTemp["CP.INVOICE_CUSTOM_FIELD".$i."_ON_OFF"];
					$poOnCount += $arTemp["CP.PO_CUSTOM_FIELD".$i."_ON_OFF"];
				} else {
					$suffix = '_LINEITEM';
					$key = 'line';
					$poLineOnCount += $arTemp["CP.INVOICE_CUSTOM_FIELD".$i."_LINEITEM_ON_OFF"];
					$invLineOnCount += $arTemp["CP.PO_CUSTOM_FIELD".$i."_LINEITEM_ON_OFF"];
				}
				$arFields[$key]["fields"][$i] = array(
					"fieldNumber" => $i,
					"type" => $fieldType,
					"label" => $arTemp["CP.CUSTOM_FIELD_LABEL".$i.$suffix],
					"invOn" => $arTemp["CP.INVOICE_CUSTOM_FIELD".$i.$suffix."_ON_OFF"],
					"invRequired" => $arTemp["CP.INVOICE_CUSTOM_FIELD".$i.$suffix."_REQ"],
					"poOn" => $arTemp["CP.PO_CUSTOM_FIELD".$i.$suffix."_ON_OFF"],
					"poRequired" => $arTemp["CP.PO_CUSTOM_FIELD".$i.$suffix."_REQ"]
				);
				if (array_key_exists($i, $arMaxlength[$key])) {
					$arFields[$key]["fields"][$i]["maxlength"] = $arMaxlength[$key][$i];
				}
			}
		}
		$arFields["header"]["invOnCount"] = $invOnCount;
		$arFields["header"]["poOnCount"] = $poOnCount;
		$arFields["line"]["poLineOnCount"] = $poLineOnCount;
		$arFields["line"]["invLineOnCount"] = $invLineOnCount;
		
		return $arFields;
	}
	
	/**
	 * Gets values for a custom field drop down 
	 *
	 * @param  string  $customfield_pn_type    The entity type for which we want to get custom field options
	 * @param  int     $universal_field_number The custom field number
	 * @param  boolean [$activeOnly=true]      Whether or not to retrieve only active items
	 * @param  int     [$isLineItem=1]         Whether or not it's a line or header custom field (0=header; 1=line); defaults to 1
	 * @param  int     [$glaccount_id]         Associated GL account ID (optional); defaults to null
	 * @return array
	 */
	public function getCustomFieldOptions($customfield_pn_type, $universal_field_number, $activeOnly=true, 
										  $isLineItem=1, $glaccount_id=null) {
		return $this->pnUniversalFieldGateway->findCustomFieldOptions(
			$customfield_pn_type,
			$universal_field_number,
			$activeOnly,
			$isLineItem,
			$glaccount_id);
	}

	/**
	 * Gets lookup codes for a specified type
	 *
	 * @param  string $lookupcode_type The type of lookup code to retrieve
	 * @return array
	 */
	public function getLookupCodes($lookupcode_type) {
		return $this->lookupcodeGateway->find(
			array('lookupcode_type'=>"'{$lookupcode_type}'"), 
			array(), 
			'lookupcode_description ASC',
			array('lookupcode_id','lookupcode_description')
		);
	}

	/**
	 * Sets the current locale for the app
	 *
	 * @param string $locale
	 */
	public function setLocale($locale) {
		// Setup a Zend translator
		$translator = new \Zend\I18n\Translator\Translator();

		// Setup translation for Zend Validator module
		$language = $locale;
		// If no folder matches the locale name, just use the first part of the name (assuming it's in en_US format)
		if (stream_resolve_include_path("resources/languages/{$locale}/Zend_Validate.php") === false) {
			$language = array_shift(explode('_', $locale));
		}
		
		$resourcePath = stream_resolve_include_path("resources/languages/{$language}/Zend_Validate.php");
		if ($resourcePath === false) {
			throw new \NP\core\Exception("The locale \"{$locale}\" is invalid.");
		}

		// Add the default translation file from the Zend library
		$translator->addTranslationFile(
		    'phpArray',
		    $resourcePath,
		    'default',
		    $locale
		);
		// Set the locale on the translator
		$translator->setLocale($locale);

		// Make this the default translator for all validations
		\Zend\Validator\AbstractValidator::setDefaultTranslator($translator);
	}

	/**
	 * Returns a value from the $config array
	 *
	 * @param  string $key The name of the config option to retrieve
	 * @return mixed       The value of the config option
	 */
	public function getConfig($key) {
		return $this->config[$key];
	}

	/**
	 * Shortcut for getConfig('appRoot')
	 */
	public function getAppRoot() {
		return $this->getConfig('appRoot');
	}

	/**
	 * Gets the name of the client
	 *
	 * @return string The name of the client's app
	 */
	public function getAppName() {
		return $this->appName;
	}

	/**
	 * Returns path to the root client folder
	 */
	public function getClientFolder() {
		return $this->getAppRoot() . '/clients/' . $this->getAppName();
	}

	/**
	 * Get the client ID for the site currently being accessed
	 *
	 * @return int The id of the client
	 */
	public function getClientId() {
		return $this->siteService->getClientId();
	}
	
	/**
	 * Get the login URL for the site currently being accessed
	 *
	 * @return int The id of the client
	 */
	public function getLoginUrl() {
		return $this->siteService->getLoginUrl();
	}

	/**
	 * Returns the Timezone abbreviation for the server
	 *
	 * @return string
	 */
	public function getTimezoneAbr() {
		$date = new \DateTime();
		return $date->format('T');
	}

	/**
	 * Retrieves all integration packages for the app
	 *
	 * @return array Array of integration package records
	 */
	public function getIntegrationPackages() {
		return $this->intPkgGateway->find(null, null, 'integration_package_name');
	}
	
	
	/**
	 * Retrieves password configuration fields
	 *
	 * @return array Array of password configuration fields
	 */
	public function getPasswordConfiguration () {
		$arPassCfg = $this->configsysGateway->getPasswordConfiguration();
		
		$arTemp = array();
		foreach($arPassCfg as $rec) {
			$arTemp[strtolower($rec["configsys_name"])] = $rec["configsysval_val"];
		}
		return $arTemp;
	}
	
	/**
	 * Saves password configuration fields
	 *
	 * @param  array $data An associative array with the data needed to save password configuration
	 * @return array       An array with success status of the operation and any errors that happened
	 */
	public function setPasswordConfiguration ($data) {
		$errors = $this->configsysGateway->savePasswordConfiguration($data);
		
		$this->cache->setItems($data);
		
		// return the status of the save along with the errors if any
		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors
		);
	}
	
}

?>