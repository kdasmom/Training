<?php

namespace NP\shared;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the REJECTIONHISTORY table
 *
 * @author Thomas Messier
 */
class RejectionHistoryGateway extends AbstractGateway {
	
	/**
	 * Get rejection notes for an invoice or PO
	 */
	public function findRejectionNotes($table_name, $tablekey_id) {
		return $this->adapter->query(
			Select::get()
				->columns([])
				->from(['rh'=>'rejectionhistory'])
					->join(
						['rn'=>'rejectionnote'],
						'rh.rejectionnote_id = rn.rejectionnote_id',
						['rejectionnote_text']
					)
				->whereEquals('rh.table_name', '?')
				->whereEquals('rh.tablekey_id', '?'),
			[$table_name, $tablekey_id]
		);
	}

}

?>