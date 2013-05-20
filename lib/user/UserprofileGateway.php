<?php

namespace NP\user;

use NP\core\AbstractGateway;

/**
 * Gateway for the USERPROFILE table
 *
 * @author Thomas Messier
 */
class UserprofileGateway extends AbstractGateway {
	
	/**
	 * @param  string  $username 
	 * @param  string  $pwd      
	 * @return boolean True if authentication succeeds, false otherwise
	 */
	public function authenticate($username, $pwd) {
		$select = new sql\UserprofileSelect();
		$select->columns(array("userprofile_id"))
				->where("
					userprofile_username = ?
					AND PWDCOMPARE(?, userprofile_password) = 1
					AND userprofile_status = 'active'
					AND (userprofile_startdate IS NULL OR DATEDIFF(day, userprofile_startdate, getdate()) >= 0 )
					AND (userprofile_enddate IS NULL OR DATEDIFF(day, userprofile_enddate, getdate()) <= 0 )
				");
		
		$resultSet = $this->adapter->query($select, array($username, $pwd));
		
		if (count($resultSet)) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * @param  int   $userprofile_id The ID of the user you want details for
	 * @return array                 An array with data for the specified user, including userprofile, role, person, address, and email
	 */
	public function findProfileById($userprofile_id) {
		$select = new sql\UserprofileSelect();
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
			'userprofile_ADguid',
			'userprofile_preferred_region',
			'userprofile_updated_by',
			'userprofile_updated_datetm'
		);
		for ($i=1;$i<=6;$i++) {
			$cols[] = "security_question{$i}";
			$cols[] = "security_answer{$i}";
		}
		
		$select->columns($cols)
				->joinUserprofilerole(null)
				->joinRole(null)
				->joinStaff(null)
				->joinPerson(null)
				->joinEmail(null)
				->joinAddress(null)
				->joinPhone('Home', array(
					'home_phone_id'=>'phone_id',
					'home_tablekey_id'=>'tablekey_id',
					'home_table_name'=>'table_name',
					'home_phonetype_id'=>'phonetype_id',
					'home_phone_countrycode'=>'phone_countrycode',
					'home_phone_number'=>'phone_number'))
				->joinPhone('Work', array(
					'work_phone_id'=>'phone_id',
					'work_tablekey_id'=>'tablekey_id',
					'work_table_name'=>'table_name',
					'work_phonetype_id'=>'phonetype_id',
					'work_phone_countrycode'=>'phone_countrycode',
					'work_phone_number'=>'phone_number'))
				->where('u.userprofile_id = ?');

		$res = $this->adapter->query($select, array($userprofile_id));
		return array_pop($res);
	}

	/**
	 * Inserts a record in the database
	 *
	 * @param  array|\NP\core\AbstractEntity $data An associative array with key/value pairs for fields, or an Entity object
	 * @return boolean                             Whether the operation succeeded or not
	 */
	public function insert($data) {
		// If we passed in an entity, get the data for it
		if ($data instanceOf \NP\core\AbstractEntity) {
			$set = $data->toArray();
		} else {
			$set = $data;
		}
		
		$params = $this->convertFieldsToBindParams($set);
		$params['fields']['userprofile_password'] = 'PWDENCRYPT(?)';

		$insert = new \NP\core\db\Insert($this->table, $params['fields']);

		$res = $this->adapter->query($insert, $params['values']);

		if ($data instanceOf \NP\core\AbstractEntity) {
			$data->{$this->pk} = $this->lastInsertId();
		}

		return $res;
	}

	/**
	 * Updates a record in the database
	 *
	 * @param  array|\NP\core\AbstractEntity $data An associative array with key/value pairs for fields, or an Entity object
	 * @return boolean                             Whether the operation succeeded or not
	 */
	public function update($data) {
		// If we passed in an entity, get the data for it
		if ($data instanceOf \NP\core\AbstractEntity) {
			$set = $data->toArray();
		} else {
			$set = $data;
		}

		// If a blank password was provided, we need to make sure it doesn't get saved
		if ( array_key_exists('userprofile_password', $set) ) {
			if ($set['userprofile_password'] === '' || $set['userprofile_password'] === null) {
				unset($set['userprofile_password']);
				$params = $this->convertFieldsToBindParams($set);
			} else {
				$params = $this->convertFieldsToBindParams($set);
				$params['values']['userprofile_password'] = 'PWDENCRYPT(?)';
			}
		} else {
			$params = $this->convertFieldsToBindParams($set);
		}

		$update = new \NP\core\db\Update($this->table, $params['fields'], array($this->pk=>'?'));
		
		return $this->adapter->query($update, $params['values']);
	}
	
}

?>