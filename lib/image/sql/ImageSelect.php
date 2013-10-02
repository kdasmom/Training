<?php

namespace NP\image\sql;

use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * A custom Select object for Image records
 *
 * @author Thomas Messier
 */
class ImageSelect extends Select {
	
	public function __construct() {
		parent::__construct();
		
		$this->from(array('img'=>'image_index'));
	}

	/**
	 * Adds the days outstanding
	 *
	 * @param \NP\image\ImageSelect Returns caller object for easy chaining
	 */
	public function columnDaysOustanding() {
		return $this->column(new Expression('DateDiff(d, img.Image_Index_Date_Entered, getDate())'), 'days_outstanding');
	}

	/**
	 * Adds the days pending column
	 *
	 * @param \NP\image\ImageSelect Returns caller object for easy chaining
	 */
	public function columnPendingDays() {
		return $this->column(new Expression('DateDiff(day, i.invoice_createddatetm, getDate())'), 'pending_days');
	}
	
}