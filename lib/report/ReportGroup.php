<?php

namespace NP\report;

/**
 * Report Group class
 *
 * @author Thomas Messier
 */
class ReportGroup {
	
	public $field, $subTotalFields;
	
	public function __construct($field, $subTotalFields=[]) {
		$this->field          = $field;
		$this->subTotalFields = $subTotalFields;
	}
}

?>