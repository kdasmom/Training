<?php

namespace NP\report\renderer;

/**
 * Base report class
 *
 * @author Thomas Messier
 */
abstract class AbstractReportRenderer implements ReportRendererInterface {
	
	public function __construct($configService, \NP\report\ReportInterface $report, $data) {
		$this->configService = $configService;
		$this->report        = $report;
		$this->data          = $data;

		$this->init();
	}

	public function render() {
		$this->renderHeader();

		$this->renderBody();

		$this->renderFooter();
	}

	/**
	 * 
	 */
	public function renderBody() {
		$this->renderColumnHeaders();

		$this->renderData();

		if ($this->report->showGrandTotal && count($this->subTotalFields)) {
			$this->renderGrandTotal();
		}
	}

	/**
	 * 
	 */
	public function renderColumnHeaders() {
		$cols = $this->report->getCols();

		$this->renderBeforeRow();

		foreach ($cols as $col) {
			$this->renderColumnHeader($col);
		}

		$this->renderAfterRow();
	}

	/**
	 * 
	 */
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

	/**
	 * 
	 */
	public function renderGroupHeader($field, $row) {
		$cols   = $this->report->getCols();
		$params = $this->report->getParams();

		$this->renderBeforeRow();

		$rowData = [];
		foreach ($cols as $col) {
			$val = '';
			if ($col->field == $field) {
				$val = $row[$col->field];
				
				$renderer = $col->renderer;
				if ($renderer !== null) {
					$val = $renderer($val, $row, $params);
				}
			}

			$rowData[$col->field] = $val;
		}

		$this->renderRow('groupHeader', $cols, $rowData, $row);

		$this->renderAfterRow();
	}

	/**
	 * 
	 */
	public function renderSubTotal($group, $field, $row) {
		$cols           = $this->report->getCols();
		$subTotalFields = $group->subTotalFields;
		$params         = $this->report->getParams();
		
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
				
				$renderer = $col->renderer;
				if ($renderer !== null) {
					$val = $renderer($val, $row, $params);
				}
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
		$params      = $this->report->getParams();
		$idx         = 0;
		$lastRow     = null;

		while( $row = sqlsrv_fetch_array( $this->data, SQLSRV_FETCH_ASSOC) ) {
			$this->renderRecord($row, $idx, $cols, $params);
			$lastRow = $row;
			$idx++;
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
	public function renderRecord($row, $idx, $cols, $params) {
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

			if (is_numeric($firstChange) && $firstChange <= $i) {
				$this->renderGroupHeader($field, $row);
			}

			$this->groupFields[$field]['previousValue'] = $row[$field];
			$this->groupFields[$field]['previousRec']   = $row;
		}

		$this->renderBeforeRow();

		$rowData = [];
		foreach ($cols as $col) {
			$val = $row[$col->field];
			
			$renderer = $col->renderer;
			if ($renderer !== null) {
				$val = $renderer($val, $row, $params);
			}

			if ($val === null) {
				$val = '';
			}

			$rowData[$col->field] = $val;

			if (array_key_exists($col->field, $this->subTotalFields)) {
				$this->subTotalFields[$col->field] += $row[$col->field];
			}
		}

		$this->renderRow('record', $cols, $rowData, $row);

		$this->renderAfterRow();
	}

	/**
	 * 
	 */
	public function renderRow($type, $cols, $rowData, $rawData) {
		foreach ($cols as $col) {
			$this->renderRowCell($type, $col, $rowData[$col->field], $rawData);
		}
	}

	public function renderRowCell($type, $col, $val, $rawData) {
		$fn = 'render' . ucfirst($type) . 'Col';

		$this->$fn($col, $val, $rawData);
	}

	private function processSubTotals($row, $groupMax, $firstChange) {
		if (count($this->subTotalFields)) {
			for ($i=$groupMax; $i>=0; $i--) {
				$group    = $this->groups[$i];
				$field    = $group->field;
				$groupDef = $this->groupFields[$field];

				if (is_numeric($firstChange) && $firstChange <= $i) {
					if (array_key_exists('previousRec', $this->groupFields[$field])) {
						$this->renderSubTotal($group, $field, $this->groupFields[$field]['previousRec']);
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
		$params         = $this->report->getParams();
		
		$this->renderBeforeRow();

		foreach ($cols as $i=>$col) {
			if ($i == 0) {
				$val = 'Grand Total';
			} else {
				$val = '';
			}
			if (array_key_exists($col->field, $subTotalFields)) {
				$val = $subTotalFields[$col->field];
				
				$renderer = $col->renderer;
				if ($renderer !== null) {
					$val = $renderer($val, [], $params);
				}
			}

			$this->renderGrandTotalCol($col, $val);
		}

		$this->renderAfterRow();
	}

	abstract function renderHeader();

	abstract function renderBeforeRow();

	abstract function renderAfterRow();

	abstract function renderColumnHeader($col);

	abstract function renderGroupHeaderCol($col, $val, $rawData);

	abstract function renderRecordCol($col, $val, $rawData);

	abstract function renderSubTotalCol($col, $val, $rawData);

	abstract function renderFooter();
}

?>