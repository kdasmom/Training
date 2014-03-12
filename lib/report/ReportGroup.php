<?php

namespace NP\report;

/**
 * Report Group class
 *
 * @author Thomas Messier
 */
class ReportGroup {
	
	public $field, $subTotalFields, $showRow;
	
	public function __construct($field, $subTotalFields=[], $showRow=true) {
		$this->field          = $field;
		$this->subTotalFields = $subTotalFields;
		$this->showRow        = $showRow;
	}
}

?>