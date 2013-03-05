<?php

namespace NP\user;

use NP\core\AbstractGateway;

/**
 * Gateway for the USERPROFILE table
 *
 * @author Thomas Messier
 */
class UserSettingGateway extends AbstractGateway {
	
	/**
	 * @param  int $userprofile_id
	 * @return array
	 */
	public function getForUser($userprofile_id) {
		return $this->find("userprofile_id = ?", array($userprofile_id));
	}
	
}