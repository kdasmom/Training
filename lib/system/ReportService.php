<?php

namespace NP\system;

use NP\core\AbstractService;
use NP\core\Exception;

/**
 * Service class for operations related to app configuration
 *
 * @author Thomas Messier
 */
class ReportService extends AbstractService {
	
	protected $url, $username, $password;
	
	public function __construct($url, $username, $password) {
		$this->url      = $url;
		$this->username = $username;
		$this->password = $password;
	}

	/**
	 * 
	 */
	public function generateReport($reportPath, $format='html', $params=[], $locale='en-us') {
		$report = $this->getReport($reportPath, $params, $locale);

		$format = ucfirst(strtolower($format));
		$fn = "generate{$format}Report";

		$this->$fn($report);
	}

	/**
	 * 
	 */
	public function getReport($reportPath, $params=[], $locale='en-us') {
		$report = new \SSRSReport(new \Credentials($this->username, $this->password), $this->url);

		$report->LoadReport2($reportPath, NULL);

		if (count($params)) {
			$this->setReportParams($report, $params, $locale);
		}

		return $report;
	}

	/**
	 * 
	 */
	public function setReportParams(\SSRSReport $report, $params, $locale='en-us') {
		$reportParams = [];
		$i            = 0;

		foreach ($params as $name=>$val) {
			$reportParams[$i] = new \ParameterValue();
			$reportParams[$i]->Name  = $name;
			$reportParams[$i]->Value = $val;

			$i++;
		}
		$report->SetExecutionParameters2($reportParams, $locale);
	}

	/**
	 * 
	 */
	public function generateHtmlReport(\SSRSReport $report) {
		$renderer = new \RenderAsHTML();
		$renderer->ReplacementRoot = $this->getPageURL();
		$res      = $this->render($report, $renderer);

		echo $res['content'];
	}

	/**
	 * 
	 */
	public function generatePdfReport(\SSRSReport $report) {
		$renderer = new \RenderAsPDF();
		$res      = $this->render($report, $renderer);

		header("Content-Type: application/pdf");
		header("Content-length: ".(string)(strlen($res['content'])));
		header("Expires: ".gmdate("D, d M Y H:i:s", mktime(date("H")+2, date("i"), date("s"), date("m"), date("d"), date("Y")))." GMT");
		header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
		header("Cache-Control: no-cache, must-revalidate");
		header("Pragma: no-cache");

		echo $res['content'];
		die;
	}

	/**
	 * 
	 */
	private function render(\SSRSReport $report, $renderer) {
		$result = $report->Render2($renderer,
	                                 \PageCountModeEnum::$Estimate,
	                                 $Extension,
	                                 $MimeType,
	                                 $Encoding,
	                                 $Warnings,
	                                 $StreamIds);

		return [
			'content'   => $result,
			'Extension' => $Extension,
			'MimeType'  => $MimeType,
			'Encoding'  => $Encoding,
			'Warnings'  => $Warnings,
			'StreamIds' => $StreamIds
		];
	}

	private function getPageURL() {
	    $PageUrl = $_SERVER["HTTPS"] == "on"? 'https://' : 'http://';
	    $uri = $_SERVER["REQUEST_URI"];
	    $index = strpos($uri, '?');
	    if ($index !== false) {
	         $uri = substr($uri, 0, $index);
	    }
	    $PageUrl .= $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $uri;

	    return $PageUrl;
	}
}

?>