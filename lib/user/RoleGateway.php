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
					array('userprofilerole_id'))
				->where("ur.userprofile_id = ?");
		
		// Since users can only have one role, we only need to return one record
		$res = $this->adapter->query($select, array($userprofile_id));
		return array_pop($res);
	}

	public function getNextLevelUp($role_id) {
		$select = new Select();
		$select->columns(array())
				->from(array('t'=>'tree'))
				->join(array('t2'=>'tree'),
						't.tree_parent = t2.tree_id',
						array('role_id'=>'tablekey_id'))
				->whereEquals('t.table_name', "'role'")
				->whereEquals('t.tablekey_id', '?');

		$res = $this->adapter->query($select, array($role_id));
		if (count($res)) {
			return $res[0];
		} else {
			return null;
		}
	}
	
}