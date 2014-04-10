<?php

namespace NP\shared;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the REJECTIONNOTE table
 *
 * @author Thomas Messier
 */
class RejectionNoteGateway extends AbstractGateway {

	/**
	 * Gets all rejection reasons for invoice/PO
	 */
	public function findRejectionReasons() {
		$select = Select::get()
				->from('rejectionnote')
				->whereEquals('rejectionnote_type', "'invoice'")
				->whereGreaterThan('universal_field_status', 0)
				->order('rejectionnote_text');

		return $this->adapter->query($select);
	}

}

?>