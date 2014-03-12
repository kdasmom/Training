<?php

namespace NP\report;

use NP\system\ConfigService;
use NP\security\SecurityService;
use NP\core\GatewayManager;

/**
 * Base class for reports
 *
 * @author Thomas Messier
 */
abstract class AbstractReport implements ReportInterface {
	protected $configService;

	private $options, $cols=[], $groups=[];

	/**
	 * Constructor for reports
	 *
	 * @param NP\system\ConfigService   $configService   Service injected in for accessing configuration options
	 * @param NP\system\SecurityService $securityService Service injected in for accessing security options
	 * @param NP\core\GatewayManager    $gatewayManager  Injected to facilidate data access (mostly for getData() method)
	 */
	public function __construct(
		ConfigService $configService,
		SecurityService $securityService,
		GatewayManager $gatewayManager,
		ReportOptions $options,
		$extraParams=[]
	) {
		$this->configService   = $configService;
		$this->securityService = $securityService;
		$this->gatewayManager  = $gatewayManager;
		$this->options         = $options;

		$this->extraParams = $extraParams;

		$this->init();
	}

	/**
	 * Needs to be defined in concrete report class. Used to define report columns, groups, etc.
	 */
	abstract function init();

	/**
	 * Needs to return a string with the report title
	 *
	 * @return string The report title
	 */
	abstract function getTitle();

	/**
	 * Return the data for the report in the form of a statement resource
	 *
	 * @return resource The SQL statement resource
	 */
	abstract function getData();

	/**
	 * Optional function that can be overriden to add to the data for the current row
	 * (by performing conditional logic checks or running additional queries)
	 *
	 * @param  array $currentRow An associative array containing the data for the current row
	 * @return array             An associative array with data to add to the current row
	 */
	public function getSubData($currentRow) {
		return null;
	}

	/**
	 * Optional function that can be overriden to filter out certain rows based on
	 * an arbitrary condition; the function must return true or false
	 *
	 * @param  array $currentRow
	 * @param  boolean
	 */
	public function isRowVisible($currentRow) {
		return true;
	}

	/**
	 * Returns an array of groups for this report
	 *
	 * @return NP\report\ReportGroup[]
	 */
	public function getGroups() {
		return $this->groups;
	}

	/**
	 * Adds a report group
	 *
	 * @param NP\report\ReportGroup $group
	 */
	public function addGroup(ReportGroup $group) {
		$this->groups[] = $group;
	}

	/**
	 * Adds multiple groups to the report
	 *
	 * @param NP\report\ReportGroup[] $group
	 */
	public function addGroups($groups) {
		foreach ($groups as $group) {
			$this->addGroup($group);
		}
	}

	/**
	 * Returns an array of columns for this report
	 *
	 * @return NP\report\ReportColumn[]
	 */
	public function getCols() {
		return $this->cols;
	}

	/**
	 * Adds a column to this report
	 *
	 * @param $col NP\report\ReportColumn
	 */
	public function addCol(ReportColumn $col) {
		$this->cols[] = $col;
	}

	/**
	 * Adds multiple columns to this report
	 *
	 * @param $cols NP\report\ReportColumn[]
	 */
	public function addCols($cols) {
		foreach ($cols as $col) {
			$this->addCol($col);
		}
	}

	/**
	 * Returns options for this report
	 *
	 * @return NP\report\ReportOptions
	 */
	public function getOptions() {
		return $this->options;
	}

	/**
	 * Returns any extra parameters passed into the report
	 *
	 * @return array
	 */
	public function getExtraParams() {
		return $this->extraParams;
	}
}

?>