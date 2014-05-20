<?php

namespace NP\po\sql;

use NP\shared\sql\AbstractEntitySelect;
use NP\core\db\Select;
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
	
	/**
	 * Adds a received status column
	 *
	 * @param \NP\po\PoSelect Returns caller object for easy chaining
	 */
	public function columnReceivedStatus($isReceivingOn=0) {
		if ($isReceivingOn == 1) {
			$col = "
				CASE
					WHEN EXISTS (
						--have any items been received yet on this PO?
						SELECT 1
						FROM POITEM poi
						WHERE poi.purchaseorder_id = p.purchaseorder_id
						AND poi.poitem_isReceived = 1
						AND (poi.reftablekey_id <> 0 OR poi.reftablekey_id IS NULL) --ensures PO item is not canceled
					) THEN CASE
						WHEN EXISTS (
							--get items left to be received
							SELECT 1
							FROM POITEM poi
							WHERE poi.purchaseorder_id = p.purchaseorder_id
							AND (poi.poitem_isReceived IS NULL OR poitem_isReceived <> 1)
							AND (poi.reftablekey_id <> 0 OR poi.reftablekey_id IS NULL) --ensures PO item is not canceled
						) THEN 'Partial' --at least one is received and at least one is left to be received
						ELSE 'All' --at least one received but none left to receive
					END
					ELSE 'None'--none have been received yet
				END
			";
		} else {
			$col = "'None'";
		}

		return $this->column(
			new Expression($col),
			'received_status'
		);
	}
	
}