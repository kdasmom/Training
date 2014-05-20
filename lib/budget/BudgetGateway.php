<?php

namespace NP\budget;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Insert;
use NP\core\db\Select;
use NP\core\db\Expression;
use NP\property\FiscalCalService;

/**
 * Gateway for the BUDGET table
 *
 * @author Thomas Messier
 */
class BudgetGateway extends AbstractGateway {
	protected $fiscalCalService;

	public function __construct(Adapter $adapter, FiscalCalService $fiscalCalService) {
		$this->fiscalCalService = $fiscalCalService;

		parent::__construct($adapter);
	}

	public function createMissingBudgets($entityType, $entity_id=null) {
		if ($entityType == 'po') {
			$itemTable = 'poitem';
			$entityTable = 'purchaseorder';
		} else if ($entityType == 'invoice') {
			$itemTable = 'invoiceitem';
			$entityTable = 'invoice';
		} else {
			throw new \NP\core\Exception("Invalid value '{$entityType}' for the \$entityType argument. Valid values are 'po' and 'invoice'");
		}

		$now = \NP\util\Util::formatDateForDB();

		$insert = new Insert();
		$select = Select::get()
			->distinct()
			->columns(array(
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
				Select::get()->from(array('b'=>'budget'))
							->whereEquals('gy.glaccountyear_id', 'b.glaccountyear_id')
							->whereEquals("e.{$entityTable}_period", 'b.budget_period')
			);

		$params = [];
		if (!empty($entity_id)) {
			$select->whereEquals("e.{$entityTable}_id", '?');
			$params[] = $entity_id;
		}
		
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
				->values($select);

		$this->adapter->query($insert, $params);
	}

	public function findMtdOverBudgetCategories($countOnly, $property_id, $pageSize=null, $page=null, $sort="category_name") {
		$accountingPeriod = $this->fiscalCalService->getAccountingPeriod($property_id);
		$accountingYear = $accountingPeriod->format('Y');
		$accountingPeriod = $accountingPeriod->format('Y-m-d');

		$setupSql = $this->getBudgetOverageSetupSql() . "
			INSERT INTO @glyear 
			SELECT
				glaccountyear_id,
				glaccount_id,
				glaccountyear_year,
				property_id
			FROM glaccountyear
			WHERE glaccountyear_year = {$accountingYear}
				AND property_id = @in_property_id
			
			INSERT INTO @budget 
			SELECT
				b.budget_amount,
				b.oracle_actual,
				b.glaccountyear_id,
				b.budget_period
			FROM budget b 
				INNER JOIN @glyear gly ON b.glaccountyear_id = gly.glaccountyear_id
			WHERE b.budget_period = '{$accountingPeriod}'
				AND b.budget_status = 'active'
			
			INSERT INTO @invoiceitem
			SELECT
				ISNULL(SUM(ISNULL(i.invoiceitem_salestax, 0) + ISNULL(i.invoiceitem_shipping, 0) + ISNULL(i.invoiceitem_amount, 0)), 0),
				i.glaccount_id
			FROM invoiceitem i 
				INNER JOIN invoice iv ON i.invoice_id = iv.invoice_id
			WHERE i.invoiceitem_period = '{$accountingPeriod}' 
				AND i.property_id = @in_property_id 
				AND iv.invoice_status NOT IN ('draft','posted', 'paid','rejected', 'void')
			GROUP BY i.glaccount_id
			
			INSERT INTO @poitem
			SELECT
				ISNULL(SUM(ISNULL(p.poitem_salestax, 0) + ISNULL(p.poitem_shipping, 0) + ISNULL(p.poitem_amount, 0)), 0),
				p.glaccount_id
			FROM poitem p 
				INNER JOIN purchaseorder po ON p.purchaseorder_id = po.purchaseorder_id
			WHERE p.poitem_period = '{$accountingPeriod}' 
				AND p.property_id = @in_property_id
				AND po.purchaseorder_status NOT IN ('draft','closed','rejected')
				AND (
						p.reftable_name <> 'invoiceitem'
						OR p.reftable_name IS NULL
				)
			GROUP BY p.glaccount_id
		";

		$select = $this->getBudgetOverageSelect($sort);

		$params = array($property_id);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			$totalRows = $this->getBudgetOverageCount($select, $setupSql, $params);
			
			// Limit the original query to the page needed
			$select->limit($pageSize);
			if ($page !== null) {
				$select->offset($pageSize * ($page - 1));
			}
			
			$selectRes = $this->adapter->query($setupSql . " " . $select->toString(), $params);
			
			return array(
				'total' => $totalRows,
				'data'  => $selectRes
			);
		} else if ($countOnly == 'true') {
			return $this->getBudgetOverageCount($select, $setupSql, $params);
		} else {
			return $this->adapter->query($setupSql . " " . $select->toString(), $params);
		}
	}

	public function findYtdOverBudgetCategories($countOnly, $property_id, $pageSize=null, $page=null, $sort="category_name") {
		$accountingPeriod = $this->fiscalCalService->getAccountingPeriod($property_id);
		$accountingYear = $accountingPeriod->format('Y');
		$accountingMonth = $accountingPeriod->format('m');
		$accountingPeriod = $accountingPeriod->format('Y-m-d');

		$setupSql = $this->getBudgetOverageSetupSql() . "
			DECLARE @in_asp_client_id int;	
			DECLARE @out_year smallint;
			DECLARE @out_start_period smallint;
			DECLARE @out_start_period_name varchar(64);

			SELECT TOP 1 @in_asp_client_id = asp_client_id FROM client;

			EXEC PROPERTY_FISCALYEAR @in_asp_client_id, @in_property_id, NULL, @out_year OUTPUT, @out_start_period OUTPUT, @out_start_period_name OUTPUT
			
			INSERT INTO @glyear 
			SELECT
				glaccountyear_id,
				glaccount_id,
				glaccountyear_year,
				property_id
			FROM glaccountyear
			WHERE glaccountyear_year IN (
					SELECT DISTINCT YEAR(period) 
					FROM dbo.FiscalPeriodListing(@out_start_period, @out_year, {$accountingMonth})) 
				AND property_id = @in_property_id
			
			INSERT INTO @budget 
			SELECT
				b.budget_amount,
				b.oracle_actual,
				b.glaccountyear_id,
				b.budget_period
			FROM budget b 
				INNER JOIN @glyear gly ON b.glaccountyear_id = gly.glaccountyear_id
			WHERE b.budget_period IN (SELECT period FROM dbo.FiscalPeriodListing(@out_start_period, @out_year, {$accountingMonth}))
				AND b.budget_status = 'active'
			
			INSERT INTO @invoiceitem
			SELECT
				ISNULL(SUM(ISNULL(i.invoiceitem_salestax, 0) + ISNULL(i.invoiceitem_shipping, 0) + ISNULL(i.invoiceitem_amount, 0)), 0),
				i.glaccount_id
			FROM invoiceitem i 
				INNER JOIN invoice iv ON i.invoice_id = iv.invoice_id
			WHERE i.invoiceitem_period IN (SELECT period FROM dbo.FiscalPeriodListing(@out_start_period, @out_year, {$accountingMonth}))
				AND i.property_id = @in_property_id 
				AND iv.invoice_status NOT IN ('draft','posted', 'paid','rejected', 'void')
			GROUP BY i.glaccount_id
			
			INSERT INTO @poitem
			SELECT
				ISNULL(SUM(ISNULL(p.poitem_salestax, 0) + ISNULL(p.poitem_shipping, 0) + ISNULL(p.poitem_amount, 0)), 0),
				p.glaccount_id
			FROM poitem p 
				INNER JOIN purchaseorder po ON p.purchaseorder_id = po.purchaseorder_id
			WHERE p.poitem_period IN (SELECT period FROM dbo.FiscalPeriodListing(@out_start_period, @out_year, {$accountingMonth}))
				AND p.property_id = @in_property_id
				AND po.purchaseorder_status NOT IN ('draft','closed','rejected')
				AND (
						p.reftable_name <> 'invoiceitem'
						OR p.reftable_name IS NULL
				)
			GROUP BY p.glaccount_id
		";

		$select = $this->getBudgetOverageSelect($sort);

		$params = array($property_id);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			$totalRows = $this->getBudgetOverageCount($select, $setupSql, $params);

			$select->limit($pageSize);
			if ($page !== null) {
				$select->offset($pageSize * ($page - 1));
			}
			
			$selectRes = $this->adapter->query($setupSql . " " . $select->toString(), $params);
			
			return array(
				'total' => $totalRows,
				'data'  => $selectRes
			);
		} else if ($countOnly == 'true') {
			return $this->getBudgetOverageCount($select, $setupSql, $params);
		} else {
			return $this->adapter->query($setupSql . " " . $select->toString(), $params);
		}
	}

	protected function getBudgetOverageCount($select, $setupSql, $params) {
		$selectTotal = clone $select;
		$selectTotal->order(null);

		$selectTotal = $setupSql . " SELECT count(*) AS totalRows FROM (" . $selectTotal->toString() . ") AS countTable";
		$totalRes = $this->adapter->query($selectTotal, $params);

		return $totalRes[0]['totalRows'];
	}

	protected function getBudgetOverageSetupSql() {
		return "
			SET NOCOUNT ON
			
			DECLARE @in_property_id int

			SET @in_property_id = ?

			DECLARE @glyear TABLE (
				glaccountyear_id int,
				glaccount_id int,
				glaccount_year int,
				property_id int
			)

			DECLARE @budget TABLE (
				budget_amount float,
				oracle_actual float,
				glaccountyear_id int,
				budget_period datetime
			)
			
			DECLARE @invoiceitem TABLE (
				amount float,
			 	glaccount_id int
			 )
			
			DECLARE @poitem TABLE (
				amount float,
				glaccount_id int
			)
		";
	}

	protected function getBudgetOverageSelect($sort) {
		$budgetAllocatedSql = "
			CAST(SUM(ISNULL(b.oracle_actual, 0)) AS float) +
				(
					SELECT
						ISNULL(SUM(ISNULL(amount, 0)), 0)
					FROM @invoiceitem i 
						INNER JOIN tree t3 ON i.glaccount_id = t3.tablekey_id and t3.table_name = 'glaccount'
					WHERE t3.tree_parent = t2.tree_id
				) + 
				(
					SELECT
						ISNULL(SUM(ISNULL(amount, 0)), 0)
					FROM @poitem p			
						INNER JOIN tree t3 ON p.glaccount_id = t3.tablekey_id and t3.table_name = 'glaccount'
					WHERE t3.tree_parent = t2.tree_id
				)
		";

		$budgetVarianceSql = "SUM(ISNULL(b.budget_amount, 0)) - (" . $budgetAllocatedSql . ")";
		
		return Select::get()->columns(array(
									'budget_total'  => new Expression("SUM(ISNULL(b.budget_amount, 0))"),
									'budget_allocated' => new Expression($budgetAllocatedSql),
									'budget_variance' => new Expression($budgetVarianceSql)
							))
							->from(array('gl'=>'glaccount'))
							->join(
								array('gly'=>'@glyear'),
								"gl.glaccount_id = gly.glaccount_id",
								array()
							)
							->join(
								array('b'=>'@budget'),
								"gly.glaccountyear_id = b.glaccountyear_id",
								array()
							)
							->join(
								array('t'=>'tree'),
								"gl.glaccount_id = t.tablekey_id and t.table_name = 'glaccount'",
								array()
							)
							->join(
								array('t2'=>'tree'),
								"t.tree_parent = t2.tree_id",
								array()
							)
							->join(
								array('gl2'=>'glaccount'),
								"t2.tablekey_id = gl2.glaccount_id",
								array('category_name' =>'glaccount_name')
							)
							->group("gl2.glaccount_name, t2.tree_id")
							->having("{$budgetVarianceSql} < 0")
							->order($sort);
	}

	/**
	 * 
	 */
	public function getAccountBudgetByPeriod($glaccount_id, $property_id, $start_period, $end_period=null) {
		$select = Select::get()
					->columns([
						'actual_amount' => new Expression('ISNULL(b.oracle_actual, 0)'),
						'budget_amount' => new Expression('ISNULL(b.budget_amount, 0)')
					])
					->from(['gy'=>'glaccountyear'])
						->join(new sql\join\GlAccountYearBudgetJoin([]))
					->whereEquals('gy.glaccount_id', '?')
					->whereEquals('gy.property_id', '?');

		$params = [$glaccount_id, $property_id];
		if (!empty($end_period)) {
			$select->whereBetween('b.budget_period', '?', '?');
			array_push($params, $start_period, $end_period);
		} else {
			$select->whereEquals('b.budget_period', '?');
			$params[] = $start_period;
		}

		$res = $this->adapter->query($select, $params);
		
		$actual_amount = 0;
		$budget_amount = 0;
		if (count($res)) {
			$actual_amount = (float)$res[0]['actual_amount'];
			$budget_amount = (float)$res[0]['budget_amount'];
		}

		return [
			'actual_amount' => $actual_amount,
			'budget_amount' => $budget_amount
		];
	}

	/**
	 * 
	 */
	public function getCategoryBudgetByPeriod($category_id, $property_id, $start_period, $end_period=null) {
		$select = Select::get()
					->columns([
						'actual_amount' => new Expression('ISNULL(SUM(ISNULL(b.oracle_actual, 0)), 0)'),
						'budget_amount' => new Expression('ISNULL(SUM(ISNULL(b.budget_amount, 0)), 0)')
					])
					->from(['gy'=>'glaccountyear'])
						->join(new sql\join\GlAccountYearBudgetJoin([]))
						->join(new \NP\gl\sql\join\GlAccountTreeJoin([], Select::JOIN_INNER, 'tr', 'b'))
						->join(new \NP\system\sql\join\TreeTreeParentJoin([]))
					->whereEquals('tr2.tablekey_id', '?')
					->whereEquals('gy.property_id', '?')
					->whereEquals('b.budget_status', "'active'");

		$params = [$category_id, $property_id];
		if (!empty($end_period)) {
			$select->whereBetween('b.budget_period', '?', '?');
			array_push($params, $start_period, $end_period);
		} else {
			$select->whereEquals('b.budget_period', '?');
			$params[] = $start_period;
		}

		$res = $this->adapter->query($select, $params);
		$res = $res[0];

		$res['actual_amount'] = (float)$res['actual_amount'];
		$res['budget_amount'] = (float)$res['budget_amount'];

		return $res;
	}
}

?>