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
	 * Adds all columns except the password column
	 *
	 * @return \NP\user\sql\UserprofileSelect Returns caller object for easy chaining
	 */
	public function columnsAll() {
		$cols = array(
			'userprofile_id',
			'asp_client_id',
			'userprofile_username',
			'userprofile_status',
			'userprofile_session',
			'oracle_authentication',
			'userprofile_startdate',
			'userprofile_enddate',
			'userprofile_preferred_property',
			'userprofile_default_dashboard',
			'userprofile_splitscreen_size',
			'userprofile_splitscreen_ishorizontal',
			'userprofile_splitscreen_imageorder',
			'userprofile_splitscreen_loadwithoutimage',
			'userprofile_preferred_region',
			'userprofile_updated_by',
			'userprofile_updated_datetm',
			'userprofile_dashboard_layout'
		);
		for ($i=1;$i<=6;$i++) {
			$cols[] = "security_question{$i}";
			$cols[] = "security_answer{$i}";
		}

		return $this->columns($cols);
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
						$cols,
						Select::JOIN_LEFT)
					->join(array($typeAlias => 'phonetype'),
						"{$alias}.phonetype_id = {$typeAlias}.phonetype_id AND {$typeAlias}.phonetype_name = '{$phonetype_name}'",
						array(),
						Select::JOIN_LEFT);
	}
	
	/**
	 * Joins USERPROFILE table for userprofile_updated_by column
	 *
	 * @param  string[] $cols                 Columns to retrieve from the PHONE table
	 * @return \NP\user\sql\UserprofileSelect Returns caller object for easy chaining
	 */
	public function joinUpdatedBy($cols=array()) {
		return $this->join(array('updtu' => 'userprofile'),
						'u.userprofile_updated_by = updtu.userprofile_id',
						$cols,
						Select::JOIN_LEFT);
	}

    public function joinMobinfo($cols = []) {
        return $this->join(
            ['m' => 'mobinfo'],
            'u.userprofile_id = m.userprofile_id',
            $cols,
            Select::JOIN_INNER
        );
    }
	
}

?>