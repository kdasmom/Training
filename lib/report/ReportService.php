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
	
	protected $configService, $securityService, $url;
	
	public function __construct($url=null) {
		$this->url = $url;
	}

	public function setConfigService(\NP\system\ConfigService $configService) {
        $this->configService = $configService;
    }

	public function setSecurityService(\NP\security\SecurityService $securityService) {
        $this->securityService = $securityService;
    }

	/**
	 * This function displays a report. It takes care of figuring out if reports
	 * are to be run locally or from a remote report server
	 *
	 * @param string 					$report      The name of the report to run. Should correspond to the name of the report file/class in the report folder that implements ReportInterface
	 * @param string 					$format      Format of the report; valid options are 'html', 'pdf', or 'excel'
	 * @param NP\report\ReportOptions	$options     Report options (see AbstractReport class for available options)
	 * @param array 					$extraParams Any additional parameters you want to pass to the report
	 */
	public function showReport($report, $format='html', $options, $extraParams=[], $isRemote=0) {
		$this->setHeaders($format);

		// If we have a remote report server, make an HTTP request
		if ($this->url !== null && $isRemote == 0) {
			if (array_key_exists('propertyContext', $options)) {
				$options['propertyContext'] = $options['propertyContext']->toArray();
			}

			if (array_key_exists('dateFrom', $options)) {
				$options['dateFrom'] = $options['dateFrom']->format('Y-m-d H:i:s.u');
			}

			if (array_key_exists('dateTo', $options)) {
				$options['dateTo'] = $options['dateTo']->format('Y-m-d H:i:s.u');
			}

			$data = [
				'report'      => $report,
				'format'      => $format,
				'options'     => json_encode($options),
				'extraParams' => json_encode($extraParams),
				'isRemote'    => 1
			];

			$res = Util::httpRequest($this->url, 'POST', $data, $headers=null, $curl_options=null);

			echo $res['content'];
		// Otherwise just call the function locally
		} else {
			$this->generateReport($report, $format, $options, $extraParams);
		}
	}

	/**
	 * This function generates a report. For argument information, see showReport() function.
	 */
	private function generateReport($report, $format='html', $options, $extraParams=[]) {
		$options = new ReportOptions($options);

		$report = $this->getReport($report, $options, $extraParams);

		$data = $report->getData();

		$format = ucfirst(strtolower($format));

		$renderer = "NP\\report\\renderer\\{$format}ReportRenderer";

		$renderer = new $renderer($this->configService, $this->securityService, $this->gatewayManager, $report, $data);

		$renderer->render();
	}

	/**
	 * Gets the report class based on parameters passed. For argument information,
	 * see showReport() function (omit $format argument)
	 */
	private function getReport($report, ReportOptions $options, $extraParams=[]) {
		$report = str_replace('.', '\\', $report);
		$class  = "NP\\report\\{$report}";
		$report = new $class($this->configService, $this->securityService, $this->gatewayManager, $options, $extraParams);

		return $report;
	}

	/**
	 * Sets HTTP headers for certain types of reports
	 *
	 * @param string $format The report format; valid options are 'pdf' and 'excel'
	 */
	private function setHeaders($format) {
		if ($format == 'pdf') {
			$mime = 'application/pdf';
			$ext = 'pdf';
		} else if ($format == 'excel') {
			$mime = 'application/vnd.ms-excel';
			$ext = 'xls';
		} else {
			return;
		}

		header("Content-Type: {$mime}");
		header('Content-Disposition: attachment;filename="report.' . $ext . '"');
		header("Expires: ".gmdate("D, d M Y H:i:s", mktime(date("H")+2, date("i"), date("s"), date("m"), date("d"), date("Y")))." GMT");
		header("Last-Modified: ".gmdate("D, d M Y H:i:s")." GMT");
		header("Cache-Control: no-cache, must-revalidate");
		header("Pragma: no-cache");
	}
}

?>