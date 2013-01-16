<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\SqlSelect;

class ConfigsysGateway extends AbstractGateway {
	
	public $table = 'configsys';
	
	public function getSelect($where=null) {
		$select = new SqlSelect();
		$select->from('configsys')
				->join(array('cv'=>'configsysval'), 'configsys.configsys_id = cv.configsys_id')
				->where($where);
		
		return $select;
	}
	
	public function getCustomFieldSettings() {
		$select = new SqlSelect();
		$select->from('configsys')
				->columns(array('configsys_id','configsys_name'))
				->join(array('cv'=>'configsysval'), 
						'configsys.configsys_id = cv.configsys_id',
						array('configsysval_id','configsysval_val'))
				->where("
					configsys.configsys_name LIKE '%_CUSTOM_FIELD%_ON_OFF'
					OR configsys.configsys_name LIKE 'CUSTOM_FIELD%_TYPE'
					OR configsys.configsys_name LIKE '%_CUSTOM_FIELD%_REQ'
					OR configsys.configsys_name LIKE '%CUSTOM_FIELD_LABEL%'
				");
		
		return $this->selectWith($select);
	}
	
}

?>