<?php

namespace NP\report\renderer;

/**
 * PDF renderer for reports (relies on wkhtmltopdf PHP library and command line tool)
 *
 * @author Thomas Messier
 */

require_once('/vendor/phpwkhtmltopdf/WkHtmlToPdf.php');

class PdfReportRenderer extends HtmlReportRenderer implements ReportRendererInterface {	
	
	public function render() {
		ob_start();
		
		parent::render();

		$html = ob_get_clean();

		$baseUrl = $this->configService->getLoginUrl();

		$pdf = new \WkHtmlToPdf([
			'footer-html'       => $this->configService->getLoginUrl() . '/lib/report/footer.php?baseUrl={$baseUrl}',
			'binPath'           => $this->configService->getConfig('reportServer')['wkhtmltopdfPath'],
			'tmp'               => $this->configService->getConfig('reportServer')['tempDir'],
			'orientation'       => $this->report->getOptions()->orientation,
			'margin-top'        => 5,
			'margin-bottom'     => 12,
			'footer-spacing'    => 5,
			'disable-javascript'
		]);
		$pdf->addPage($html);

		$pdf->send('report.pdf');

		if ($pdf->getError() !== null) {
			echo $pdf->getError();
		}
	}

	public function getRecordRenderValue($col, $val, $row) {
		$val = $this->applyColRenderer($val, $row, $col);

		if ($val === null) {
			$val = '';
		}

		return $val;
	}
}

?>