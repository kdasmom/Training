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

		$selectColumns->from(['pt' => $fromtable])
			->columns([
				'column_data'	=> new Expression("CASE
					WHEN pt.universal_field_status = 0 THEN {$table[0]['picklist_data_column']} + ' (Inactive)'
					ELSE {$table[0]['picklist_data_column']}
				END"),
				'column_pk_data'	=> $table[0]['picklist_pk_column'],
				'column_status'		=> 'universal_field_status'
			]);

		$sql = $selectColumns->toString() . ' ' . $whereClause . ' order by ' . (!$table[0]['picklist_table_orderby_sql'] ? $table[0]['picklist_data_column'] : $table[0]['picklist_table_orderby_sql']);

		$columns = $this->adapter->query($sql);

		return $columns;

		$select->from(['p' => 'picklist_column'])
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
				'readonly_flag']
			)
			->where(
				[
					'picklist_table_id'		=> '?',
					'asp_client_id'			=> '?'
				]
			);

		return $this->adapter->query($select, [$tablekey_id, $asp_client_id]);
	}
} 