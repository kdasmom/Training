<?php

namespace NP\core;

use Zend\Cache\Storage\Adapter\WinCache;
use NP\system\SiteService;
use NP\system\ConfigsysGateway;

/**
 * Object to store configuration settings
 *
 * @author Thomas Messier
 */
class Config {
	
	protected $config, $cache, $siteService, $configsysGateway;
	
	public function __construct($config, $reloadCache=false, WinCache $cache, SiteService $siteService,
								ConfigsysGateway $configsysGateway) {
		$this->config           = $config;
		$this->cache            = $cache;
		$this->siteService      = $siteService;
		$this->configsysGateway = $configsysGateway;
		
		$this->appName          = $siteService->getAppName();
		$this->cacheName        = $this->appName . "_config";
		
		if ($reloadCache || !$this->isCacheLoaded()) {
			$this->loadConfigCache();
		}
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

	public function set($key, $val) {
		$this->cache->setItem($key, $val);
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
	 * Returns a value from the $config array
	 *
	 * @param  string $key          The name of the config option to retrieve
	 * @param  mixed  $defaultValue Default value to return if value doesn't exist
	 * @return mixed                The value of the config option
	 */
	public function getConfig($key, $defaultValue=null) {
		if (array_key_exists($key, $this->config)) {
			return $this->config[$key];
		} else {
			return $defaultValue;
		}
	}
	
}

?>