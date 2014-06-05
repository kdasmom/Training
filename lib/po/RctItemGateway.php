<?php

namespace NP\po;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the RCTITEM table
 *
 * @author Thomas Messier
 */
class RctItemGateway extends AbstractGateway {
	
	/**
	 * Finds all lines for a PO that are not cancelled/deleted
	 */
	public function findUncancelledLines($receipt_id) {
		return $this->adapter->query(
			Select::get()
				->from('rctitem')
				->whereEquals('receipt_id', '?')
				->whereNotIn("'cancelled','deleted'"),
			[$receipt_id]
		);
	}
}

?>