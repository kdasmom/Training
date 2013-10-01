<?php

namespace NP\user;

use NP\core\AbstractGateway;
use NP\core\db\Update;
use NP\core\db\Select;

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
	public function findProfileById($userprofile_id = null) {
		$select = new sql\UserprofileSelect();
		$select->columnsAll()
				->joinUserprofilerole(null)
				->joinRole()
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
			$fields = $data->getFields();
			foreach ($fields as $fieldName=>$fieldDef) {
				if (array_key_exists('timestamp', $fieldDef) && $fieldDef['timestamp'] == 'created') {
					$data->$fieldName = \NP\util\Util::formatDateForDB();
					break;
				}
			}
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
			$fields = $data->getFields();
			foreach ($fields as $fieldName=>$fieldDef) {
				if (array_key_exists('timestamp', $fieldDef) && $fieldDef['timestamp'] == 'updated') {
					$data->$fieldName = \NP\util\Util::formatDateForDB();
					break;
				}
			}
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
	
	/**
	 * Checks if a username is unique
	 *
	 * @param  string $userprofile_username 
	 * @param  int    $userprofile_id       
	 * @return boolean
	 */
	public function isUsernameUnique($userprofile_username, $userprofile_id) {
		$select = new sql\UserprofileSelect();
		$select->whereEquals('userprofile_username', '?');

		$params = array($userprofile_username);
		if ($userprofile_id !== null) {
			$select->whereNotEquals('userprofile_id', '?');
			$params[] = $userprofile_id;
		}

		$res = $this->adapter->query($select, $params);

		return (count($res)) ? false : true;
	}

	/**
	 * 
	 */
	public function findByFilter($userprofile_status=null, $property_id=null, $role_id=null, $module_id=null, $pageSize=null, $page=1, $sort='person_lastname') {
		if ($sort == 'person_lastname ASC') {
			$sort = 'p.person_lastname, p.person_firstname';
		} else if ($sort == 'person_lastname DESC') {
			$sort = 'p.person_lastname DESC, p.person_firstname DESC';
		}

		$select = $this->getSelect()->order($sort);
		$params = array();

		if ($userprofile_status !== null && $userprofile_status != '') {
			$select->whereEquals('u.userprofile_status', '?');
			$params[] = $userprofile_status;
		}

		if ($property_id !== null && $property_id != '') {
			$propSelect = new Select();
			$select->whereExists(
				$propSelect->from(array('pu'=>'propertyuserprofile'))
							->whereEquals('u.userprofile_id', 'pu.userprofile_id')
							->whereEquals('pu.property_id', '?')
			);
			$params[] = $property_id;
		}

		if ($role_id !== null && $role_id != '') {
			$select->whereEquals('ur.role_id', '?');
			$params[] = $role_id;
		}

		if ($module_id !== null && $module_id != '') {
			$moduleSelect = new Select();
			$select->whereExists(
				$moduleSelect->from(array('mp'=>'modulepriv'))
							->whereEquals('mp.tablekey_id', 'ur.role_id')
							->whereEquals('mp.module_id', '?')
			);
			$params[] = $module_id;
		}

		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
	}

    public function findAllMobileInfo($pageSize = null, $page = null, $order = 'person_lastname') {

        $select = new sql\UserprofileSelect();
        $select->columns(['userprofile_username', 'userprofile_id', 'userprofile_status'])
            ->joinUserprofilerole([])
            ->joinRole([])
            ->joinStaff([])
            ->joinPerson(array('person_firstname','person_lastname'))
            ->joinMobinfo(['mobinfo_id', 'mobinfo_phone', 'mobinfo_activated_datetm', 'mobinfo_deactivated_datetm', 'mobinfo_status'])
            ->order($order)
            ->limit($pageSize)
            ->offset($pageSize * ($page - 1));

        return $this->adapter->query($select);
    }
}

?>