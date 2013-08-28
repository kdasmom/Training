<?php

namespace NP\po\sql;

use NP\shared\sql\AbstractEntitySelect;

use NP\core\db\Select;
use NP\core\db\Expression;

/**
 * A custom Select object for Receipt records with some shortcut methods
 *
 * @author Thomas Messier
 */
class ReceiptSelect extends AbstractEntitySelect {
	
	protected $tableName = 'receipt';
	protected $lineTableName = 'rctitem';

	/**
	 * Adds the pending days column
	 *
	 * @param \NP\po\ReceiptSelect Returns caller object for easy chaining
	 */
	public function columnPendingDays() {
		return $this->column(new Expression('DateDiff(day, r.receipt_createdt, getDate())'), 'pending_days');
	}

	/**
	 * Adds the created by column
	 *
	 * @param \NP\po\ReceiptSelect Returns caller object for easy chaining
	 */
	public function columnCreatedBy() {
		return $this->column(
						Select::get()->from(array('u'=>'userprofile'))
									->columns(array('userprofile_username'))
									->whereEquals('u.userprofile_id', "r.userprofile_id"),
						'created_by'
		);
	}

}