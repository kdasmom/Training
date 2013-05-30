<?php

namespace NP\notification;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the EMAILALERT table
 *
 * @author 
 */
class EmailAlertGateway extends AbstractGateway {

	public function getUserNotifications($userprofile_id) {
		$roleSubSelect = new Select();
		$roleSubSelect->column('role_id')
						->from('userprofilerole')
						->whereEquals('userprofile_id', '?');
		$roleHourSubSelect = new Select();
		$roleHourSubSelect->count()
							->from('emailalert')
							->whereEquals('userprofile_id', '?')
							->whereEquals('isActive', 0);

		$select = new Select();
		$select->from('emailalert')
				->whereEquals('isActive', 1)
				->whereNest('OR')
				->whereEquals('userprofile_id', '?')
				->whereNest()
				->whereEquals('role_id', $roleSubSelect)
				->whereEquals($roleHourSubSelect, 0);
		
		$params = array_fill(0, 3, $userprofile_id);

		return $this->adapter->query($select, $params);
	}

	public function insertUserMissingAlerts($userprofile_id) {
		$this->adapter->query('
			INSERT INTO emailalert
			(emailalert_type, userprofile_id, isActive)
			SELECT
				et.emailalerttype_id_alt, ?, 0
			FROM EMAILALERTTYPE et
			WHERE NOT EXISTS (
				SELECT *
				FROM emailalert e
				WHERE e.userprofile_id = ?
					AND e.emailalert_type = et.emailalerttype_id_alt
			)
		', array($userprofile_id, $userprofile_id));
	}

}

?>