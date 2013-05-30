<?php

namespace NP\budget;

use NP\core\AbstractGateway;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Expression;

/**
 * Gateway for the BUDGET table
 *
 * @author Thomas Messier
 */
class BudgetGateway extends AbstractGateway {

	public function createMissingBudgets($entityType) {
		if ($entityType == 'po') {
			$itemTable = 'poitem';
			$entityTable = 'purchaseorder';
		} else if ($entityType == 'invoice') {
			$itemTable = 'invoiceitem';
			$entityTable = 'invoice';
		} else {
			throw new \NP\core\Exception("Invalid value '{$entityType}' for the \$entityType argument. Valid values are 'po' and 'invoice'");
		}

		$insert = new Insert();
		$select = new Select();
		$subSelect = new Select();

		$now = \NP\util\Util::formatDateForDB();
		
		$insert->into('budget')
				->columns(array(
					'glaccount_id',
					'oracle_period_name',
					'budget_status',
					'budget_createddatetime',
					'budget_amount',
					'budget_allocated',
					'budget_invoiced',
					'budget_note',
					'budget_period',
					'glaccountyear_id'
				))
				->values(
					$select->columns(array(
								'glaccount_id',
								new Expression("UPPER(LEFT(DATENAME(month, e.{$entityTable}_period), 3)) + '-' + RIGHT(YEAR(e.{$entityTable}_period), 2)"),
								new Expression("'active'"),
								new Expression("'{$now}'"),
								new Expression('0'),
								new Expression('0'),
								new Expression('0'),
								new Expression("''")
							))
							->from(array('i'=>$itemTable))
							->join(array('e'=>$entityTable),
									"i.{$entityTable}_id = e.{$entityTable}_id",
									array("{$entityTable}_period"))
							->join(array('gy'=>'glaccountyear'),
									"gy.glaccountyear_year = YEAR(e.{$entityTable}_period) AND gy.glaccount_id = i.glaccount_id AND gy.property_id = i.property_id",
									array('glaccountyear_id'))
							->whereIsNotNull('gy.glaccountyear_id')
							->whereIsNotNull("e.{$entityTable}_period")
							->whereNotExists(
								$subSelect->from(array('b'=>'budget'))
											->whereEquals('gy.glaccountyear_id', 'b.glaccountyear_id')
											->whereEquals("e.{$entityTable}_period", 'b.budget_period')
							)
				);

		$this->adapter->query($insert);
	}

}

?>