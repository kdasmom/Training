<?php

namespace NP\user;

use NP\core\AbstractGateway;

use Zend\Db\Sql\Select;

class ModulePrivGateway extends AbstractGateway {
		
	public $table = 'modulepriv';
	
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
		
		$resultSet = $this->executeSelectWithParams($select, array($userprofile_id, 'role'));
		
		$modules = array();
		foreach($resultSet as $rec) {
			array_push($modules, $rec["module_id"]);
		}
		
		return implode(",", $modules);
	}
	
}

?>