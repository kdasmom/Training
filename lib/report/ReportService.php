<?php

namespace NP\report;

use NP\core\AbstractService;
use NP\core\Exception;
use NP\util\Util;

/**
 * Service class for operations related to app configuration
 *
 * @author Thomas Messier
 */
class ReportService extends AbstractService {
	
	protected $url;
	
	public function __construct($adapter, $url=null) {
		$this->adapter = $adapter;
		$this->url     = $url;
	}

	public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

	/**
	 * 
	 */
	public function showReport($report, $format, $params) {
		$data = [
			'report'      => $report,
			'format'      => $format,
			'params'      => json_encode($params)
		];

		// If we have a remote report server, make an HTTP request
		if ($this->url !== null) {
			$res = Util::httpRequest($this->url, 'POST', $data, $headers=null, $curl_options=null);

			if ($format == 'pdf') {
				$this->setPdfHeaders($res['content']);
			}

			echo $res['content'];
		// Otherwise just call the function locally
		} else {
			$this->generateReport($report, $format, $params);
		}
	}

	/**
	 * 
	 */
	public function generateReport($report, $format='html', $params=[]) {
		$report = $this->getReport($report, $params);

		$data = $this->adapter->getQueryStmt($report->getSql(), $report->getQueryParams());

		$format = ucfirst(strtolower($format));

		$renderer = "NP\\report\\renderer\\{$format}ReportRenderer";

		$renderer = new $renderer($this->configService, $report, $data);

		$renderer->render();
	}

	/**
	 * 
	 */
	public function getReport($report, $params=[]) {
		$class = "NP\\report\\{$report}";
		$report = new $class($this->configService, $this->gatewayManager, $params);

		return $report;
	}

	/**
	 * 
	 */
	private function setPdfHeaders($content) {
		header("Content-Type: application/pdf");
		header("Content-length: ".(string)(strlen($content)));
		header("Expires: ".gmdate("D, d M Y H:i:s", mktime(date("H")+2, date("i"), date("s"), date("m"), date("d"), date("Y")))." GMT");
		header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
		header("Cache-Control: no-cache, must-revalidate");
		header("Pragma: no-cache");
	}
}

?>