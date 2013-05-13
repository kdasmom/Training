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
		
		$values = $this->convertFieldsToBindParams($set);
		$values['mobinfo_pin'] = 'PWDENCRYPT(:mobinfo_pin)';

		$insert = new \NP\core\db\Insert($this->table, $values);

		$res = $this->adapter->query($insert, $set);

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

		$values = $this->convertFieldsToBindParams($set);

		// If a blank password was provided, we need to make sure it doesn't get saved
		if ( array_key_exists('mobinfo_pin', $set) ) {
			if ($set['mobinfo_pin'] === '' || $set['mobinfo_pin'] === null) {
				unset($set['mobinfo_pin']);
				unset($values['mobinfo_pin']);
			} else {
				$values['mobinfo_pin'] = 'PWDENCRYPT(:mobinfo_pin)';
			}
		}

		$update = new \NP\core\db\Update($this->table, $values, array($this->pk => ":{$this->pk}"));
		
		return $this->adapter->query($update, $set);
	}

}

?>