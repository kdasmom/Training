<?php

namespace NP\shared\sql;

use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * A custom Select object for Invoice, PO, and Receipt records with some shortcut methods
 *
 * @author Thomas Messier
 */
class EntityLineBudgetSelect extends Select {
	
	public function __construct($outerTable, $col='budget_amount', $outerTableAlias=null) {
		parent::__construct();

		$outerTable = strtolower($outerTable);
		$outerTable = ($outerTable == 'invoice') ? 'invoiceitem' : 'poitem';
		if ($outerTableAlias === null) {
			$outerTableAlias = substr($outerTable, 0, 1) . 'i';
		}
		$alias = 'b_variance';

		$this->column("b.{$col}")
			->from(array($alias=>'budget'))
			->whereEquals("{$alias}.budget_period", "{$outerTableAlias}.{$outerTable}_period")
			->whereEquals("{$alias}.glaccount_id", "{$outerTableAlias}.glaccount_id")
			->whereEquals("{$alias}.property_id", "{$outerTableAlias}.property_id")
			->limit(1);
	}
}