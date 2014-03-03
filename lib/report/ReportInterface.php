<?php

namespace NP\report;

/**
 * Report interface
 *
 * @author Thomas Messier
 */
interface ReportInterface {
	
	public function __construct($configService, $params);

	public function init();

	public function getTitle();

	public function getParams();

	public function getQueryParams();

	public function getCols();

	public function getGroups();

	public function getSql();

	public function getOrientation();

	public function addCol(ReportColumn $col);

	public function addGroup(ReportGroup $group);
}

?>