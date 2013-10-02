<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\core\Exception;
use NP\core\Config;
use NP\security\SecurityService;

/**
 * Service class for operations related to app configuration
 *
 * @author Thomas Messier
 */
class ConfigService extends AbstractService {
	
	protected $config, $securityService, $siteService, $configsysGateway, $intReqGateway, $intPkgGateway, $lookupcodeGateway,
				$pnCustomFieldsGateway, $appName;
	
	public function __construct(Config $config, SecurityService $securityService, SiteService $siteService, ConfigsysGateway $configsysGateway, 
								PnUniversalFieldGateway $pnUniversalFieldGateway,  IntegrationRequirementsGateway $intReqGateway, 
								IntegrationPackageGateway $intPkgGateway, LookupcodeGateway $lookupcodeGateway,
								PnCustomFieldsGateway $pnCustomFieldsGateway) {
		$this->config                  = $config;
		$this->securityService         = $securityService;
		$this->siteService             = $siteService;
		$this->configsysGateway        = $configsysGateway;
		$this->pnUniversalFieldGateway = $pnUniversalFieldGateway;
		$this->intReqGateway           = $intReqGateway;
		$this->intPkgGateway           = $intPkgGateway;
		$this->lookupcodeGateway       = $lookupcodeGateway;
		$this->pnCustomFieldsGateway   = $pnCustomFieldsGateway;
		$this->appName                 = $siteService->getAppName();
		
		// Defaulting locale to "en" for now until we implement this, will then probably come from session
		$this->setLocale('en');
	}
	
	/**
	 * Returns all items in the cache
	 *
	 * @return array
	 */
	public function getAll() {
		return $this->config->getAll();
	}
	
	/**
	 * Get a specific item from the cache
	 *
	 * @param  string $key        The key for the item you want to retrieve
	 * @param  mixed  $defaultVal Default value to use if $key is not found in the cache (optional); defaults to null
	 * @return mixed
	 */
	public function get($key, $defaultVal=null) {
		return $this->config->get($key, $defaultVal);
	}
	
	/**
	 * Checks if a specific item is in the cache
	 *
	 * @param  string $key        The key for the item you want to check
	 * @return boolean
	 */
	public function isCached($key) {
		return $this->config->isCached($key);
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
					"type"        => $fieldType,
					"label"       => $arTemp["CP.CUSTOM_FIELD_LABEL".$i.$suffix],
					"invOn"       => ($arTemp["CP.INVOICE_CUSTOM_FIELD".$i.$suffix."_ON_OFF"] == '1') ? true : false,
					"invRequired" => ($arTemp["CP.INVOICE_CUSTOM_FIELD".$i.$suffix."_REQ"] == '1') ? true : false,
					"poOn"        => ($arTemp["CP.PO_CUSTOM_FIELD".$i.$suffix."_ON_OFF"] == '1') ? true : false,
					"poRequired"  => ($arTemp["CP.PO_CUSTOM_FIELD".$i.$suffix."_REQ"] == '1') ? true : false
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
										  $isLineItem=1, $glaccount_id=null, $keyword=null) {
		return $this->pnUniversalFieldGateway->findCustomFieldOptions(
			$customfield_pn_type,
			$universal_field_number,
			$activeOnly,
			$isLineItem,
			$glaccount_id,
			$keyword
		);
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
		return $this->config->getConfig($key);
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
		
		$this->config->loadConfigCache();
		
		// return the status of the save along with the errors if any
		return array(
			'success'    => (count($errors)) ? false : true,
			'errors'     => $errors
		);
	}
	
}

?>