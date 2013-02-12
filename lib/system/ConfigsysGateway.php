<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\SqlSelect;

/**
 * Gateway for the CONFIGSYS table
 *
 * @author Thomas Messier
 */
class ConfigsysGateway extends AbstractGateway {
	
	/**
	 * Modify the default Select object used to run queries on CONFIGSYS to include the CONFIGSYSVAL data as well
	 *
	 * @return NP\core\SqlSelect
	 */
	public function getSelect() {
		$select = new SqlSelect();
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