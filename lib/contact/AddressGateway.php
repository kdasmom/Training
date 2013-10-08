<?php

namespace NP\contact;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the ADDRESS table
 *
 * @author Thomas Messier
 */
class AddressGateway extends AbstractGateway {

	/**
	 * Retrieve states list
	 *
	 * @return array|bool
	 */
	public function getStates() {
		$select = new Select();

		$select->from(['s' => 'state'])
			->order('s.state_name');

		return $this->adapter->query($select);
	}
}

?>