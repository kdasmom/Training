<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Update;

/**
 * Gateway for the CLIENT table
 *
 * @author Thomas Messier
 */
class ClientGateway extends AbstractGateway {
	public function updateHeader($header_text, $asp_client_id) {
		$update = new Update();

		$update->table('client')
			->values(
				['poprint_header' => !$header_text ? null : "'" . $header_text . "'"]
			)
			->where(
				[
					'asp_client_id' => '?'
				]
			);

		return $this->adapter->query($update, [$asp_client_id]);
	}
}

?>