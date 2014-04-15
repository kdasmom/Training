<?php

namespace NP\report\renderer;

use NP\core\GatewayManager;
use NP\system\ConfigService;
use NP\security\SecurityService;
use NP\report\ReportInterface;

/**
 * Base report renderer class. This class provides a number of functions for rendering a report
 * which can be overriden in concrete classes, as well as some abstract classes that must
 * be defined.
 *
 * @author Thomas Messier
 */
abstract class AbstractReportRenderer implements ReportRendererInterface {
	
	public function __construct(
		ConfigService $configService,
		SecurityService $securityService,
		GatewayManager $gatewayManager,
		ReportInterface $report,
		$data
	) {
		$this->configService   = $configService;
		$this->securityService = $securityService;
		$this->gatewayManager  = $gatewayManager;
		$this->report          = $report;
		$this->data            = $data;

		$this->init();
	}

	protected function init() {
		$this->groups   = $this->report->getGroups();
		$this->groupNum = count($this->groups);

		$this->groupFields = [];
		$this->subTotalFields = [];
		foreach ($this->groups as $i=>$group) {
			$this->groupFields[$group->field] = [
				'previousValue' => null
			];
			foreach ($group->subTotalFields as $subTotalField) {
				$this->groupFields[$group->field][$subTotalField] = 0;
				if (!array_key_exists($subTotalField, $this->subTotalFields)) {
					$this->subTotalFields[$subTotalField] = 0;
				}
			}
		}
	}

	public function render() {
		$this->renderHeader();

		$this->renderBody();

		$this->renderFooter();
	}

	public function renderHeader() {
		$this->renderLogo();
		$this->renderTitle();
		$this->renderHeaderFilters();
	}

	public function renderHeaderFilters() {
		if ($this->headerFiltersExist()) {
			$dateRange = $this->getDateRange();

	    	if (!empty($dateRange)) {
				$this->renderDateRange();
			}

			if ($this->report->getOptions()->propertyContext !== null) {
				$this->renderProperties();
			}

			if (count($this->report->getOptions()->extraHeaderFilters)) {
				$this->renderExtraHeaderFilters();
			}
		}
	}

	public function headerFiltersExist() {
		$dateRange = $this->getDateRange();
		return (
	    	!empty($dateRange)
	    	|| $this->report->getOptions()->propertyContext !== null
	    	|| count($this->report->getOptions()->extraHeaderFilters)
	    );
	}

	public function getDateRange() {
		$dateFrom = $this->report->getOptions()->dateFrom;
		$dateTo   = $this->report->getOptions()->dateTo;

		if ($dateFrom !== null && $dateTo !== null) {
			$dateType = $this->report->getOptions()->dateType;
			
			if (!in_array($dateType, ['date','period'])) {
				throw new \NP\core\Exception("Invalid value '{$dateType}' for 'dateType' option on report");
			}

			if ($dateType == 'date') {
				$format = $this->configService->get('PN.Intl.dateFormat');
			} else if ($dateType == 'period') {
				$format = 'm/Y';
			}

			return $dateFrom->format($format) . ' - ' . $dateTo->format($format);
		}

		return '';
	}

	public function getPropertyLabel() {
		$propertyContext = $this->report->getOptions()->propertyContext;
		if ($propertyContext !== null) {
			$type = $propertyContext->getType();
			if ($type == 'all' || $type == 'property') {
				return $this->configService->get('PN.main.PropertiesLabel', 'Properties');
			} else {
				return $this->configService->get('PN.main.RegionLabel', 'Region');
			}
		}

		return '';
	}

	public function getPropertyList() {
		$propertyContext = $this->report->getOptions()->propertyContext;
		if ($propertyContext !== null) {
			if ($propertyContext->getType() == 'all') {
				$list = '';
				$property_status_list = $propertyContext->getPropertyStatus();
				if ($property_status_list !== null) {
					$list = [];
					$statuses = [
						0  => 'Inactive',
						1  => 'Active',
						-1 => 'On Hold'
					];
					foreach ($property_status_list as $property_status) {
						$list[] = $statuses[$property_status];
					}
					$list = ' (' . implode(',', $list) . ')';
				}
				return 'All' . $list;
			} else if ($propertyContext->getType() == 'region') {
				$regions = $propertyContext->getSelection();
				$list = $this->gatewayManager->get('RegionGateway')->find(
					[['in', 'region_id', implode(',', $regions)]],
					[],
					null,
					['region_name']
				);
				$list = \NP\util\Util::valueList($list, 'region_name');
			} else {
				$list = $this->gatewayManager->get('PropertyGateway')->findByContext($propertyContext);
				$list = \NP\util\Util::valueList($list, 'property_name');
			}

			return implode(', ', $list);
		}

		return '';
	}

	public function renderBody() {
		$this->renderColumnHeaders();

		if (sqlsrv_has_rows($this->data)) {
			$this->renderData();

			if ($this->report->getOptions()->showGrandTotal && count($this->subTotalFields)) {
				$this->renderGrandTotal();
			}
		} else {
			$this->renderNoRecords();
		}
	}

	public function renderColumnHeaders() {
		$cols = $this->report->getCols();

		$this->renderBeforeRow();

		$colIdx = 0;
		foreach ($cols as $col) {
			$this->renderColumnHeader($col, $colIdx);
			$colIdx++;
		}

		$this->renderAfterRow();
	}

	/**
	 * 
	 */
	public function renderGroupHeader($field, $row, $groupNum) {
		$cols   = $this->report->getCols();
		
		$this->renderBeforeRow();

		$rowData = [];
		foreach ($cols as $col) {
			$val = '';
			if ($col->field == $field) {
				$val = $row[$col->field];
				
				$val = $this->applyColRenderer($val, $row, $col);
			}

			$rowData[$col->field] = $val;
		}

		$this->renderRow('groupHeader', $cols, $rowData, $row);

		$this->renderAfterRow();
	}

	/**
	 * 
	 */
	public function renderSubTotal($group, $groupNum, $field, $row) {
		$cols           = $this->report->getCols();
		$subTotalFields = $group->subTotalFields;
		
		$this->renderBeforeRow();

		$rowData = [];
		foreach ($cols as $i=>$col) {
			if ($i == 0) {
				$val = "{$row[$group->field]} sub-total";
			} else {
				$val = '';
			}
			if (in_array($col->field, $subTotalFields)) {
				$val = $this->groupFields[$field][$col->field];
				$this->groupFields[$field][$col->field] = 0;
				
				$val = $this->applyColRenderer($val, $row, $col);
			}

			$rowData[$col->field] = $val;
		}

		$this->renderRow('subTotal', $cols, $rowData, $row);

		$this->renderAfterRow();
	}

	/**
	 * 
	 */
	public function renderData() {
		$cols        = $this->report->getCols();
		$idx         = 0;
		$lastRow     = null;

		while( $row = sqlsrv_fetch_array( $this->data, SQLSRV_FETCH_ASSOC) ) {
			$data = $this->report->getSubData($row);
			if ($data !== null) {
				$row = array_merge($row, $data);
			}
			$showRow = $this->report->isRowVisible($row);

			if ($showRow) {
				$this->renderRecord($row, $idx, $cols);
				$lastRow = $row;
				$idx++;
			}
		}

		// Process subtotals for the last row in groups if applicable
		if ($lastRow != null) {
			$groupMax = $this->groupNum-1;
			$this->processSubTotals($lastRow, $groupMax, 0);
		}
	}

	/**
	 * 
	 */
	public function renderRecord($row, $idx, $cols) {
		$groupMax = $this->groupNum-1;

		$firstChange = null;
		for ($i=0; $i<=$groupMax; $i++) {
			$group    = $this->groups[$i];
			$field    = $group->field;
			$groupDef = $this->groupFields[$field];
			if ($row[$field] != $groupDef['previousValue']) {
				$firstChange = $i;
				break;
			}
		}

		$this->processSubTotals($row, $groupMax, $firstChange);

		for ($i=0; $i<=$groupMax; $i++) {
			$group    = $this->groups[$i];
			$field    = $group->field;
			$groupDef = $this->groupFields[$field];

			if ($group->showRow && is_numeric($firstChange) && $firstChange <= $i) {
				$this->renderGroupHeader($field, $row, $i);
			}

			$this->groupFields[$field]['previousValue'] = $row[$field];
			$this->groupFields[$field]['previousRec']   = $row;
		}

		$this->renderBeforeRow();

		$rowData = [];
		foreach ($cols as $col) {
			$val = $row[$col->field];
			
			$val = $this->getRecordRenderValue($col, $val, $row);

			$rowData[$col->field] = $val;

			if (array_key_exists($col->field, $this->subTotalFields)) {
				$this->subTotalFields[$col->field] += $row[$col->field];
			}
		}

		$this->renderRow('record', $cols, $rowData, $row);

		$this->renderAfterRow();
	}

	public function getRecordRenderValue($col, $val, $row) {
		$val = $this->applyColRenderer($val, $row, $col);

		$linker = $col->linker;
		if ($linker !== null) {
			$val = '<a href="' . $linker($val, $row, $this->report) . '" />' . $val . '</a>';
		}

		if ($val === null) {
			$val = '';
		}

		return $val;
	}

	/**
	 * 
	 */
	public function renderRow($type, $cols, $rowData, $rawData) {
		$colIdx = 0;
		foreach ($cols as $col) {
			$this->renderRowCell($type, $col, $colIdx, $rowData[$col->field], $rawData);
			$colIdx++;
		}
	}

	public function renderRowCell($type, $col, $colIdx, $val, $rawData) {
		$fn = 'render' . ucfirst($type) . 'Col';

		$this->$fn($col, $colIdx, $val, $rawData);
	}

	private function processSubTotals($row, $groupMax, $firstChange) {
		if (count($this->subTotalFields)) {
			for ($i=$groupMax; $i>=0; $i--) {
				$group    = $this->groups[$i];
				$field    = $group->field;
				$groupDef = $this->groupFields[$field];

				if (is_numeric($firstChange) && $firstChange <= $i) {
					if (array_key_exists('previousRec', $this->groupFields[$field])) {
						$this->renderSubTotal($group, $i, $field, $this->groupFields[$field]['previousRec']);
					}
				}

				foreach ($group->subTotalFields as $subTotalField) {
					$this->groupFields[$field][$subTotalField] += $row[$subTotalField];
				}
			}
		}
	}

	/**
	 * 
	 */
	public function renderGrandTotal() {
		$cols           = $this->report->getCols();
		$subTotalFields = $this->subTotalFields;
		
		$this->renderBeforeRow();

		$colIdx = 0;
		foreach ($cols as $i=>$col) {
			if ($i == 0) {
				$val = 'Grand Total';
			} else {
				$val = '';
			}
			if (array_key_exists($col->field, $subTotalFields)) {
				$val = $subTotalFields[$col->field];
				
				$val = $this->applyColRenderer($val, [], $col);
			}

			$this->renderGrandTotalCol($col, $colIdx, $val);

			$colIdx++;
		}

		$this->renderAfterRow();
	}

	protected function applyColRenderer($val, $row, $col) {
		$renderer = $col->renderer;
		if ($renderer !== null) {
			return $renderer($val, $row, $this->report);
		} else {
			if ($col->dataType !== 'string') {
				$fn = "{$col->dataType}Renderer";
				return $this->$fn($val);
			} else {
				return $val;
			}
		}
	}

	public function currencyRenderer($val) {
		return $this->configService->get('PN.Intl.currencySymbol', '$') . number_format($val, 2);
	}

	public function dateRenderer($val) {
		if (!empty($val)) {
			return $this->parseDate($val)->format('m/d/Y');
		}

		return '';
	}

	public function dateTimeRenderer($val) {
		return $this->parseDate($val)->format('m/d/Y h:ia');
	}

	public function periodRenderer($val) {
		if (!empty($val)) {
			return $this->parseDate($val)->format('m/Y');
		}

		return '';
	}

	protected function parseDate($val) {
		return \DateTime::createFromFormat('Y-m-d H:i:s.u', $val);
	}

	public function renderBeforeRow() {}

	public function renderAfterRow() {}

	public function renderFooter() {}

	abstract function renderLogo();

	abstract function renderTitle();

	abstract function renderDateRange();

	abstract function renderProperties();

	abstract function renderExtraHeaderFilters();

	abstract function renderColumnHeader($col, $colIdx);

	abstract function renderGroupHeaderCol($col, $colIdx, $val, $rawData);

	abstract function renderRecordCol($col, $colIdx, $val, $rawData);

	abstract function renderSubTotalCol($col, $colIdx, $val, $rawData);

	abstract function renderGrandTotalCol($col, $colIdx, $val);

	abstract function renderNoRecords();
}

?>