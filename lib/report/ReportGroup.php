<?php

namespace NP\report;

/**
 * Report Group class
 *
 * @author Thomas Messier
 */
class ReportGroup {
	
	/**
	 * This is the name of the data field (the database column) that you want to group by
	 * @var string
	 */
	public $field;

	/**
	 * This is an array of field names we want to include a subtotal for within this group
	 * @var array
	 */
	public $subTotalFields;
	
	/**
	 * This indicates if we want to show a header for the group field or not
	 * @var boolean
	 */
	public $showRow;
	
	public function __construct($field, $subTotalFields=[], $showRow=true) {
		$this->field          = $field;
		$this->subTotalFields = $subTotalFields;
		$this->showRow        = $showRow;
	}
}

?>