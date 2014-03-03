<?php

namespace NP\report;

/**
 * Base class for reports
 *
 * @author Thomas Messier
 */
abstract class AbstractReport implements ReportInterface {
	
	// You can override these values in your concrete report
	public $title, $orientation='L', $sql, $showGrandTotal=true, $showBulkPdf=false;

	protected $configService, $params, $cols=[], $groups=[], $queryParams=[];

	public function __construct($configService, $gatewayManager, $params=[]) {
		$this->configService  = $configService;
		$this->gatewayManager = $gatewayManager;
		$this->params         = $params;

		$this->init();
	}

	abstract function init();

	public function getTitle() {
		return $this->title;
	}

	public function getOrientation() {
		return $this->orientation;
	}

	public function getParams() {
		return $this->params;
	}

	public function getSql() {
		return $this->sql;
	}

	public function getGroups() {
		return $this->groups;
	}

	public function getCols() {
		return $this->cols;
	}

	public function getQueryParams() {
		return $this->queryParams;
	}

	public function currencyRenderer($val, $row, $params) {
		return '$' . number_format($val, 2);
	}

	public function dateRenderer($val, $row, $params) {
		if (!empty($val)) {
			return $this->parseDate($val)->format('m/d/Y');
		}

		return '';
	}

	public function dateTimeRenderer($val, $row, $params) {
		return $this->parseDate($val)->format('m/d/Y h:ia');
	}

	public function periodRenderer($val, $row, $params) {
		if (!empty($val)) {
			return $this->parseDate($val)->format('m/Y');
		}

		return '';
	}

	public function addCol(ReportColumn $col) {
		$this->cols[] = $col;
	}

	public function addCols($cols) {
		foreach ($cols as $col) {
			$this->addCol($col);
		}
	}

	public function addGroup(ReportGroup $group) {
		$this->groups[] = $group;
	}

	public function addGroups($groups) {
		foreach ($groups as $group) {
			$this->addGroup($group);
		}
	}

	protected function parseDate($val) {
		return \DateTime::createFromFormat('Y-m-d H:i:s.u', $val);
	}
}

?>