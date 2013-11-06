<?php

namespace NP\core;

/**
 * This class encapsulates access to gateways
 * 
 * @author Thomas Messier
 */
class GatewayManager {
	protected $di;

	public function setPimple($di) {
		$this->di = $di;
	}

	/**
	 * Returns the gateway requested
	 *
	 * @param  string $name The name of a gateway
	 * @return NP\core\AbstractGateway
	 */
	public function get($name) {
		if (substr($name, -7) != 'Gateway') {
			throw new \NP\core\Exception("{$name} is not a valid gateway");
		}

		return $this->di[$name];
	}
}

?>