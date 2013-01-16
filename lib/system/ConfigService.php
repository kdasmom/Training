<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\core\Exception;

use Zend\Cache\Storage\Adapter\WinCache;

class ConfigService extends AbstractService {
	
	private $cache, $siteService, $configsysGateway, $intReqGateway, $appName, $cacheName;
	
	public function __construct(WinCache $cache, SiteService $siteService, ConfigsysGateway $configsysGateway, PNUniversalFieldGateway $pnUniversalFieldGateway, 
								IntegrationRequirementsGateway $intReqGateway, $reloadCache) {
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
	}
	
	private function loadConfigCache() {
		if ($this->cache->hasItem($this->cacheName)) {
			$this->cache->removeItem($this->cacheName);
		}
		if (!$this->cache->hasItem($this->cacheName)) {
			$configs = array();
			
			// Get all config values from DB and cache them
			$configRows = $this->configsysGateway->find();
			
			foreach ($configRows as $configRow) {
				$configs[strtolower($configRow['configsys_name'])] = $configRow['configsysval_val'];
			}
			$this->cache->addItem($this->cacheName, $configs);
		}
	}
	
	public function isCacheLoaded() {
		return $this->cache->hasItem($this->cacheName);
	}
	
	public function getAll() {
		return $this->cache->getItem($this->cacheName);
	}
	
	public function get($key, $defaultVal="") {
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
				$configRec = $this->configsysGateway->select(array("configsys_name"=>$key));
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
	
	public function getCustomFields() {
		$arCustomSettings = $this->configsysGateway->getCustomFieldSettings();
		$arIntReqs = $this->intReqGateway->select();
		
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
	
	public function getCustomFieldDropDownValues($universal_field_number, $isLineItem, $glaccount_id=null) {
		return $this->pnUniversalFieldGateway->getCustomFieldDropDownValues($universal_field_number, $isLineItem, $glaccount_id);
	}
}

?>