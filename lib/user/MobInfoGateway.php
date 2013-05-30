<?php

namespace NP\user;

use NP\core\AbstractGateway;

/**
 * Gateway for the MOBINFO table
 *
 * @author 
 */
class MobInfoGateway extends AbstractGateway {

	public function isDuplicate($userpofile_id, $mobinfo_phone) {
		$select = $this->getSelect();
		$select->whereEquals('mobinfo_status', '?')
				->whereNotEquals('userprofile_id', '?')
				->whereEquals('mobinfo_phone', '?');

		$res = $this->adapter->query($select, array('active', $userpofile_id, $mobinfo_phone));

		return (count($res)) ? true : false;
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
		
		// If primary key is in the set remove it
		if (array_key_exists($this->pk, $set)) {
			unset($set[$this->pk]);
		}
		
		$params = $this->convertFieldsToBindParams($set);
		$params['fields']['mobinfo_pin'] = 'PWDENCRYPT(?)';

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
		if ( array_key_exists('mobinfo_pin', $set) ) {
			if ($set['mobinfo_pin'] === '' || $set['mobinfo_pin'] === null) {
				unset($set['mobinfo_pin']);
				$paramsNew = $this->convertFieldsToBindParams($set);
			} else {
				$paramsNew = $this->convertFieldsToBindParams($set);
				$paramsNew['values']['mobinfo_pin'] = 'PWDENCRYPT(?)';
			}
		} else {
			$paramsNew = $this->convertFieldsToBindParams($set);
		}

		$paramsNew['values'] = array_merge($paramsNew['values'], $params);

		$update = new \NP\core\db\Update($this->table, $paramsNew['fields'], $where);
		
		return $this->adapter->query($update, $paramsNew['values']);
	}

}

?>