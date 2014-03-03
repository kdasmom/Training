<?php

namespace NP\report\renderer;

/**
 * Renderer to generate a PDF report
 *
 * @author Thomas Messier
 */

require_once('/vendor/tcpdf/config/tcpdf_config.php');
require_once('/vendor/tcpdf/tcpdf.php');

class PdfReportRenderer extends AbstractReportRenderer implements ReportRendererInterface {
	
	protected $pdf, $rowHeight=0, $maxHeight=0, $defaultHeight=5, $pageHeight=0,
				$pageEnd, $yEnd;

	public function __construct(\NP\report\ReportInterface $report, $data) {
		parent::__construct($report, $data);
		
		$this->logger = new \NP\system\LoggingService(null, ['global'], false, true);
		ob_start();

		$this->adjustColWidth();
	}

	private function getPrintableWidth() {
		$width = ($this->report->getOrientation() == 'P') ? 220 : 307;
		
		return ($width - PDF_MARGIN_LEFT - PDF_MARGIN_RIGHT);
	}

	private function adjustColWidth() {
		$usePercent = false;
		$cols = $this->report->getCols();
		
		$totalWidth = 0;
		foreach ($cols as $col) {
			if ($col->width < 1) {
				$usePercent = true;
				break;
			} else {
				$totalWidth += $col->width;
			}
		}

		foreach ($cols as $i=>$col) {
			if ($usePercent) {
				$col->width = $this->getPrintableWidth() * $col->width;
			} else {
				$col->width = ($col->width / $totalWidth) * $this->getPrintableWidth();
			}
		}
	}

	public function render() {
		$this->pdf = new \TCPDF($this->report->getOrientation(), PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

		$this->pdf->SetFont('helvetica', '', 8, '', true);
		$this->pdf->AddPage();

		parent::render();

		$this->pdf->Output('report.pdf', 'I');
	}

	public function renderHeader() {

	}

	public function renderBeforeRow() {
		
	}

	public function renderAfterRow() {
		$this->pdf->Ln();
	}

	public function renderColumnHeaders() {
		$this->pdf->SetFillColor(238, 238, 238);
		$this->pdf->SetTextColor(0);
		$this->pdf->SetDrawColor(0);
		$this->pdf->SetLineWidth(0.1);
		$this->pdf->SetFont('', 'B');
		
		parent::renderColumnHeaders();
	}

	public function renderColumnHeader($col) {
		$this->pdf->Cell($col->width, 7, $col->name, 'B', 0, strtoupper(substr($col->alignment, 0, 1)), 1);
	}

	public function renderData() {
		$this->pdf->SetFillColor(255, 255, 255);
		$this->pdf->SetTextColor(0);
		$this->pdf->SetFont('');

		parent::renderData();
	}

	public function renderRow($type, $cols, $cellData, $rawData) {
		$defaultHeight = ($type == 'column') ? 7 : $this->defaultHeight;
		$this->setRowHeight($defaultHeight, $type, $cellData, $rawData);

		parent::renderRow($type, $cols, $cellData, $rawData);
	}

	public function renderGroupHeaderCol($col, $val, $rawData) {
		$this->pdf->SetFont('', 'B');

		return $this->renderCell($col, $val, $this->rowHeight, $this->maxHeight);
	}

	public function renderRecordCol($col, $val, $rawData) {
		$this->pdf->SetFont('');

		return $this->renderCell($col, $val, $this->rowHeight, $this->maxHeight);
	}

	public function renderSubTotalCol($col, $val, $rawData) {
		$this->pdf->SetFont('', 'B');

		return $this->renderCell($col, $val, $this->rowHeight, $this->maxHeight);
	}

	public function renderGrandTotalCol($col, $val) {
		return $this->renderSubTotalCol($col, $val, null);
	}

	public function renderCell($col, $val, $height, $maxHeight) {
		return $this->pdf->MultiCell($col->width, $height, $val, 'B', strtoupper(substr($col->alignment, 0, 1)), 0, 0, '', '', true, 0, false, false, $maxHeight, 'M');
	}

	public function renderFooter() {
		
	}

	public function setRowHeight($defaultHeight, $type, $row, $rawData) {
		$cols = $this->report->getCols();
		$this->rowHeight = $defaultHeight;
		$this->maxHeight = 0;

		$numPages = $this->pdf->getNumPages();

		// store current object
		$this->pdf->startTransaction();

		foreach ($cols as $col) {
			$fn = 'render' . ucfirst($type) . 'Col';
			$cellNum = $this->$fn($col, $row[$col->field], $rawData);
			$height = $cellNum * $this->defaultHeight;

			if ($height > $this->rowHeight) {
				$this->rowHeight = $height;
			}
		}

		$this->logger->log('global', '', ['page'=>$this->pdf->getPage(), 'y'=>$this->pdf->getY(), 'numPages'=>$this->pdf->getNumPages()]);

		$newNumPages = $this->pdf->getNumPages();

		$this->maxHeight = $this->rowHeight;

		$this->pdf = $this->pdf->rollbackTransaction();

		if ($newNumPages > $numPages) {
			$this->pdf->AddPage();
		}
	}
}

?>