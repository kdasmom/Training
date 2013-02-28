<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\db\Select;

/**
 * Gateway for the PNUNIVERSALFIELD table
 *
 * @author Thomas Messier
 */
class PNUniversalFieldGateway extends AbstractGateway {
	
	/**
	 * Gets values for a custom field drop down 
	 *
	 * @param  int $universal_field_number The custom field number
	 * @param  int $isLineItem             Whether or not it's a line or header custom field (0=header; 1=line)
	 * @param  int $glaccount_id           Associated GL account ID (optional); defaults to null
	 * @return array
	 */
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
		
		return $this->adapter->query($select, $params);
	}
}

?>