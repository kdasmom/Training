<?php

namespace NP\user;

use NP\core\AbstractGateway;

use NP\core\db\Select;

/**
 * Gateway for the USERPROFILE table
 *
 * @author Thomas Messier
 */
class RoleGateway extends AbstractGateway {
	
	/**
	 * @param  int $userprofile_id The user ID for which you want to figure out the role
	 * @return array               A role record
	 */
	public function getUserRole($userprofile_id) {
		$select = new Select();
		$select->from(array('ur'=>'userprofilerole'))
				->column('userprofilerole_id')
				->join(array('r'=>'role'),
					'ur.role_id = r.role_id')
				->where("ur.userprofile_id = ?");
		
		return $this->adapter->query($select, array($userprofile_id));
	}
	
}