<?php

namespace NP\notification;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the EMAILALERTHOUR table
 *
 * @author 
 */
class EmailAlertHourGateway extends AbstractGateway {

	public function getUserEmailFrequency($userprofile_id) {
		$roleSubSelect = new Select();
		$roleSubSelect->column('role_id')
						->from('userprofilerole')
						->whereEquals('userprofile_id', '?');
		$roleHourSubSelect = new Select();
		$roleHourSubSelect->count()
							->from('emailalerthour')
							->whereEquals('userprofile_id', '?')
							->whereEquals('isActive', 0);

		$select = new Select();
		$select->from('emailalerthour')
				->whereEquals('isActive', 1)
				->nest('OR')
				->whereEquals('userprofile_id', '?')
				->nest()
				->whereEquals('role_id', $roleSubSelect)
				->whereEquals($roleHourSubSelect, 0);
		
		$params = array_fill(0, 3, $userprofile_id);

		return $this->adapter->query($select, $params);
	}

	public function insertUserMissingHours($userprofile_id) {
		for ($i=0; $i<24; $i++) {
			$exists = $this->adapter->query('
				SELECT *
				FROM emailalerthour 
				WHERE runhour = ?
					AND userprofile_id = ?
			', array($i, $userprofile_id));
			if (!count($exists)) {
				$this->save(array('runhour'=>$i, 'userprofile_id'=>$userprofile_id, 'isActive'=>0));
			}
		}
	}

}

?>