<?php
namespace NP\util;

use NP\core\AbstractService;

/**
 * This class provides functions for SOAP web service calls
 * 
 * This class is not meant to be instantiated and should have only static functions. 
 */
class SoapService extends AbstractService {
	protected $configService;
	
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

	/**
	 * Function to make a SOAP request by doing an HTTP post with XML
	 * 
	 * @param  string  $url        File system path of the image to resize
	 * @param  int     $body       Maximum width allowed
	 * @param  int     $soapAction Maximum height allowed
	 * @return array               The HTTP response to the SOAP request; any SOAP response XML will be in the "content" key
	 */
	public function request($url, $body, $header='', $soapAction=null) {
		$host = explode('/', $url);
		$host = $host[2];

		if ($soapAction === null) {
			$soapAction = simplexml_load_string($body);
			$soapAction = 'http://tempuri.org/' . $soapAction->getName();
		}

		if ($header !== '') {
			$header = '<soap:Header>' . $header . '</soap:Header>';
		}

		$xml = '<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    ' . $header . '
	<soap:Body>
		' . $body . '
	</soap:Body>
</soap:Envelope>';
		
		$this->loggingService->log('soap', 'XML prepared for SOAP request');
		$this->loggingService->log('soap', $xml);

		$res = Util::httpRequest(
		    $url,
		    'POST',
		    $xml,
		    array(
		        'Content-Type: text/xml; charset=utf-8',
		        'Accept: application/soap+xml, application/dime, multipart/related, text/*',
		        'Host: ' . $host,
		        'User-Agent: Axis/1.1',
		        'Cache-Control: no-cache',
		        'Pragma: no-cache',
		        'SOAPAction: ' . $soapAction,
		        'Content-Length: ' . strlen($xml)
		    )
		);

		if ($res['success']) {
			$this->loggingService->log('soap', 'Content returned by SOAP request');
			$this->loggingService->log('soap', $res['content']);

			try {
				$xml = new \SimpleXMLElement($res['content']);
			} catch(\Exception $e) {
				$res['success'] = false;
				return $res;
			}

			if ($xml !== false) {
				// We want to catch this and do nothing; this is something to faciliate parsing of results,
				// but if the results aren't in a standard format we don't want the process to fail,
				// it'll just need to be manually parsed using the 'content' key
				try {
					$res['soapResult'] = $xml->children('soap', true)->Body->children('', true)->children('', true);
				} catch(\Exception $e) {}
			}
		}

		return $res;
	}

	/**
	 * Helper function to get the SOAP settings
	 */
	public function getSettings() {
		return array(
			'wsdl_url'    => $this->configService->get('PN.Main.WebServiceOptions.WSDLAddress'),
			'wsdl_client' => $this->configService->get('PN.Main.WebserviceOptions.ClientName'),
			'wsdl_user'   => $this->configService->get('PN.Main.WebserviceOptions.Username'),
			'wsdl_pwd'    => $this->configService->get('PN.Main.WebserviceOptions.Password')
		);
	}

	/**
	 * Utility function to use the login function to log into NP webservices and get a session key
	 *
	 * @return string The session key
	 */
	public function login() {
		$settings = $this->getSettings();

		$xml = "<Login xmlns=\"http://tempuri.org/\">
				  <username>{$settings['wsdl_user']}</username>
				  <password>{$settings['wsdl_pwd']}</password>
				  <client_name>{$settings['wsdl_client']}</client_name>
				  <client_ip></client_ip>
				</Login>";

		$res = $this->request($settings['wsdl_url'], $xml);

		return (string)$res['soapResult']->LoginResult->ServiceTicket->SessionKey;
	}
}

?>