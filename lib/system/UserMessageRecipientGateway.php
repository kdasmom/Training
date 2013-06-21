<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the USERMESSAGERECIPIENT table
 *
 * @author Thomas Messier
 */
class UserMessageRecipientGateway extends AbstractGateway {
	protected $table      = 'usermessages_recipients';
	protected $pk         = 'id';
	protected $tableAlias = 'umr';

	/**
	 * Override getSelect() to add some joins by default
	 */
	public function getSelect() {
		$select = new Select();
		$select->from(array($this->tableAlias=>$this->table))
				->join(array('r'=>'role'),
						'umr.role_id = r.role_id',
						array('role_name'),
						Select::JOIN_LEFT)
				->join(array('u' => 'userprofile'),
						'umr.userprofile_id = u.userprofile_id',
						array('userprofile_username'),
						Select::JOIN_LEFT)
				->join(array('ur' => 'userprofilerole'),
						'u.userprofile_id = ur.userprofile_id',
						array('userprofilerole_id','tablekey_id'),
						Select::JOIN_LEFT)
				->join(array('s' => 'staff'),
						'ur.tablekey_id = s.staff_id',
						array('staff_id'),
						Select::JOIN_LEFT)
				->join(array('pe' => 'person'),
						's.person_id = pe.person_id',
						array('person_id','person_firstname','person_lastname'),
						Select::JOIN_LEFT);

		return $select;
	}
}

?>