<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Expression;
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

	/**
	 * Retrieve all user messages
	 *
	 * @param null $pageSize
	 * @param null $page
	 * @param string $sort
	 * @return array|bool
	 */
	public function findAll($pageSize=null, $page=null, $sort="createdAt") {
		$select = new Select();

		$select->from(['um' => 'usermessages'])
				->columns([
					'id',
					'type',
					'status',
					'subject',
					'body',
					'createdBy',
					'createdAt',
					'sentAt',
					'displayUntil',
					'userprofile_id' => Select::get()->column('userprofile_id')
								->from(['r' => 'usermessages_recipients'])
								->whereEquals('usermessage_id', 'um.id')
								->limit(1),
					'role_id' => Select::get()->column('role_id')
						->from(['r' => 'usermessages_recipients'])
						->whereEquals('usermessage_id', 'um.id')
						->limit(1)
				])
				->join(['u' => 'userprofile'], 'um.createdBy = u.userprofile_id', ['userprofile_username', 'userprofile_id'])
				->join(['ur' => 'userprofilerole'], 'u.userprofile_id = ur.userprofile_id', ['userprofilerole_id', 'tablekey_id'])
				->join(['s' => 'staff'], 'ur.tablekey_id = s.staff_id', ['staff_id'])
				->join(['pe' => 'person'], 's.person_id = pe.person_id', ['person_id', 'person_firstname', 'person_lastname'])
				->order($sort)
				->limit($pageSize)
				->offset($pageSize * ($page - 1));

		return $this->adapter->query($select);
	}

}

?>