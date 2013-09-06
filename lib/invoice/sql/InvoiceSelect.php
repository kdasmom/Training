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
	 * Adds all "normal" columns
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function allColumns() {
		return $this->columns(array(
			'invoice_id',
			'invoice_datetm',
			'invoice_createddatetm',
			'invoice_status',
			'paytable_name',
			'paytablekey_id',
			'property_id',
			'invoice_ref',
			'invoice_note',
			'invoice_duedate',
			'invoice_submitteddate',
			'invoicetype_id',
			'invoice_startdate',
			'invoice_endate',
			'invoice_paymentmethod',
			'invoicepayment_type_id',
			'invoice_period',
			'control_amount',
			'invoice_multiproperty',
			'invoice_taxallflag',
			'invoice_budgetoverage_note',
			'invoice_cycle_from',
			'invoice_cycle_to',
			'lock_id',
			'reftablekey_id',
			'reftable_name',
			'remit_advice',
			'vendoraccess_notes',
			'PriorityFlag_ID_Alt',
			'invoice_NeededBy_datetm',
			'payablesconnect_flag',
			'template_name',
			'universal_field1',
			'universal_field2',
			'universal_field3',
			'universal_field4',
			'universal_field5',
			'universal_field6',
			'universal_field7',
			'universal_field8'
		));
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