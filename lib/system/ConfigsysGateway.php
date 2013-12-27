<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Expression;
use NP\core\db\Insert;
use NP\core\db\Update;
use NP\core\db\Select;
use NP\core\db\Where;

/**
 * Gateway for the CONFIGSYS table
 *
 * @author Thomas Messier
 */
class ConfigsysGateway extends AbstractGateway {
	
	/**
	 * Modify the default Select object used to run queries on CONFIGSYS to include the CONFIGSYSVAL data as well
	 *
	 * @param \NP\core\db\Select
	 */
	public function getSelect() {
		$select = new Select();
		$select->from('configsys')
				->join(array('cv'=>'configsysval'), 'configsys.configsys_id = cv.configsys_id');
		
		return $select;
	}
	
	/**
	 * Returns all records from CONFIGSYS table relevant to custom field configurations
	 *
	 * @return array
	 */
	public function getCustomFieldSettings() {
		$select = new Select();
		$where = new Where(null, 'or');
		$where->like('c.configsys_name', "'%_CUSTOM_FIELD%_ON_OFF'")
			  ->like('c.configsys_name', "'CP.CUSTOM_FIELD%_TYPE'")
			  ->like('c.configsys_name', "'%_CUSTOM_FIELD%_REQ'")
			  ->like('c.configsys_name', "'%CUSTOM_FIELD_LABEL%'");

		$select->from(array('c'=>'configsys'))
				->columns(array('configsys_id','configsys_name'))
				->join(array('cv'=>'configsysval'), 
						'c.configsys_id = cv.configsys_id',
						array('configsysval_id','configsysval_val'))
				->where($where);
		
		return $this->adapter->query($select);
	}
	
	/**
	 * Returns records from CONFIGSYS table relevant to password configuration
	 *
	 * @return array
	 */
	public function getPasswordConfiguration() {
		$select = new Select();
		$where = new Where(null, 'or');
		$where->like('c.configsys_name', "'CP.PASSWORD_MIN_LENGTH'")
		->like('c.configsys_name', "'CP.PASSWORD_EXPIRE_INTERVAL'")
		->like('c.configsys_name', "'CP.PASSWORD_HISTORY_INTERVAL'")
		->like('c.configsys_name', "'CP.PASSWORD_CHANGE_ON_LOGIN'");
	
		$select->from(array('c'=>'configsys'))
		->columns(array('configsys_id','configsys_name'))
		->join(array('cv'=>'configsysval'),
				'c.configsys_id = cv.configsys_id',
				array('configsysval_id','configsysval_val'))
				->where($where);
	
		return $this->adapter->query($select);
	}
	
	/**
	 * Saves new Password Configuration to Database
	 *
	 * @param  array $data An associative array with the data needed to save password configuration
	 * @return array $errors Array containing DB errors if occured
	 */
	public function savePasswordConfiguration($data) {
		
		$errors = array();
		
		foreach ($data as $key => $val){
			
			/*
			 * TODO
			 * Modify NP\core\db\Update class to work with joined tables
			 */
			$updateSQL = "UPDATE cv SET
				cv.configsysval_val = ?
				FROM configsysval cv
					INNER JOIN configsys c ON c.configsys_id = cv.configsys_id
				WHERE c.configsys_name = ?";
			
			try {
				$this->adapter->query($updateSQL, array($val, $key));
			} catch (\Exception $e) {
				$errors[] = array(
						"field" => $key,
						"msg"	=> $e->getMessage());
			}
		}
	
		return $errors;
	}

	/**
	 * Retrieve sys value by name
	 *
	 * @param $name
	 * @return mixed
	 */
	public function findConfigSysValByName($name, $default_value = null) {
		$select  = new Select();

		$select->from(['c' => 'configsys'])
					->join(['cv' => 'configsysval'], 'c.configsys_id = cv.configsys_id', ['configsysval_val'])
					->where(['c.configsys_name' => '?']);

		$result = $this->adapter->query($select, [$name]);

		return isset($result[0]['configsysval_val']) ? $result[0]['configsysval_val'] : $default_value;
	}


	/**
	 * Save audit log
	 *
	 * @param $userprofile_id
	 * @param $tablekey_id
	 * @param $audittype_id
	 * @param $field_name
	 * @param $field_new_value
	 * @param $control_value
	 */
	public function saveAuditLog($userprofile_id, $tablekey_id, $audittype_id, $field_name, $field_new_value, $control_value = null) {
		if ($control_value) {
			$select = new Select();

			$select->from(['c' => 'configsys'])
					->join(['cv' => 'configsysval'], 'c.configsys_id = cv.configsys_id', ['configsysval_val'])
					->where(['c.configsys_name' => '?']);

			$result = $this->adapter->query($select, ['C' . $control_value]);
		}
		if ($control_value && $result[0]['configsysval_val'] == 1) {
			$insert = new Insert();

			$insert->into('auditlog')
				->columns(['userprofile_id', 'tablekey_id', 'auditactivity_id', 'audittype_id', 'field_name', 'field_new_value'])
				->values(Select::get()->columns([
					new Expression('?'),
					new Expression('?'),
					'auditactivity_id',
					new Expression('?'),
					new Expression('?'),
					new Expression('?')
					])
					->from('auditactivity')
					->where(['auditactivity' => '?']));

			$this->adapter->query($insert, [$userprofile_id, $tablekey_id, $audittype_id, $field_name, $field_new_value]);
		}
	}
}

?>