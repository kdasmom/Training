<?php

namespace NP\user;

use NP\core\AbstractGateway;

use NP\core\db\Select;

/**
 * Gateway for the MODULEPRIV table
 *
 * @author Thomas Messier
 */
class ModulePrivGateway extends AbstractGateway {
	
	/**
	 * @param int $userprofile_id ID of the user for whom we want modules
	 * @return string             A comma-delimited list of module_id values
	 */
	public function getModuleListByUser($userprofile_id) {
		$table = $this->table;
		$select = new Select();
		$select->from($table)
				->columns(array('module_id'))
				->join(array('r'=>'role'),
						$table.".tablekey_id = r.role_id",
						array())
				->join(array('ur'=>'userprofilerole'),
						'r.role_id = ur.role_id',
						array())
				->where("
					ur.userprofile_id = ?
					AND ".$table.".table_name = ?
					AND ".$table.".modulepriv_status = 'active'
					AND ".$table.".modulepriv_effectivedate <= getDate()
					AND (
						".$table.".modulepriv_expirationdate >= getDate()
						OR ".$table.".modulepriv_expirationdate IS NULL
					)
				");
		
		$resultSet = $this->adapter->query($select, array($userprofile_id, 'role'));
		
		$modules = array();
		foreach($resultSet as $rec) {
			$modules[$rec['module_id']] = true;
		}
		
		return $modules;
	}
	
}

?>