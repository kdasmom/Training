<?php

namespace NP\system;

use NP\core\AbstractGateway;
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
			  ->like('c.configsys_name', "'CUSTOM_FIELD%_TYPE'")
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
	
}

?>