<?php

namespace NP\gl\sql;

use NP\core\db\Select;

/**
 * A custom Select object for GLAccount records with some shortcut methods
 *
 * @author Aliaksandr Zubik
 */
class GLAccountSelect extends Select {
	
	public function __construct() {
		parent::__construct();
		$this->from(array('g'=>'glaccount'));
	}
	
	/**
	 * Adds all columns except the password column
	 *
	 * @return \NP\gl\sql\GLAccountSelect Returns caller object for easy chaining
	 */
	public function columnsAll() {
		$cols = array('glaccount_id'
                          ,'glaccount_name'
                          ,'glaccount_number'
                          ,'glaccount_status'
                          ,'glaccount_amount'
                          ,'glaccount_level'
                          ,'glaccount_usable'
                          ,'glaccount_order'
                          ,'integration_package_id'
                          ,'glaccount_updatetm'
		);
		return $this->columns($cols);
	}

	/**
	 * Joins GLACCOUNYTYPE table
	 *
	 * @param  string[] $cols                 Columns to retrieve from the GLACCOUNYTYPE table
	 * @return \NP\gl\sql\GLAccountSelect Returns caller object for easy chaining
	 */
	public function joinType($cols=array()) {
		return $this->join(array('gt' => 'glaccounttype'),
						'g.glaccounttype_id = gt.glaccounttype_id',
						$cols);
	}
	
	/**
	 * Joins USERPROFILE table for glaccount_updatedby column
	 *
	 * @param  string[] $cols                 Columns to retrieve from the USERPROFILE table
	 * @return \NP\gl\sql\GLAccountSelect Returns caller object for easy chaining
	 */
	public function joinUpdatedBy($cols=array()) {
		return $this->join(array('updtu' => 'userprofile'),
						'g.glaccount_updateby = updtu.userprofile_id',
						$cols,
						Select::JOIN_LEFT);
	}
	
}

?>