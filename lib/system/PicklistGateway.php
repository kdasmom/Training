<?php
/**
 * Created by PhpStorm.
 * User: Andrey Baranov
 * Date: 1/28/14
 * Time: 4:36 PM
 */

namespace NP\system;


use NP\core\AbstractGateway;
use NP\core\db\Expression;
use NP\core\db\Select;

class PicklistGateway extends AbstractGateway {

	/**
	 * Return picklist columns list
	 *
	 * @param $tablekey_id
	 * @param $asp_client_id
	 * @return array|bool
	 */
	public function getPicklistColumns($tablekey_id, $asp_client_id) {
		$select = new Select();
		$selectColumns = new Select();
		$params = [];

		$select->from(['pt' => 'picklist_table'])
			->columns(['picklist_pk_column', 'picklist_data_column', 'picklist_display_column', 'table_name', 'picklist_table_id', 'picklist_table_from_sql', 'picklist_table_where_sql', 'picklist_table_orderby_sql', 'picklist_table_allow_new'])
			->where([
				'picklist_table_id'	=> '?',
				'asp_client_id'		=> '?'
			]);

		$table = $this->adapter->query($select, [$tablekey_id, $asp_client_id]);

		$whereClause = trim($table[0]['picklist_table_where_sql']);

		if (preg_match('/(.+)#(.+)#/', $whereClause, $matches)) {
			if ($matches[2] == 'client.asp_client_id') {
				$whereClause = $matches[1] . $asp_client_id;
			}
		}

		$fromtable = !$table[0]['picklist_table_from_sql'] ? $table[0]['table_name'] : $table[0]['picklist_table_from_sql'];

		/**
		 * SELECT
		CASE
		WHEN #qry_picklist_table.table_name#.universal_field_status = 0 THEN #PreserveSingleQuotes(qry_picklist_table.picklist_data_column)# + ' (Inactive)'
		ELSE #PreserveSingleQuotes(qry_picklist_table.picklist_data_column)#
		END AS column_data,
		#qry_picklist_table.picklist_pk_column# as column_pk_data,
		#qry_picklist_table.table_name#.universal_field_status as column_status
		FROM <CFIF qry_picklist_table.picklist_table_from_sql NEQ "">#qry_picklist_table.picklist_table_from_sql#<CFELSE>#qry_picklist_table.table_name#</CFIF>
		#PreserveSingleQuotes(WhereClause)#
		<CFIF qry_picklist_table.picklist_table_orderby_sql NEQ "">ORDER BY #qry_picklist_table.picklist_table_orderby_sql#<CFELSE>ORDER BY #qry_picklist_table.picklist_data_column#</CFIF>
		 */

		$sql = "SELECT CASE
		WHEN {$table[0]['table_name']}.universal_field_status = 0 THEN {$table[0]['picklist_data_column']} + ' (Inactive)'
		ELSE {$table[0]['picklist_data_column']}
		END AS column_data,
		{$table[0]['picklist_pk_column']} as column_pk_data,
		{$table[0]['table_name']}.universal_field_status as column_status
		FROM ";

		if ($table[0]['picklist_table_from_sql'] != '') {
			$sql .= $table[0]['picklist_table_from_sql'] . ' ';
		} else {
			$sql .= $table[0]['table_name'] . ' ';
		}

		$sql .= $whereClause;
		if ($table[0]['picklist_table_orderby_sql'] != '') {
			$sql .= " ORDER BY {$table[0]['picklist_table_orderby_sql']}";
		} else {
			$sql .= " ORDER BY {$table[0]['picklist_data_column']}";
		}

		

//		$selectColumns->from([$fromtable => $fromtable])
//			->columns([
//				'column_data'	=> new Expression("CASE
//					WHEN {$fromtable}.universal_field_status = 0 THEN {$table[0]['picklist_data_column']} + ' (Inactive)'
//					ELSE {$table[0]['picklist_data_column']}
//				END"),
//				'column_pk_data'	=> $table[0]['picklist_pk_column'],
//				'column_status'		=> 'universal_field_status'
//			]);
//
//		$sql = $selectColumns->toString() . ' ' . $whereClause . ' order by ' . (!$table[0]['picklist_table_orderby_sql'] ? $table[0]['picklist_data_column'] : $table[0]['picklist_table_orderby_sql']);
//
		$columns = $this->adapter->query($sql);

		return $columns;
	}

	public function getColumnsValue($tablekey_id, $table_name, $asp_client_id, $columnStatus) {
		$selectTable = new Select();
		$selectColumns = new Select();
//		select table
		$selectTable->from(['p' => 'picklist_table'])
			->columns([
				'table_name', 'picklist_pk_column', 'picklist_display_column', 'picklist_table_display', 'picklist_table_id'
			]);

		if ($tablekey_id) {
			$where = [
				'asp_client_id'		=> '?',
				'picklist_table_id'	=> '?'
			];
			$params = [$asp_client_id, $tablekey_id];
		} else {
			$where = [
				'asp_client_id'		=> '?',
				'table_name'		=> '?'
			];
			$params = [$asp_client_id, $table_name];
		}
		$selectTable->where($where);
		$table = $this->adapter->query($selectTable, $params);

//		select columns
		$selectColumns->from(['p' => 'picklist_column'])
			->columns([
				'picklist_column_id',
				'column_name',
				'column_name_title',
				'dropdown_flag',
				'dropdown_table',
				'dropdown_value_column',
				'dropdown_name_column',
				'dropdown_sql_select',
				'dropdown_sql_from',
				'dropdown_sql_where',
				'dropdown_sql_orderby',
				'readonly_flag'
			])
			->where([
				'picklist_table_id'	=> '?'
			]);

		$result = $this->adapter->query($selectColumns, [$table[0]['picklist_table_id']]);
		foreach ($result as &$column) {
			$column['column_info'] = $this->sp_columns($table[0]['table_name'], $column['column_name']);
			$column['universal_field_status'] = $columnStatus;
		}

		return $result;
	}

	/**
	 * determine datatypes of columns
	 *
	 * @param $table_name
	 * @param $column_name
	 * @return array|bool
	 */
	public function sp_columns($table_name, $column_name) {

		$sql = "exec sp_columns @table_name = {$table_name}, @column_name = {$column_name}";

		return $this->adapter->query($sql);
	}

	/**
	 * Retrieve values for the dropdown field
	 *
	 * @param $column_id
	 * @param $asp_client_id
	 * @return array|bool
	 */
	public function getDropDownValuesPicklistColumn($column_id, $asp_client_id, $dropdown_flag) {
		$select = new Select();

		if ($dropdown_flag == 1) {
			$select->from(['p' => 'picklist_dropdown'])
				->columns(['dropdown_value', 'dropdown_display_text'])
				->where([
					'picklist_column_id'	=> '?',
					'asp_client_id'			=> '?'
				])
				->order('dropdown_display_text');

			$result = $this->adapter->query($select, [$column_id, $asp_client_id]);
		} else {
			$selectColumn = new Select();

			$selectColumn->from(['p' => 'picklist_column'])
				->columns([
					'picklist_column_id',
					'column_name',
					'column_name_title',
					'dropdown_flag',
					'dropdown_table',
					'dropdown_value_column',
					'dropdown_name_column',
					'dropdown_sql_select',
					'dropdown_sql_from',
					'dropdown_sql_where',
					'dropdown_sql_orderby',
					'readonly_flag'
				])
				->where([
					'picklist_column_id'	=> '?'
				]);

			$column = $this->adapter->query($selectColumn, [$column_id]);

			$sql = 'SELECT ';
			if ($column[0]['dropdown_sql_select']) {
				$sql .= $column[0]['dropdown_sql_select'] . ' FROM ';
			} else {
				$sql .= $column[0]['dropdown_value_column'] . ', ' . $column[0]['dropdown_name_column'] . ' FROM ';
			}
			if (strlen($column[0]['dropdown_sql_from'] > 0)) {
				$sql .= $column[0]['dropdown_sql_from'];
			} else {
				$sql .= $column[0]['dropdown_table'];
			}
			if (strlen($column[0]['dropdown_sql_where']) > 0) {
				$sql .= ' WHERE ' . $column[0]['dropdown_sql_where'];
			}
			$sql .= ' ORDER BY ';
			if (strlen($column[0]['dropdown_sql_orderby'])) {
				$sql .= $column[0]['dropdown_sql_orderby'];
			} else {
				$sql .= $column[0]['dropdown_name_column'];
			}

			$result = $this->adapter->query($sql);
		}

		return $result;
	}

} 