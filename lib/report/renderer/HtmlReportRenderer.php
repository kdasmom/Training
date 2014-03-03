<?php

namespace NP\report\renderer;

/**
 * Base report class
 *
 * @author Thomas Messier
 */
class HtmlReportRenderer extends AbstractReportRenderer implements ReportRendererInterface {
	
	protected $hasPercentCol = false, $logger;

	public function __construct($configService, \NP\report\ReportInterface $report, $data) {
		parent::__construct($configService, $report, $data);
		
		$this->adjustColWidth();
	}

	/**
	 * 
	 */
	private function adjustColWidth() {
		$cols = $this->report->getCols();
		
		$totalWidth = 0;
		foreach ($cols as $col) {
			if ($col->width < 1) {
				$col->width = (string)($col->width * 100) . '%';
				$this->hasPercentCol = true;
			}
		}
	}

	public function render() {
		echo '<!DOCTYPE HTML><html><head><title>NexusPayables</title></head><body>';

		parent::render();

		echo '</body></html>';
	}

	public function renderHeader() {

	}

	function renderBeforeRow() {
		echo '<tr>';
	}

	function renderAfterRow() {
		echo '</tr>';
	}

	public function renderBody() {
		$width = '';
		if ($this->hasPercentCol) {
			$width = ' width="100%"';
		}

		echo '<link rel="stylesheet" href="' . $this->configService->getLoginUrl() . '/resources/report.css" />';

		echo "<table{$width}>";
		
		parent::renderBody();

		echo '</table>';
	}

	public function renderColumnHeaders() {
		echo '<thead>';
		
		parent::renderColumnHeaders();

		echo '</thead>';
	}

	public function renderColumnHeader($col) {
		echo "<th width=\"{$col->width}\" align=\"{$col->alignment}\">{$col->name}</th>";
	}

	public function renderGroupHeaderCol($col, $val, $rawData) {
		if (!empty($val)) {
			$val = "<b>{$val}</b>";
		}
		echo "<td align=\"{$col->alignment}\">{$val}</td>";
	}

	public function renderData() {
		echo '<tbody>';

		parent::renderData();

		echo '</tbody>';
	}

	public function renderRecordCol($col, $val, $row) {
		echo "<td align=\"{$col->alignment}\">{$val}</td>";
	}

	public function renderSubTotalCol($col, $val, $rawData) {
		if (!empty($val)) {
			$val = "<b>{$val}</b>";
		}
		echo "<td align=\"{$col->alignment}\">{$val}</td>";
	}

	public function renderGrandTotalCol($col, $val) {
		$this->renderSubTotalCol($col, $val, null);
	}

	public function renderFooter() {
		
	}
}

?>