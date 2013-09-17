<?php

namespace NP\invoice\sql;

use NP\core\db\Select;
use NP\core\db\Expression;
use NP\shared\sql\EntityLinePeriodSpendingSelect;

/**
 * A custom Select object for InvoiceItem records with some shortcut methods
 *
 * @author Thomas Messier
 */
class InvoiceItemSelect extends Select {
	
	public function __construct() {
		parent::__construct();
		$this->from(array('ii'=>'invoiceitem'));
	}
	
	/**
	 * Adds the invoice amount subquery as a column
	 *
	 * @param \NP\invoice\sql\InvoiceItemSelect Returns caller object for easy chaining
	 */
	public function columnBudgetVariance($budgetCompareWithTax) {
		$invoiceSubSelect = new EntityLinePeriodSpendingSelect('invoice', $budgetCompareWithTax, 'invoiceitem');
		$poSubSelect = new EntityLinePeriodSpendingSelect('purchaseorder', $budgetCompareWithTax, 'invoiceitem');
		
		return $this->column(new Expression("
			b.budget_amount
			- (
				(" . $invoiceSubSelect->toString() . " )
				+ ( " . $poSubSelect->toString() . " )
				+ b.oracle_actual
			)
		"), 'budget_variance');
	}
}