<?php

namespace NP\shared;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the REASON table
 *
 * @author Thomas Messier
 */
class ReasonGateway extends AbstractGateway {

	/**
	 * Returns reasons for putting an invoice on hold
	 */
	public function getHoldReasons() {
		$select = Select::get()
			->columns(['reason_id','reason_text'])
			->from(['r'=>'reason'])
				->join(
					['ot'=>'objecttype'],
					'ot.objtype_id = r.objtype_id AND ot.objtype_id_alt = 1'
				)
			->whereGreaterThan('r.universal_field_status', '0')
			->order('r.reason_text');

		return $this->adapter->query($select);
	}
}

?>