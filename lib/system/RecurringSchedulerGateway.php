<?php

namespace NP\system;

use NP\core\AbstractGateway;

/**
 * Gateway for the RECURRINGSCHEDULER table
 *
 * @author Thomas Messier
 */
class RecurringSchedulerGateway extends AbstractGateway {
	protected $pk = 'recurring_scheduler_id';
}

?>