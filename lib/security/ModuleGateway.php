<?php

namespace NP\security;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the MODULE table
 *
 * @author Thomas Messier
 */
class ModuleGateway extends AbstractGateway {

	public function findForTree() {
		$select = new Select();
		$select->columns(array('module_id','module_name'))
				->from(array('m'=>'module'))
				->join(array('t'=>'tree'),
						"t.tablekey_id = m.module_id AND t.table_name = 'module'",
						array('tree_id','tree_parent'))
				->order('m.module_name');

		return $this->adapter->query($select);
	}
}

?>