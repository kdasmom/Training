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
	/**
	 * @var Zend\Cache\Storage\Adapter\WinCache
	 */
	protected $cache;

	/**
	 * @var \NP\system\SiteService
	 */
	protected $siteService;
	
	/**
	 * @var \NP\system\ConfigsysGateway
	 */
	protected $configsysGateway;
	
	/**
	 * @var \NP\system\IntegrationRequirementsGateway
	 */
	protected $intReqGateway;
	
	/**
	 * @var string
	 */
	protected $appName;
	
	/**
	 * @var string
	 */
	protected $cacheName;
	
	/**
	 * @param Zend\Cache\Storage\Adapter\WinCache      $cache                   WinCache object injected
	 * @param \NP\system\SiteService                    $siteService             SiteService object injected
	 * @param \NP\system\ConfigsysGateway               $configsysGateway        ConfigsysGateway object injected
	 * @param \NP\system\PNUniversalFieldGateway        $pnUniversalFieldGateway PNUniversalFieldGateway object injected
	 * @param \NP\system\IntegrationRequirementsGateway $intReqGateway           IntegrationRequirementsGateway object injected
	 * @param boolean                                  $reloadCache             Whether to reload the cache at instantiation time (optional); defaults to false
	 */
	public function __construct(WinCache $cache, SiteService $siteService, ConfigsysGateway $configsysGateway, 
								PNUniversalFieldGateway $pnUniversalFieldGateway,  IntegrationRequirementsGateway $intReqGateway, 
								$reloadCache=false) {
		$this->cache = $cache;
		$this->siteService = $siteService;
		$this->configsysGateway = $configsysGateway;
		$this->pnUniversalFieldGateway = $pnUniversalFieldGateway;
		$this->intReqGateway = $intReqGateway;
		$this->appName = $siteService->getAppName();
		$this->cacheName = $this->appName . "_config";
		
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
	 * Get all custom field config data
	 *
	 * @return array An associative array with all the relevant configuration values for invoice/po header and line custom fields
	 */
	public function getCustomFields() {
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
	 * @param  int $universal_field_number The custom field number
	 * @param  int $isLineItem             Whether or not it's a line or header custom field (0=header; 1=line)
	 * @param  int $glaccount_id           Associated GL account ID (optional); defaults to null
	 * @return array
	 */
	public function getCustomFieldDropDownValues($universal_field_number, $isLineItem, $glaccount_id=null) {
		return $this->pnUniversalFieldGateway->getCustomFieldDropDownValues($universal_field_number, $isLineItem, $glaccount_id);
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
}

?>