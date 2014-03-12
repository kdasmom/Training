<?php

namespace NP\report\renderer;

/**
 * Excel renderer for reports
 *
 * @author Thomas Messier
 */

class ExcelReportRenderer extends AbstractReportRenderer implements ReportRendererInterface {	
	protected $htmlRenderer, $totalCols;

	public function render() {
		$this->htmlRenderer = new HtmlReportRenderer(
			$this->configService,
			$this->securityService,
			$this->gatewayManager,
			$this->report,
			$this->data
		);

		$this->totalCols = count($this->report->getCols());

		ob_start();
		
		parent::render();

		$html = ob_get_clean();

		echo $html;
	}

	public function renderHeader() {
		echo '<table>';

		parent::renderHeader();
	}

	public function renderBeforeRow() {
		$this->htmlRenderer->renderBeforeRow();
	}

	public function renderAfterRow() {
		$this->htmlRenderer->renderAfterRow();
	}

	public function renderColumnHeader($col, $colIdx) {
		$this->htmlRenderer->renderColumnHeader($col, $colIdx);
	}

	public function renderRecordCol($col, $colIdx, $val, $rawData) {
		$this->htmlRenderer->renderRecordCol($col, $colIdx, $val, $rawData);
	}

	public function renderGrandTotalCol($col, $colIdx, $val) {
		$this->htmlRenderer->renderGrandTotalCol($col, $colIdx, $val);
	}

	public function renderNoRecords() {
		$this->htmlRenderer->renderNoRecords();
	}

	protected function renderHeaderItem($html) {
		echo "<tr><td colspan=\"{$this->totalCols}\" align=\"center\">{$html}</td></tr>";
	}

	public function renderLogo() {
		$clientName = $this->configService->get('PN.Main.ClientShortName', '');
		$clientName = "<font size=\"+4\"><b>{$clientName}</b></font>";
		$this->renderHeaderItem($clientName);
	}

	public function renderTitle() {
		$this->renderHeaderItem('<b>' . $this->report->getTitle() . '</b>');
	}

	public function renderDateRange() {
		$dateRange = $this->getDateRange();

		$this->renderHeaderItem("{$this->report->getOptions()->dateFilterName}: {$dateRange}");
	}

	public function renderProperties() {
		$label = $this->getPropertyLabel();
		$this->renderHeaderItem("{$label}: {$this->getPropertyList()}");
	}

	public function renderExtraHeaderFilters() {
		foreach ($this->report->getExtraHeaderFilters() as $label=>$val) {
			$this->renderHeaderItem("{$label}: {$val}");
		}
	}

	public function renderBody() {
		parent::renderBody();

		echo '</table>';
	}

	public function renderSubTotalCol($col, $colIdx, $val, $rawData) {
		$val = "<b>{$val}</b>";

		$this->htmlRenderer->renderSubTotalCol($col, $colIdx, $val, $rawData);
	}

	public function renderGroupHeaderCol($col, $colIdx, $val, $rawData) {
		$val = "<b>{$val}</b>";
		
		$this->htmlRenderer->renderGroupHeaderCol($col, $colIdx, $val, $rawData);
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