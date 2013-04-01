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
	public function findByUser($userprofile_id, $cols=null) {
		$select = new Select();
		$select->from(array('r'=>'role'))
				->columns($cols)
				->join(array('ur'=>'userprofilerole'),
					'r.role_id = ur.role_id',
					array())
				->where("ur.userprofile_id = ?");
		
		// Since users can only have one role, we only need to return one record
		return array_pop($this->adapter->query($select, array($userprofile_id)));
	}
	
}