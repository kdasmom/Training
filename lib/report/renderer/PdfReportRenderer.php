<?php

namespace NP\report\renderer;

/**
 * Renderer to generate a PDF report
 *
 * @author Thomas Messier
 */

require_once('/vendor/phpwkhtmltopdf/WkHtmlToPdf.php');

class PdfReportRenderer implements ReportRendererInterface {
	
	public function __construct($configService, \NP\report\ReportInterface $report, $data) {
		$this->configService = $configService;
		$this->report        = $report;
		$this->data          = $data;
	}
	
	/**
	 * 
	 */
	public function render() {
		$htmlRenderer = new HtmlReportRenderer($this->configService, $this->report, $this->data);

		ob_start();
		
		$htmlRenderer->render();

		$html = ob_get_clean();

		$pdf = new \WkHtmlToPdf([
			'binPath'     =>'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe',
			'tmp'         => 'c:\temp',
			'orientation' =>'landscape'
		]);
		$pdf->addPage($html);

		$pdf->send();

		if ($pdf->getError() !== null) {
			echo $pdf->getError();
		}
	}
}

?>