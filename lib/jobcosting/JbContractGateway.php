<?php

namespace NP\jobcosting;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the JBCONTRACT table
 *
 * @author Thomas Messier
 */
class JbContractGateway extends AbstractGateway {

	/**
	 * Returns contracts associated to an entity (invoice or po) that are inactive
	 */
	public function findInactiveContractInEntity($table_name, $tablekey_id) {
		if ($table_name == 'invoice') {
			$lineTable = 'InvoiceItem';
		} else {
			$lineTable = 'PoItem';
		}
		$module = str_replace('item', '', strtolower($lineTable));
		$lineAlias = substr($lineTable, 0, 1) . 'i';
		$joinClass = "\\NP\\{$module}\\sql\\join\\{$lineTable}JobAssociationJoin";

		$select = Select::get()->distinct()
								->columns(array())
								->from(array($lineAlias=>$lineTable))
								->join(new $joinClass(array()))
								->join(new \NP\jobcosting\sql\join\JobAssociationJbContractJoin())
								->whereEquals("{$table_name}_id", '?')
								->whereEquals('jbct.jbcontract_status', '?');

		return $this->adapter->query($select, array($tablekey_id, 'inactive'));
	}

}

?>