<?php

namespace NP\user\sql;

use NP\core\db\Select;

/**
 * A custom Select object for Userprofile records with some shortcut methods
 *
 * @author Thomas Messier
 */
class UserprofileSelect extends Select {
	
	public function __construct() {
		parent::__construct();
		$this->from(array('u'=>'userprofile'));
	}
	
	/**
	 * Joins USERPROFILEROLE table
	 *
	 * @param  string[] $cols                 Columns to retrieve from the USERPROFILEROLE table
	 * @return \NP\user\sql\UserprofileSelect Returns caller object for easy chaining
	 */
	public function joinUserprofilerole($cols=array()) {
		return $this->join(array('ur' => 'userprofilerole'),
						'u.userprofile_id = ur.userprofile_id',
						$cols);
	}
	
	/**
	 * Joins ROLE table
	 *
	 * @param  string[] $cols                 Columns to retrieve from the ROLE table
	 * @return \NP\user\sql\UserprofileSelect Returns caller object for easy chaining
	 */
	public function joinRole($cols=array()) {
		return $this->join(array('r' => 'role'),
						'ur.role_id = r.role_id',
						$cols);
	}
	
	/**
	 * Joins STAFF table
	 *
	 * @param  string[] $cols                 Columns to retrieve from the STAFF table
	 * @return \NP\user\sql\UserprofileSelect Returns caller object for easy chaining
	 */
	public function joinStaff($cols=array()) {
		return $this->join(array('s' => 'staff'),
						'ur.tablekey_id = s.staff_id',
						$cols);
	}
	
	/**
	 * Joins PERSON table
	 *
	 * @param  string[] $cols                 Columns to retrieve from the PERSON table
	 * @return \NP\user\sql\UserprofileSelect Returns caller object for easy chaining
	 */
	public function joinPerson($cols=array()) {
		return $this->join(array('p' => 'person'),
						's.person_id = p.person_id',
						$cols);
	}
	
	/**
	 * Joins EMAIL table
	 *
	 * @param  string[] $cols                 Columns to retrieve from the EMAIL table
	 * @return \NP\user\sql\UserprofileSelect Returns caller object for easy chaining
	 */
	public function joinEmail($cols=array()) {
		return $this->join(array('e' => 'email'),
						"s.staff_id = e.tablekey_id AND e.table_name = 'staff'",
						$cols);
	}
	
	/**
	 * Joins ADDRESS table
	 *
	 * @param  string[] $cols                 Columns to retrieve from the ADDRESS table
	 * @return \NP\user\sql\UserprofileSelect Returns caller object for easy chaining
	 */
	public function joinAddress($cols=array()) {
		return $this->join(array('a' => 'address'),
						"s.staff_id = a.tablekey_id AND a.table_name = 'staff'",
						$cols);
	}
	
	/**
	 * Joins PHONE table
	 *
	 * @param  string   $phonetype_name       Type of phone number to retrieve
	 * @param  string[] $cols                 Columns to retrieve from the PHONE table
	 * @return \NP\user\sql\UserprofileSelect Returns caller object for easy chaining
	 */
	public function joinPhone($phonetype_name, $cols=array()) {
		$alias = $phonetype_name.'p';
		$typeAlias = $phonetype_name.'pt';
		return $this->join(array($alias => 'phone'),
						"s.staff_id = {$alias}.tablekey_id AND {$alias}.table_name = 'staff'",
						$cols)
					->join(array($typeAlias => 'phonetype'),
						"{$alias}.phonetype_id = {$typeAlias}.phonetype_id AND {$typeAlias}.phonetype_name = '{$phonetype_name}'",
						array());
	}
	
}