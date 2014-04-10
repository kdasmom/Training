<?php

namespace NP\system;

use NP\core\AbstractGateway;

/**
 * Gateway for the PICKLISTTABLE table
 *
 * @author Thomas Messier
 */
class PicklistTableGateway extends AbstractGateway {
	protected $table = 'picklist_table';

	public function getConfiguredList($picklist_table_display) {
		$rec = $this->findSingle(
			['picklist_table_display'=>'?'],
			[$picklist_table_display]
		);

		$sql = 'SELECT * FROM ';

		if (empty($rec['picklist_table_from_sql'])) {
			$sql .= $rec['table_name'];
		} else {
			$sql .= $rec['picklist_table_from_sql'];
		}

		if (!empty($rec['picklist_table_where_sql'])) {
			$sql .= ' ' . $rec['picklist_table_where_sql'];
		}

		if (!empty($rec['picklist_table_orderby_sql'])) {
			$sql .= ' ORDER BY ' . $rec['picklist_table_orderby_sql'];
		}

		return $this->adapter->query($sql);
	}
}

?>