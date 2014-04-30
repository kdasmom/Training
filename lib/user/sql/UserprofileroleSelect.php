<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 11.04.2014
 * Time: 9:54
 */

namespace NP\user\sql;


use NP\core\db\Select;

class UserprofileroleSelect extends Select {
	protected $tableName    = 'userprofilerole';
	protected $alias;

	public function __construct($alias = 'up') {
		parent::__construct();

		$this->alias = $alias;

		$this->from([$this->alias => $this->tableName]);
	}


	/**
	 * Join roles
	 *
	 * @param array $cols
	 * @param string $toAlias
	 * @param string $fromAlias
	 * @param string $joinType
	 * @return Select
	 */
	public function joinRole($cols = [], $toAlias = 'r', $fromAlias = 'up', $joinType = Select::JOIN_INNER) {
		return $this->join([$toAlias => 'role'], "{$fromAlias}.role_id = {$toAlias}.role_id", $cols, $joinType);
	}

	/**
	 * Join staff
	 *
	 * @param array $cols
	 * @param string $toAlias
	 * @param string $fromAlias
	 * @param string $joinType
	 * @return Select
	 */
	public function joinStaff($cols = [], $toAlias = 's', $fromAlias = 'up', $joinType = Select::JOIN_INNER) {
		return $this->join([$toAlias => 'staff'], "{$fromAlias}.tablekey_id = {$toAlias}.staff_id", $cols, $joinType);
	}

	/**
	 * Join email
	 *
	 * @param array $cols
	 * @param string $toAlias
	 * @param string $fromAlias
	 * @param string $joinType
	 * @return Select
	 */
	public function joinEmail($cols = [], $toAlias = 'e', $fromAlias = 's', $joinType = Select::JOIN_INNER) {
		return $this->join([$toAlias => 'email'], "{$toAlias}.tablekey_id = {$fromAlias}.staff_id", $cols, $joinType);
	}
} 