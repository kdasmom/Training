<?php

namespace NP\notification;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Delete;
use NP\core\db\Insert;
use NP\core\db\Expression;

/**
 * Gateway for the EMAILALERTHOUR table
 *
 * @author 
 */
class EmailAlertHourGateway extends AbstractGateway {

	public function deleteUserRoleEmailFrequency($type, $tablekey_id) {
		$delete = new Delete();
		$delete->from('emailalerthour');
		
		if ($type == 'userprofile') {
			$delete->whereEquals('userprofile_id', '?');
		} else {
			$select = new Select();
			$select->column('userprofile_id')
					->from('userprofilerole')
					->whereEquals('role_id', '?');

			$delete->whereIn('userprofile_id', $select);
		}

		return $this->adapter->query($delete, array($tablekey_id));
	}

	public function copyRoleEmailFrequencyToUsers($type, $tablekey_id) {
		$insert = new Insert();
		$insert->into('emailalerthour')
				->columns(array('runhour','isActive','userprofile_id'));

		$select = new Select();
		$select->columns(array(
							'runhour',
							'isActive'
						))
				->from(array('e'=>'emailalerthour'))
				->whereEquals('e.role_id', '?');

		if ($type == 'role') {
				$select->join(array('ur'=>'userprofilerole'),
						null,
						array('userprofile_id'),
						Select::JOIN_CROSS)
						->whereEquals('ur.role_id', '?');

				$role_id = $tablekey_id;
		} else {
			$role = new Select();
			$role->column('role_id')
						->from('userprofilerole')
						->whereEquals('userprofile_id', '?');
			$this->adapter->query($role, array($tablekey_id));
			$role_id = $role[0]['role_id'];

			$select->join(array('u'=>'userprofile'),
						null,
						array('userprofile_id'),
						Select::JOIN_CROSS)
						->whereEquals('u.userprofile_id', '?');
		}

		$insert->values($select);

		return $this->adapter->query($insert, array($role_id, $tablekey_id));
	}
	
	public function copyToRole($from_role_id, $to_role_id) {
		$insert = new Insert();
		$select = new Select();
		$now = \NP\util\Util::formatDateForDB();

		$insert->into('emailalerthour')
				->columns(array('runhour','role_id','isActive'))
				->values(
					$select->columns(array(
								'runhour',
								new Expression('?'),
								'isActive'
							))
							->from('emailalerthour')
							->whereEquals('role_id', '?')
							->whereEquals('isActive', '?')
				);

		$this->adapter->query($insert, array($to_role_id, $from_role_id, 1));
	}

}

?>