<?php

namespace NP\system;

use NP\core\AbstractGateway;
use NP\core\SqlSelect;

use Zend\Db\ResultSet\ResultSet;

/**
 * Gateway for the PICKLISTGATEWAY table
 *
 * @author Thomas Messier
 */
class PicklistGateway extends AbstractGateway {
	/**
	 * Overwrites the default find() method to provide a unified interface to retrieve any kind of pick list
	 * type data
	 *
	 * @param  string  $picklist_table_display 
	 * @param  boolean $getActiveOnly          Whether to get only active records or all records
	 * @param  int     $invoicepayment_type_id 
	 * @return array   An array of records
	 */
	public function find($picklist_table_display, $getActiveOnly=false, $invoicepayment_type_id=null) {
		if ($picklist_table_display == 'Priority') {
			return $this->getPriorityFlags();
		} else {
			$select = new SqlSelect('picklist_table');
			$select->where('picklist_table_display = ?');
			$res = $this->executeSelectWithParams($select, array($picklist_table_display));
			$res = $res[0];
			
			$select = new SqlSelect($res['table_name']);
			$select->columns(array(
				'id'=>$res['picklist_pk_column'],
				'data'=>$res['picklist_data_column'],
				'status'=>'universal_field_status',
			));
			
			
			$sqlStr = "SELECT " .
				$res['picklist_pk_column'] . " AS id," .
				$res['picklist_data_column'] . " AS data,
				universal_field_status AS status
			FROM ";
			
			if ($res['picklist_table_from_sql'] != '') {
				$sqlStr .= $res['picklist_table_from_sql'];
			} else {
				$sqlStr .= $res['table_name'];
			}
			
			
			if ($res['picklist_table_where_sql'] != '') {
				$sqlStr .= " " . $res['picklist_table_where_sql'];
			} else {
				$sqlStr .= " WHERE 1=1";
			}
			
			if ($getActiveOnly) {
				$sqlStr .= " AND " . $res['table_name'] . ".universal_field_status > 0";
			}
			
			if ($res['picklist_table_orderby_sql'] != '') {
				$sqlStr .= " ORDER BY " . $res['picklist_table_orderby_sql'];
			}
			
			$params = array();
			if ($invoicepayment_type_id != null) {
				$sqlStr .= " AND invoicepayment_type_id = ?";
				$params[] = $invoicepayment_type_id;
			}
			
			$sqlStr .= " ORDER BY invoicepayment_type";
			
			$result = $this->adapter->query($sqlStr, $params);
			$resultSet = new ResultSet();
			$resultSet = $resultSet->initialize($result);
			
			return $resultSet->toArray();
		}
	}
	
	/**
	 * Retrieves priority flags from the PRIORITYFLAG table and returns them in the same format as the one
	 * used in the find() method
	 *
	 * @return array
	 */
	private function getPriorityFlags() {
		$result = $this->adapter->query("
			SELECT 
				PriorityFlag_ID_Alt AS id, 
				PriorityFlag_Display AS data, 
				CASE
					WHEN PriorityFlag_Default = 1 THEN 2
					ELSE 1
				END AS universal_field_status
			FROM PriorityFlag
			ORDER BY PriorityFlag_ID_Alt
		")->execute();
		
		$resultSet = new ResultSet();
		$resultSet = $resultSet->initialize($result);
		
		return $resultSet->toArray();	
	}
	
}

?>