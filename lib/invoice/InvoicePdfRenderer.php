<?php

namespace NP\invoice;

/**
 * PDF renderer for invoices
 *
 * @author Thomas Messier
 */

require_once('/vendor/phpwkhtmltopdf/WkHtmlToPdf.php');

class InvoicePdfRenderer extends InvoiceHtmlRenderer implements InvoiceRendererInterface {
	
	public function save($filename) {
		// Get a PDF
		$pdf = $this->generatePdf();
		
		// Save the PDF
		$pdf->saveAs($filename);

		if ($pdf->getError() !== null) {
			echo $pdf->getError();
		}
	}

	public function render() {
		// Get a PDF
		$pdf = $this->generatePdf();

		// Output the PDF headers
		$pdf->send('invoice.pdf');

		if ($pdf->getError() !== null) {
			echo $pdf->getError();
		}
	}

	/**
	 * Generate the PDF and get an object
	 */
	protected function generatePdf() {
		ob_start();
		
		echo '<!DOCTYPE HTML>' .
			'<html>' .
			'<body>';

		parent::render();

		echo '</body></html>';

		$html = ob_get_clean();

		$baseUrl = $this->configService->getLoginUrl();

		$pdf = new \WkHtmlToPdf([
			'footer-html'       => $this->configService->getLoginUrl() . '/lib/report/footer.php?baseUrl={$baseUrl}',
			'binPath'           => $this->configService->getConfig('reportServer')['wkhtmltopdfPath'],
			'tmp'               => $this->configService->getConfig('reportServer')['tempDir'],
			'orientation'       => 'portrait',
			'margin-top'        => 5,
			'margin-bottom'     => 12,
			'footer-spacing'    => 5,
			'disable-javascript'
		]);
		$pdf->addPage($html);

		return $pdf;
	}

}