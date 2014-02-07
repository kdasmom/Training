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
	protected $tableAlias = 'r';

	/**
	 * Override getSelect() to add some default values
	 */
	public function getSelect() {
		$select = parent::getSelect();
		$select->join(array('t'=>'tree'),
						"r.role_id = t.tablekey_id AND t.table_name = 'role'",
						array(),
						Select::JOIN_LEFT)
				->join(array('t2'=>'tree'),
						't.tree_parent = t2.tree_id',
						array('parent_role_id'=>'tablekey_id'),
						Select::JOIN_LEFT);

		return $select;
	}

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

	public function findForTree() {
		$select = new Select();
		$select->columns(array('role_id','role_name'))
				->from(array('r'=>'role'))
				->join(array('t'=>'tree'),
						"t.tablekey_id = r.role_id AND t.table_name = 'role'",
						array('tree_id','tree_parent'))
				->order('r.role_name');

		return $this->adapter->query($select);
	}

	/**
	 * Get a list of roles, optionally filtered by module
	 *
	 * @param  int    $module_id ID of module to filter by (defaults to null, which means no filtering)
	 * @param  int    $pageSize  The number of records per page; if null, all records are returned (defaults to null)
	 * @param  int    $page      The page for which to return records (defaults to 1)
	 * @param  string $sort      Field(s) by which to sort the result (defaults to role_name)
	 * @return array
	 */
	public function findRolesByModule($module_id=null, $pageSize=null, $page=1, $sort='role_name') {
		$select = new Select();
		$subSelect = new Select();
		$subSelectCol = new Select();

		$select->columns(array(
					'role_id',
					'role_name',
					'role_updated_by',
					'role_updated_datetm',
					'role_user_count'=>$subSelectCol->count()
														->from(array('ur'=>'userprofilerole'))
														->whereEquals('r.role_id', 'ur.role_id')
				))
				->from(array('r'=>'role'))
				->join(array('u'=>'userprofile'),
						'r.role_updated_by = u.userprofile_id',
						array('userprofile_id','userprofile_username'),
						Select::JOIN_LEFT)
				->join(array('rt' => 'tree'), "rt.table_name = 'role' and rt.tablekey_id = r.role_id", [])
				->join(array('rt2' => 'tree'), 'rt2.tree_id = rt.tree_parent', [])
				->join(array('r2' => 'role'), 'r2.role_id = rt2.tablekey_id', ['parent_role_name' => 'role_name'])
				->order($sort);

		$params = array();
		if ($module_id !== null && $module_id != 0) {
			$select->whereExists(
				$subSelect->from(array('mp'=>'modulepriv'))
							->whereEquals('r.role_id', 'mp.tablekey_id')
							->whereEquals('mp.module_id', '?')
			);
			$params[] = $module_id;
		}

		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	/**
	 * Checks if a role name is unique
	 *
	 * @param  string $role_name 
	 * @param  int    $role_id       
	 * @return boolean
	 */
	public function isRoleNameUnique($role_name, $role_id) {
		$select = new Select();
		$select->from('role')
				->whereEquals('role_name', '?');

		$params = array($role_name);
		if ($role_id !== null) {
			$select->whereNotEquals('role_id', '?');
			$params[] = $role_id;
		}

		$res = $this->adapter->query($select, $params);

		return (count($res)) ? false : true;
	}

}