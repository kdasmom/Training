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
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Update;

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

		$columns = $this->adapter->query($sql);

		return $columns;
	}

	public function getColumnsValue($tablekey_id, $table_name, $asp_client_id, $columnStatus, $column_id) {
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

		$columns['fields'] = $result;
		$columns['values'] = $this->findPicklistValues($column_id, $table[0]['picklist_pk_column'], $table[0]['table_name']);

		return $columns;
	}

	/**
	 * determine datatypes of columns
	 *
	 * @param $table_name
	 * @param $column_name
	 * @return array|bool
	 */
	public function sp_columns($table_name, $column_name = null) {

		if ($column_name) {
			$sql = "exec sp_columns @table_name = {$table_name}, @column_name = {$column_name}";
		} else {
			$sql = "exec sp_columns @table_name = {$table_name}";
		}

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
				$sql .= $column[0]['dropdown_value_column'] . ' as dropdown_value, ' . $column[0]['dropdown_name_column'] . ' as dropdown_display_text FROM ';
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

	/**
	 * Retrieve record for the picklist value
	 *
	 * @param $column_id
	 * @param $column_name
	 * @param $table_name
	 * @return array|bool
	 */
	public function findPicklistValues($column_id, $column_name, $table_name) {
		$select = new Select();

		$select->from(['t' => $table_name])
			->where([$column_name => '?']);

		$result = $this->adapter->query($select, [$column_id]);

		$item = [];
		if (count($result) > 0) {
			foreach ($result[0] as $key => $value) {
				$item[strtolower($key)] = $value;
			}
		}

		return count($item) > 0 ? [$item] : [];
	}

	public function savePicklist($data, $table, $asp_client_id) {
//		select table
		$qry_picklist_tableSelect = new Select();
		$qry_picklist_tableSelect->from(['t' => 'picklist_table'])
			->columns(['picklist_pk_column', 'picklist_data_column', 'picklist_display_column', 'table_name', 'picklist_table_id', 'picklist_table_action_query'])
			->where([
				'picklist_table_id'		=> '?',
				'asp_client_id'			=> '?'
			]);

		$result = $this->adapter->query($qry_picklist_tableSelect, [$table['table_id'], $asp_client_id]);
		$qry_picklist_table = $result[0];



//		select column
		$qry_picklist_columnSelect = new Select();
		$params = [];

		if ($data['column_id'] == 0) {
			$qry_picklist_columnSelect->from(['t' => 'picklist_column'])
				->columns(['picklist_column_id', 'column_name', 'column_name_title', 'readonly_flag'])
				->where([
					'picklist_table_id'		=> '?',
					'asp_client_id'			=> '?'
				])
				->order('column_name');
			$params = [$qry_picklist_table['picklist_table_id'], $asp_client_id];
		} else {
			$qry_picklist_columnSelect->from(['r' => 'picklist_column'])
				->columns(['picklist_column_id', 'column_name', 'column_name_title', 'readonly_flag'])
				->where([
					'picklist_table_id' 	=> '?',
					'asp_client_id'			=> '?',
					'readonly_flag'			=> '?'
				])
				->order('column_name');
			$params = [$qry_picklist_table['picklist_table_id'], $asp_client_id, 0];
		}

		$result = $this->adapter->query($qry_picklist_columnSelect, $params);
		$qry_picklist_column = $result;

		$ColumnSetupPre = $this->sp_columns($qry_picklist_table['table_name']);
		$ExistsAspClientColumn = [];
		foreach ($ColumnSetupPre as $column) {
			if ($column['COLUMN_NAME'] == 'asp_client_id') {
				$ExistsAspClientColumn = $column;
				break;
			}
		}

		if (count($qry_picklist_column) > 0) {
			$columnsSetup = [];

			foreach ($ColumnSetupPre as $column) {
				foreach ($data as $key => $value) {
					if ($key !== 'mode') {
						if ($column['COLUMN_NAME'] == $key) {
							$columnsSetup[] = $column;
						}
					}
				}
			}

			if ($data['universal_field_status'] == PnUniversalFieldGateway::STATUS_DEFAULT) {
				$update = new Update();

				$values = [
					'universal_field_status'		=> 1
				];

				if (count($ExistsAspClientColumn) > 0) {
					$values['asp_client_id'] = $asp_client_id;
				}

				$update->table($qry_picklist_table['table_name'])
					->values($values)
					->where([
						'universal_field_status'	=> '?'
					]);

				$this->adapter->query($update, [PnUniversalFieldGateway::STATUS_DEFAULT]);
			}

//			update unversal_field_status
			if (in_array('universal_field_status', $qry_picklist_column)) {
				if (isset($data['universal_field_status']) && $data['universal_field_status'] == 2) {
					$update = new Update();
					$update->table($qry_picklist_table['table_name'])
						->where(['universal_field_status' => '?']);
					$values = [
						'universal_field_status' => 1
					];

					if (count($ExistsAspClientColumn) > 0) {
						$values[] = ['asp_client_id' => $asp_client_id];
					}

					$result = $this->adapter->query($update, [2]);
				}
			}

//			new item
			if ($data['column_id'] == 0) {
				$dupCount = 0;
				if ($qry_picklist_table['table_name'] == 'GLACCOUNT') {
					$duplicateSelect = new Select();
					$duplicateSelect->from(['g' => 'glaccount'])
						->count(true,'dupCount')
						->where([
							'glaccount_number'				=> '?',
							'integration_package_id'		=> '?'
						]);

					$result = $this->adapter->query($duplicateSelect, [$data['glaccount_number'], $data['integration_package_id']]);

					$dupCount = $result[0]['dupCount'];
				}

	//			no duplicates
				if ($dupCount == 0) {

					$values = [];
					$columns = [];
					$params = [];

					foreach ($qry_picklist_column as $column) {
						foreach ($column as $key => $column_name) {
							if (isset($data[$column_name])) {
								$value = $data[$column_name];

								if (str_replace('&nbsp;', '&', $data[$column_name]) !== '') {
									if (in_array($this->_findColumnType($columnsSetup, $column_name), ['int', 'bigint', 'real', 'money', 'decimal', 'float'])) {
										$value = str_replace('&nbsp;', '&', $data[$column_name]);
									} else {
										$value = str_replace('&nbsp;', '&', str_replace("'", "''", $data[$column_name]));
									}
								}

								$params[] = new Expression('?');
								$values[] = $value;
								$columns[] = $column_name;
							}
						}
					}
					if (count($ExistsAspClientColumn) > 0) {
						$params[] = new Expression('?');
						$columns[] = 'asp_client_id';
						$values[] = $asp_client_id;
					}
					$insert = new Insert();

					$insert->into($qry_picklist_table['table_name'])
						->columns($columns)
						->values(Select::get()->columns($params));

					$result = $this->adapter->query($insert, $values);

					if ($result == 1 && !empty($qry_picklist_table['picklist_table_action_query'])) {
						$lastInsertId = $this->adapter->lastInsertId();
						$update = str_replace('#new_id#', $lastInsertId, $qry_picklist_table['picklist_table_action_query']);
						$this->adapter->query($update);
					}

					return $result;
				} else {
					return [
						'success'		=> false,
						'errors'		=> ['field'=>'global', 'msg'=>'You have duplicates for this value', 'extra'=>null]
					];
				}
			} else {
//				edit column

				$update = new Update();
				$values = [];

				foreach ($qry_picklist_column as $column) {
					foreach ($column as $key => $column_name) {

						if (isset($data[$column_name])) {
							$value = $data[$column_name];

							if (str_replace('&nbsp;', '&', $data[$column_name]) !== '') {
								if (in_array($this->_findColumnType($columnsSetup, $column_name), ['int', 'bigint', 'real', 'money', 'decimal', 'float'])) {
									$value = str_replace('&nbsp;', '&', $data[$column_name]);
								} else {
									$value = "'" . str_replace('&nbsp;', '&', str_replace("'", "''", $data[$column_name])) . "'";
								}
							}

							$values[$column_name] = $value;
						}
					}
				}
				if (count($ExistsAspClientColumn) > 0) {
					$values['asp_client_id'] = $asp_client_id;
				}
				$update->table($qry_picklist_table['table_name'])
						->values($values)
						->where([
						$qry_picklist_table['picklist_pk_column'] => '?'
					]);

				return $this->adapter->query($update, [$data['column_id']]);
			}
		}
	}

	/**
	 * Find column type by column name
	 *
	 * @param $columsType
	 * @param $column_name
	 * @return bool
	 */
	private function _findColumnType($columsType, $column_name) {
		foreach ($columsType as $column) {
			if ($column['COLUMN_NAME'] == $column_name) {
				return $column['TYPE_NAME'];
			}
		}

		return false;
	}

} 