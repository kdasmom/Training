<?php

namespace NP\report\renderer;

use NP\report\ReportInterface;
use NP\core\GatewayManager;
use NP\system\ConfigService;
use NP\security\SecurityService;

/**
 * HTML renderer for reports
 *
 * @author Thomas Messier
 */
class HtmlReportRenderer extends AbstractReportRenderer implements ReportRendererInterface {
	
	protected $hasPercentCol = false, $subTotalGroupNum;

	public function __construct(
		ConfigService $configService,
		SecurityService $securityService,
		GatewayManager $gatewayManager,
		ReportInterface $report,
		$data
	) {
		parent::__construct($configService, $securityService, $gatewayManager, $report, $data);
		
		$this->adjustColWidth();
	}

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
		echo '<!DOCTYPE HTML>' .
			'<html>' .
				'<head>' .
					'<title>NexusPayables</title>' .
					'<link rel="stylesheet" href="' . $this->configService->getLoginUrl() . '/resources/report.css" />' .
				'</head>' .
				'<body>';

		parent::render();

		echo '</body></html>';
	}

	public function renderHeader() {
		echo '<div id="header">';

		parent::renderHeader();

		echo '</div>';
	}

	public function renderLogo() {
		$reportLogo = $this->configService->get('reports.IMAGES.ReportHeader', '');
		if (!empty($reportLogo)) {
	        echo '<img src="' . $this->configService->getLoginUrl() . '/clients/' . $this->configService->getAppName() . '/web/images/' . $reportLogo . '" />';
	    }
	}

	public function renderTitle() {
		echo '<div id="title">' . $this->report->getTitle() . '</div>';
	}

	public function renderHeaderFilters() {
		if ($this->headerFiltersExist()) {
	    	echo '<table id="headerOptions" align="center">';

		    parent::renderHeaderFilters();

		    echo '</table>';
		}
	}

	protected function renderHeaderOption($label, $val) {
		echo '<tr>' .
					'<th>' . $label . ':</th>' .
					'<td>' . $val . '</td>' .
				'</tr>';
	}

	public function renderDateRange() {
		$dateRange = $this->getDateRange();

		$this->renderHeaderOption($this->report->getOptions()->dateFilterName, $dateRange);
	}

	public function renderProperties() {
		$this->renderHeaderOption(
			$this->getPropertyLabel(),
			$this->getPropertyList()
		);
	}

	public function renderExtraHeaderFilters() {
		foreach ($this->report->getExtraHeaderFilters() as $label=>$val) {
			$this->renderHeaderOption($label, $val);
		}
	}

	public function renderBeforeRow() {
		echo '<tr>';
	}

	public function renderAfterRow() {
		echo '</tr>';
	}

	public function renderBody() {
		echo "<table id=\"dataRows\">";
		
		parent::renderBody();

		echo '</table>';
	}

	public function renderColumnHeaders() {
		echo '<thead>';
		
		parent::renderColumnHeaders();

		echo '</thead>';
	}

	public function renderColumnHeader($col, $colIdx) {
		echo "<th width=\"{$col->width}\" align=\"{$col->alignment}\">{$col->name}</th>";
	}

	public function renderGroupHeaderCol($col, $colIdx, $val, $rawData) {
		$class = '';
		if (!empty($val)) {
			$class = ' class="groupHeaderCol"';
		}

		echo "<td{$class} align=\"{$col->alignment}\">{$val}</td>";
	}

	public function renderData() {
		echo '<tbody>';

		parent::renderData();

		echo '</tbody>';
	}

	public function renderRecordCol($col, $colIdx, $val, $row) {
		echo "<td align=\"{$col->alignment}\">{$val}</td>";
	}

	public function renderSubTotal($group, $groupNum, $field, $row) {
		$this->subTotalGroupNum = $groupNum;

		parent::renderSubTotal($group, $groupNum, $field, $row);
	}

	public function renderSubTotalCol($col, $colIdx, $val, $rawData) {
		$class = '';
		$style = '';
		if ($colIdx == 0) {
			$class = ' class="subTotalLabel"';
			$padding = ($this->subTotalGroupNum + 1) * 12;
			$style = ' style="padding-left: ' . $padding . 'px"';
		} else if (!empty($val)) {
			$class = ' class="subTotalCol"';
		}

		echo "<td{$class}{$style} align=\"{$col->alignment}\">{$val}</td>";
	}

	public function renderGrandTotalCol($col, $colIdx, $val) {
		$this->renderSubTotalCol($col, null, $val, null);
	}

	public function renderNoRecords() {
		echo '<tr><td colspan="' . count($this->report->getCols()) . '" id="noRecordMsg">No records found</td></tr>';
	}
}

?>