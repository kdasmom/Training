<?php

namespace NP\user;

use NP\core\AbstractGateway;
use NP\core\db\Update;

/**
 * Gateway for the USERPROFILE table
 *
 * @author Thomas Messier
 */
class UserprofileGateway extends AbstractGateway {
	protected $tableAlias = 'u';

	/**
	 * Override to retrieve more by default
	 */
	public function getSelect() {
		$select = new sql\UserprofileSelect();
		$select->columnsAll()
				->joinUserprofilerole(array('userprofilerole_id','tablekey_id'))
				->joinRole(array('role_id','role_name'))
				->joinStaff(array('staff_id'))
				->joinPerson(array('person_id','person_firstname','person_lastname'))
				->joinUpdatedBy(array(
					'updated_by_userprofile_id' => 'userprofile_id',
					'updated_by_userprofile_username' => 'userprofile_username'
				));

		return $select;
	}

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
		$select->columnsAll()
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
	 * @param  array|\NP\core\AbstractEntity $data   An associative array with key/value pairs for fields, or an Entity object
	 * @param  NP\core\db\Where|string|array $where  The criteria for which records to delete
	 * @param  array                         $params Parameters to bind to the where clause (the $data parameters are automatically bound) (optional)
	 * @return boolean                               Whether the operation succeeded or not
	 */
	public function update($data, $where=null, $params=array()) {
		// If we passed in an entity, get the data for it
		if ($data instanceOf \NP\core\AbstractEntity) {
			$set = $data->toArray();
		} else {
			$set = $data;
		}

		// If primary key is in set, process it
		if (array_key_exists($this->pk, $set)) {
			// If no where clause was provided, assume the primary key is the where clause
			if ($where === null) {
				$where = array($this->pk=>'?');
				$params = array($set[$this->pk]);
			}
			unset($set[$this->pk]);
		}

		// If a blank password was provided, we need to make sure it doesn't get saved
		if ( array_key_exists('userprofile_password', $set) ) {
			if ($set['userprofile_password'] === '' || $set['userprofile_password'] === null) {
				unset($set['userprofile_password']);
				$paramsNew = $this->convertFieldsToBindParams($set);
			} else {
				$paramsNew = $this->convertFieldsToBindParams($set);
				$paramsNew['fields']['userprofile_password'] = 'PWDENCRYPT(?)';
			}
		} else {
			$paramsNew = $this->convertFieldsToBindParams($set);
		}

		$paramsNew['values'] = array_merge($paramsNew['values'], $params);

		$update = new \NP\core\db\Update($this->table, $paramsNew['fields'], $where);
		
		return $this->adapter->query($update, $paramsNew['values']);
	}

	/**
	 * Removes properties from being the preferred properties for users
	 */
	public function removePropertiesAsUserPreferred($property_id_list) {
		$update = new Update();

		// Create an placeholders for the IN clause
		$propertyPlaceHolders = $this->createPlaceholders($property_id_list);

		// Add the where clause
		$update->table('userprofile')
				->values(array('userprofile_preferred_property' => 0))
				->whereIn('userprofile_preferred_property', $propertyPlaceHolders);

		return $this->adapter->query($update, $property_id_list);
	}
	
}

?>