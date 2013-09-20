<?php

namespace NP\invoice\sql;

use NP\shared\sql\AbstractEntitySelect;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * A custom Select object for Invoice records with some shortcut methods
 *
 * @author Thomas Messier
 */
class InvoiceSelect extends AbstractEntitySelect {
	
	protected $tableName     = 'invoice';
	protected $lineTableName = 'invoiceitem';

	/**
	 * Adds the invoice amount subquery as a column
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnSubjectName($alias='subject_name') {
		return $this->column(new Expression('
			CASE 
				WHEN vone.vendoronetime_name IS NOT NULL THEN vone.vendoronetime_Name 
				ELSE v.vendor_name
			END
		'), $alias);
	}
	
	/**
	 * Adds the pending days column
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnPendingDays() {
		return $this->column(new Expression('DateDiff(day, i.invoice_createddatetm, getDate())'), 'invoice_pending_days');
	}
	
}

?>