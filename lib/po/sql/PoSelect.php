<?php

namespace NP\po\sql;

use NP\shared\sql\AbstractEntitySelect;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * A custom Select object for PO records with some shortcut methods
 *
 * @author Thomas Messier
 */
class PoSelect extends AbstractEntitySelect {
	
	protected $tableName     = 'purchaseorder';
	protected $lineTableName = 'poitem';

	/**
	 * Adds all "normal" columns
	 *
	 * @param \NP\po\PoSelect Returns caller object for easy chaining
	 */
	public function allColumns() {
		return $this->columns(array(
								'purchaseorder_id',
								'property_id',
								'vendorsite_id',
								'purchaseorder_ref',
								'purchaseorder_period',
								'purchaseorder_created',
								'purchaseorder_datetm',
								'purchaseorder_NeededBy_datetm',
								'purchaseorder_status',
								'purchaseorder_rct_req',
								'PriorityFlag_ID_Alt',
								'purchaseorder_note',
								'purchaseorder_budgetoverage_note',
								'purchaseorder_taxallflag',
								'Purchaseorder_billaddress',
								'Purchaseorder_shipaddress',
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
	 * @param \NP\po\PoSelect Returns caller object for easy chaining
	 */
	public function columnPendingDays() {
		return $this->column(new Expression('DateDiff(day, p.purchaseorder_created, getDate())'), 'pending_days');
	}
	
	/**
	 * Adds Sent To Vendor as a column
	 *
	 * @param \NP\po\PoSelect Returns caller object for easy chaining
	 */
	public function columnSentToVendor() {
		return $this->column(
						new Expression("
							CASE
								WHEN EXISTS (SELECT * FROM invoicepoforward a WHERE a.table_name = 'povendor' AND a.tablekey_id = p.purchaseorder_id) THEN 'Yes'
								ELSE 'No'
							END
						"),
						'sent_to_vendor'
		);
	}
	
	/**
	 * Adds Sent To Vendor Date as a column
	 *
	 * @param \NP\po\PoSelect Returns caller object for easy chaining
	 */
	public function columnSentToVendorDate() {
		return $this->column(
						Select::get()->from(array('__ipf'=>'INVOICEPOFORWARD'))
									->column('forward_datetm')
									->whereEquals('__ipf.tablekey_id', 'p.purchaseorder_id')
									->whereEquals('__ipf.table_name', "'povendor'")
									->limit(1)
									->order('__ipf.forward_datetm DESC'),
						'sent_to_vendor_datetm'
		);
	}
	
}