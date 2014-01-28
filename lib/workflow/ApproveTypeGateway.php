<?php

namespace NP\workflow;

use NP\core\AbstractGateway;

/**
 * Gateway for the APPROVETYPE table
 *
 * @author Thomas Messier
 */
class ApproveTypeGateway extends AbstractGateway {

	/**
	 * Returns the approvetype_id that matches an approvetype_name value
	 * @param  string $approvetype_name
	 * @return int
	 */
	public function getIdByName($approvetype_name) {
		return $this->findValue(
				['approvetype_name'=>'?'],
				[$approvetype_name],
				'approvetype_id'
			);
	}
}

?>