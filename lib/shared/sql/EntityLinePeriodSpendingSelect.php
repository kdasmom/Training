<?php

namespace NP\shared\sql;

use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * A custom Select object to use as a subquery to find how much has been spent on invoices for a certain budget
 *
 * @author Thomas Messier
 */
class EntityLinePeriodSpendingSelect extends Select {
	
	public function __construct($table, $budgetCompareWithTax, $outerTable) {
		parent::__construct();

		$table = strtolower($table);

		$tableAlias = substr($table, 0, 1);
		$lineTable  = ($table == 'invoice') ? 'InvoiceItem' : 'PoItem';
		$module = str_replace('item', '', strtolower($lineTable));
		$lineTableAlias = $tableAlias . 'i' . '_variance';

		$outerTable = strtolower($outerTable);
		$outerTableAlias = substr($outerTable, 0, 1) . 'i';

		$tableAlias = $tableAlias . '_variance';

		$joinClass = "\\NP\\" . $module . "\\sql\\join\\" . $lineTable . ucfirst($table) . "Join";
		
		$lineTable = strtolower($lineTable);

		$colSql = "
			ISNULL(
				SUM(
		";

		if ($budgetCompareWithTax == '1') {
			$colSql .= "ISNULL({$lineTableAlias}.{$lineTable}_salestax, 0) +";
		}

		$colSql .= "
					ISNULL({$lineTableAlias}.{$lineTable}_shipping, 0) + ISNULL({$lineTableAlias}.{$lineTable}_amount, 0)
				),
				0
			)
		";

		$this->column(new Expression($colSql), "{$table}_spent")
			->from(array($lineTableAlias=>$lineTable))
			->join(new $joinClass(array(), Select::JOIN_INNER, $tableAlias, $lineTableAlias))
			->whereEquals("{$lineTableAlias}.{$lineTable}_period", "{$outerTableAlias}.{$outerTable}_period")
			->whereEquals("{$lineTableAlias}.glaccount_id", "{$outerTableAlias}.glaccount_id")
			->whereEquals("{$lineTableAlias}.property_id", "{$outerTableAlias}.property_id");

		if ($table == 'invoice') {
			$this->whereIn("{$tableAlias}.invoice_status", "'draft', 'posted', 'paid', 'rejected', 'void'");
		} else {
			$this->whereIn("{$tableAlias}.purchaseorder_status", "'draft', 'closed', 'rejected'")
				->whereNest('OR')
				->whereNotEquals("{$lineTableAlias}.reftable_name", "'invoiceitem'")
				->whereIsNull("{$lineTableAlias}.reftable_name")
				->whereUnnest();
		}
	}
}