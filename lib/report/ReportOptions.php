<?php

namespace NP\report;

/**
 * Class to encapsulate all options for the report
 *
 * @author Thomas Messier
 */
class ReportOptions {

	/**
	 * Whether or not to show a grand total at the bottom of the report (only applies if you have
	 * subtotal fields defined); defaults to true
	 * @var boolean
	 */
	protected $showGrandTotal;
	
	/**
	 * Whether or not to show the bulk PDF option for this report; defaults to false
	 * @var boolean
	 */
	protected $showBulkPdf;

	/**
	 * Whether this report should be generated in portrait or landscape (only applies to PDF format).
	 * Valid values are "portrait" and "landscape"; defaults to "landscape"
	 * @var string
	 */
	protected $orientation; 

	/**
	 * The property context for the report; optional, defaults to null
	 * @var NP\property\PropertyContext
	 */
	protected $propertyContext; 
	
	/**
	 * If dateFrom/dateTo are specified, what name to show for the date filter at the top of
	 * the report
	 * @var string
	 */
	protected $dateFilterName; 
	
	/**
	 * The type of date at the top of the report; valid values are "period" and "date"; defaults to "date"
	 * @var string
	 */
	protected $dateType;

	/**
	 * Date to start filtering the report by
	 * @var DateTime
	 */
	protected $dateFrom; 

	/**
	 * Date to end filtering the report by
	 * @var DateTime
	 */
	protected $dateTo;

	/**
	 * Ann associative array with additional filters to display in the report header
	 * @var array
	 */
	protected $extraHeaderFilters;

	protected $defaultOptions = [
		'showGrandTotal'     => true,
		'showBulkPdf'        => false,
		'orientation'        => 'landscape',
		'propertyContext'    => null,
		'dateFilterName'     => 'Date Range',
		'dateType'           => 'date',
		'dateFrom'           => null,
		'dateTo'             => null,
		'extraHeaderFilters' => []
	];

	public function __construct($options) {
		foreach ($this->defaultOptions as $option=>$val) {
			if (array_key_exists($option, $options)) {
				$fn = 'set' . ucfirst($option);
				$this->$fn($options[$option]);
			} else {
				$this->$option = $val;
			}
		}
	}

	public function setShowGrandTotal($val) {
		if (is_bool($val)) {
			throw new \NP\core\Exception("First argument for 'setShowGrandTotal()' function must be a boolean");
		}
		$this->showGrandTotal = $val;
	}

	public function setShowBulkPdf($val) {
		if (is_bool($val)) {
			throw new \NP\core\Exception("First argument for 'setShowBulkPdf()' function must be a boolean");
		}
		$this->showBulkPdf = $val;
	}

	public function setOrientation($val) {
		if (!is_string($val) || !in_array($val, ['portrait','landscape'])) {
			throw new \NP\core\Exception("First argument for 'setOrientation()' function must be either 'portrait' or 'landscape'");
		}
		$this->orientation = $val;
	}

	public function setPropertyContext(\NP\property\PropertyContext $val) {
		$this->propertyContext = $val;
	}

	public function setDateFilterName($val) {
		if (!is_string($val)) {
			throw new \NP\core\Exception("First argument for 'setDateFilterName()' function must be a string");
		}
		$this->dateFilterName = $val;
	}

	public function setDateType($val) {
		if (!is_string($val) || !in_array($val, ['date','period'])) {
			throw new \NP\core\Exception("First argument for 'setDateType()' function must be either 'date' or 'period'");
		}
		$this->dateType = $val;
	}

	public function setDateFrom(\DateTime $val) {
		$this->dateFrom = $val;
	}

	public function setDateTo(\DateTime $val) {
		$this->dateTo = $val;
	}

	public function setExtraHeaderFilters($val) {
		if (!is_array($val)) {
			throw new \NP\core\Exception("First argument for 'setExtraHeaderFilters()' function must be an array");
		}
		$this->extraHeaderFilters = $val;
	}

	public function __set($field, $val) {
		$this->checkFieldValidity($field);

		$fn = 'set' . ucfirst($field);
		$this->$fn($val);
	}

	public function __get($field) {
		$this->checkFieldValidity($field);

		return $this->$field;
	}

	protected function checkFieldValidity($field) {
		if (!array_key_exists($field, $this->defaultOptions)) {
			throw new \NP\core\Exception("Invalid option '{$field}'; valid options are " . implode(',', array_keys($this->defaultOptions)));
		}
	}
}

?>