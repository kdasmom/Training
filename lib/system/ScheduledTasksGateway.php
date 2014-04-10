<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Where;
use NP\core\db\Select;

/**
 * Gateway for the SCHEDULEDTASKS table
 *
 * @author Thomas Messier
 */
class ScheduledTasksGateway extends AbstractGateway {
	protected $pk = 'schedule_id';

	/**
	 * Delete all tasks related to a certain invoice
	 * @param  int $invoice_id
	 */
	public function deleteByInvoice($invoice_id) {
		return $this->delete(
			Where::get()->in(
				'recurring_scheduler_id',
				Select::get()->column('recurring_scheduler_id')
							->from('recurringscheduler')
							->whereEquals('table_name', '?')
							->whereEquals('tablekey_id', '?')
			),
			['invoice', $invoice_id]
		);
	}
}

?>