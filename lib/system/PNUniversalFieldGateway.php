<?php

namespace NP\system;

use NP\core\AbstractGateway;

use Zend\Db\Sql\Select;

class PNUniversalFieldGateway  extends AbstractGateway {
	
	public $table = 'pnuniversalfield';
	
	public function getCustomFieldDropDownValues($universal_field_number, $isLineItem, $glaccount_id=null) {
		$params = array($universal_field_number, $isLineItem);
		$useGL = ($glaccount_id != null);
		
		$table = $this->table;
		$select = new Select();
		$select->from($table)
				->columns(array('universal_field_data','universal_field_order'));
		
		$where =
			$table.".universal_field_number = ?
			AND ".$table.".customfield_pn_type = 'customInvoicePO'
			AND ".$table.".universal_field_status <> 0
			AND ".$table.".islineitem = ?
		";
		if ($useGL) {
			$select->join(array('l'=>'link_universal_gl'),
							$table.'.universal_field_id = l.universal_field_id',
							array());
			$where .= 'AND l.gl_id = ?';
			$params[] = $glaccount_id;
		}
		$select->where($where)
				->order(array($table.'.universal_field_order',$table.'.universal_field_data'));
		
		return $this->executeSelectWithParams($select, $params);
	}
}

?>