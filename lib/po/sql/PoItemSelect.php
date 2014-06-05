<?php

namespace NP\po\sql;

use NP\core\db\Select;
use NP\core\db\Expression;
use NP\shared\sql\EntityLinePeriodSpendingSelect;

/**
 * A custom Select object for PoItem records with some shortcut methods
 *
 * @author Thomas Messier
 */
class PoItemSelect extends Select {
	
	public function __construct() {
		parent::__construct();
		$this->from(array('pi'=>'poitem'));
	}
	
	/**
	 * Adds the invoice amount subquery as a column
	 *
	 * @param \NP\invoice\sql\InvoiceItemSelect Returns caller object for easy chaining
	 */
	public function columnBudgetVariance($budgetCompareWithTax) {
		$invoiceSubSelect = new EntityLinePeriodSpendingSelect('invoice', $budgetCompareWithTax, 'poitem');
		$poSubSelect = new EntityLinePeriodSpendingSelect('purchaseorder', $budgetCompareWithTax, 'poitem');
		
		return $this->column(new Expression("
			ISNULL(b.budget_amount, 0)
			- (
				ISNULL((" . $invoiceSubSelect->toString() . " ), 0)
				+ ISNULL(( " . $poSubSelect->toString() . " ), 0)
				+ ISNULL(b.oracle_actual, 0)
			)
		"), 'budget_variance');
	}
}