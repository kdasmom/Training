<?php

namespace NP\system;

use Zend\Cache\Storage\Adapter\WinCache;

class SiteService {
	
	private $configPath, $cache, $appName = null;
	
	public function __construct(WinCache $cache, $configPath, $reloadCache) {
		$this->cache = $cache;
		$this->configPath = $configPath;
		
		if (!$cache->hasItem('clients') || !$cache->hasItem('site_urls') || $reloadCache) {
			$this->parseSiteConfig();
		}
	}
	
	private function parseSiteConfig() {
		// Clear the cache if needed
		if ($this->cache->hasItem('clients')) {
			$this->cache->removeItem('clients');
		}
		if ($this->cache->hasItem('site_urls')) {
			$this->cache->removeItem('site_urls');
		}
		
		// Load XML configuration
		$configXML = simplexml_load_file($this->configPath);
		
		$stConfig = array();
		
		$clients = array();
		$site_urls = array();
		
		// Loop through clients in config file
		foreach($configXML->children() as $client) {
			$appName = (string)$client->application_name;
			// If the config has a loginURL and DSN for this client, add it to the cache
			if (array_key_exists("LoginUrl", $client->CONFIG->PN->Main) && array_key_exists("dsn", $client->CONFIG->PN->Main)) {
				// Store the needed values in the cache
				$clients[$appName] = array(
					"pn.main.dsn"		=> (string)$client->CONFIG->PN->Main->dsn,
					"pn.main.loginurl"	=> (string)$client->CONFIG->PN->Main->LoginUrl,
					"asp.client_id"		=> (string)$client->CONFIG->asp->client_id
				);
			}
			
			// Loop through all URLs for this client and store them in a struct with a reference to the client config values
			foreach($client->access_url as $access_url) {
				$site_urls[(string)$access_url] = $appName;
			}
		}
		
		// Create the two caches needed
		$this->cache->setItem('clients', $clients);
		$this->cache->setItem('site_urls', $site_urls);
	}
	
	private function getClients() {
		return $this->cache->getItem('clients');
	}
	
	private function getSiteUrls() {
		return $this->cache->getItem('site_urls');
	}
	
	public function getAppName() {
		// If we haven't figured out the app name yet, let's do it
		if ($this->appName == null) {
			// Get the domain name and the folder
			$urlBits = explode("/", $_SERVER["SCRIPT_NAME"]);
			$urlPathPrefix = "*/" . $urlBits[1] . "/";
			$hostName = $_SERVER["SERVER_NAME"];
			
			// Check if the domain or folder match a URL
			if ($this->urlExists($hostName)) {
				$url = $hostName;
			} else if ($this->urlExists($urlPathPrefix)) {
				$url = $urlPathPrefix;
			} else {
				throw new \Exception('Site not configured.');
			}
			
			$this->appName = $this->getAppNameByUrl($url);
		}
		
		return $this->appName;
	}
	
	public function getDdName() {
		$client = $this->getClient($this->getAppName());
		return $client['pn.main.dsn'];
	}
	
	public function getClient($appName) {
		$clients = $this->getClients();
		return $clients[$appName];
	}
	
	public function urlExists($url) {
		$urls = $this->getSiteUrls();
		
		return array_key_exists($url, $urls);
	}
	
	public function getAppNameByUrl($url) {
		$urls = $this->getSiteUrls();
		
		return $urls[$url];
	}

}

?>