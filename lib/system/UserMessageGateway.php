<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the USERMESSAGES table
 *
 * @author Thomas Messier
 */
class UserMessageGateway extends AbstractGateway {
	protected $table      = 'usermessages';
	protected $pk         = 'id';
	protected $tableAlias = 'um';

	/**
	 * Override getSelect to add some joins by default
	 */
	public function getSelect() {
		$select = new Select();
		$select->from(array('um'=>'usermessages'))
				->join(array('u' => 'userprofile'),
						'um.createdBy = u.userprofile_id',
						array('userprofile_id','userprofile_username'))
				->join(array('ur' => 'userprofilerole'),
						'u.userprofile_id = ur.userprofile_id',
						array('userprofilerole_id','tablekey_id'))
				->join(array('s' => 'staff'),
					'ur.tablekey_id = s.staff_id',
					array('staff_id'))
				->join(array('pe' => 'person'),
					's.person_id = pe.person_id',
					array('person_id','person_firstname','person_lastname'));

		return $select;
	}
}

?>