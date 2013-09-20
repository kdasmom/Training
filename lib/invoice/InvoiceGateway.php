<?php

namespace NP\invoice;

use NP\system\ConfigService;
use NP\property\PropertyContext;
use NP\property\sql\PropertyFilterSelect;

use NP\user\RoleGateway;

use NP\core\AbstractGateway;
use NP\core\db\Select;
use NP\core\db\Update;
use NP\core\db\Where;
use NP\core\db\Adapter;
use NP\core\db\Expression;

/**
 * Gateway for the INVOICE table
 *
 * @author Thomas Messier
 */
class InvoiceGateway extends AbstractGateway {
	
	/**
	 * @var \NP\user\RoleGateway
	 */
	protected $roleGateway;

	/**
	 * @var \NP\system\ConfigService The config service singleton
	 */
	protected $configService;

	/**
	 * @param \NP\core\db\Adapter          $adapter         Database adapter object injected
	 * @param \NP\user\RoleGateway         $roleGateway     UserService object injected
	 */
	public function __construct(Adapter $adapter, RoleGateway $roleGateway) {
		$this->roleGateway      = $roleGateway;
		
		parent::__construct($adapter);
	}
	
	/**
	 * Setter function required by DI to set the config service via setter injection
	 * @param \NP\system\ConfigService $configService
	 */
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}
	
	/**
	 * Overrides the default gateway function and returns a record for the specified invoice ID
	 *
	 * @param  int   $invoice_id ID of the invoice to be retrieved
	 * @return array
	 */
	public function findById($invoice_id, $cols=null) {
		$select = new sql\InvoiceSelect();
		$select->allColumns('i')
				->columnAmount()
				->columnShippingAmount()
				->columnTaxAmount()
				->join(new sql\join\InvoiceVendorsiteJoin())
				->join(new \NP\vendor\sql\join\VendorsiteVendorJoin())
				->join(new sql\join\InvoicePropertyJoin())
				->join(new sql\join\InvoiceRecauthorJoin())
				->join(new \NP\user\sql\join\RecauthorUserprofileJoin(array('userprofile_username')))
				->where('i.invoice_id = ?');
		
		$res = $this->adapter->query($select, array($invoice_id));
		return $res[0];
	}

	/**
	 * Get purchase orders associated to an invoice, if any
	 *
	 * @param  int $invoice_id
	 * @return array           An array filled with associative arrays with purchaseorder_id and purchaseorder_ref keys
	 */
	public function findAssociatedPOs($invoice_id) {
		$select = new Select(array('ii'=>'invoiceitem'));
		
		$select->distinct()
				->columns(array())
				->join(array('pi' => 'poitem'),
						'pi.reftablekey_id = ii.invoiceitem_id',
						array())
				->join(array('p' => 'purchaseorder'),
						'p.purchaseorder_id = pi.purchaseorder_id',
						array('purchaseorder_id','purchaseorder_ref'))
				->where("ii.invoice_id = ?")
				->order('p.purchaseorder_id');
		
		return $this->adapter->query($select, array($invoice_id));
	}
	
	/**
	 * Find open invoices for a user given a certain context filter
	 *
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int    $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int    $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int    $page                        The page for which to return records
	 * @param  string $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                               Array of invoice records
	 */
	public function findOpenInvoices($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$propertyContext = new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection);
		$propertyFilterSelect = new PropertyFilterSelect($propertyContext);

		$select = new sql\InvoiceSelect();
		$select->allColumns('i')
				->columnAmount()
				->columnCreatedBy()
				->join(new sql\join\InvoiceVendorsiteJoin())
				->join(new \NP\vendor\sql\join\VendorsiteVendorJoin())
				->join(new sql\join\InvoicePropertyJoin())
				->where(
					"i.invoice_status = 'open'
					AND vs.vendorsite_status IN ('active','inactive','rejected')
					AND pr.property_id IN (" . $propertyFilterSelect->toString() . ")"
				)
				->order($sort);
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, array(), $pageSize, $page);
		} else {
			return $this->adapter->query($select);
		}
	}
	
	/**
	 * Find rejected invoices for a user given a certain context filter
	 *
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string $contextType                 The context filter type; valid values are 'property','region', and 'all'
	 * @param  int    $contextSelection            The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int    $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int    $page                        The page for which to return records
	 * @param  string $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                               Array of invoice records
	 */
	public function findRejectedInvoices($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		// Just use the same function as the one used for Rejected Invoices dashboard
		return $this->findInvoicesRejected(false, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}
	
	/**
	 * See getInvoicesToApprove() function in InvoiceService
	 */
	public function findInvoicesToApprove($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$role = $this->roleGateway->findByUser($userprofile_id);
		$isAdmin = ($role['is_admin_role'] == 1) ? true : false;

		$select->distinct()
				->join(new sql\join\InvoiceApproveJoin())
				->whereEquals('i.invoice_status', "'forapproval'")
				->whereMerge(
					new \NP\shared\sql\criteria\IsApproverCriteria(
						'invoice',
						$userprofile_id,
						$propertyFilterSelect,
						$isAdmin
					)
				);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'invoice_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}
	
	/**
	 * See getInvoicesOnHold() function in InvoiceService
	 */
	public function findInvoicesOnHold($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$select->distinct();
		$where = new Where();

		if ($countOnly != 'true') {
			$select->column(new Expression('DateDiff(day, a.approve_datetm, getDate())'), 'invoice_days_onhold')
					->column(new Expression('(SELECT userprofile_username FROM USERPROFILE WHERE userprofile_id = a.userprofile_id)'), 'invoice_onhold_by');
		}

		$where->equals('i.invoice_status', "'hold'")
				->equals(
					'a.approve_id',
					new Expression('ISNULL((' .
						Select::get()->column('approve_id')
									->from(array('a2'=>'approve'))
									->whereEquals('a2.tablekey_id', 'i.invoice_id')
									->whereEquals('a2.table_name', "'invoice'")
									->whereEquals('a2.approvetype_id', $select->getApproveTypeSubSelect('hold'))
									->order('approve_id DESC')
									->limit(1)
									->toString()
					. '), 0)')
				)
				->nest('OR')
				->in('i.property_id', $propertyFilterSelect)
				->exists(
					Select::get()->from(array('ii'=>'invoiceitem'))
								->whereEquals('ii.invoice_id', 'i.invoice_id')
								->whereIn('ii.property_id', $propertyFilterSelect)
				);

		$select->join(new sql\join\InvoiceApproveJoin(array('invoice_hold_datetm'=>'approve_datetm')))
				->where($where);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'invoice_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}
	
	/**
	 * See getInvoicesCompleted() function in InvoiceService
	 */
	public function findInvoicesCompleted($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		if ($countOnly != 'true') {
			$select->column(
				new Expression("ISNULL((" .
					Select::get()->column(new Expression('1'))
							->from(array('jc'=>'jbjobcode'))
							->join(array('ja'=>'jbjobassociation'),
								'ja.jbjobcode_id = jc.jbjobcode_id',
								array())
							->join(array('ii'=>'invoiceitem'),
								"ja.tablekey_id = ii.invoiceitem_id AND ja.table_name = 'invoiceitem'",
								array())
							->whereEquals('ii.invoice_id', 'i.invoice_id')
							->whereEquals('jc.jbjobcode_status', "'inactive'")
							->limit(1)
							->toString() 
				. "), 0)"),
				'invoice_inactive_jobcode'
			);
		}

		$select->whereEquals('i.invoice_status', "'saved'");

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'invoice_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}
	
	/**
	 * See getInvoicesRejected() function in InvoiceService
	 */
	public function findInvoicesRejected($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		if ($countOnly != 'true') {
			$select->columnRejectedDate()
					->columnRejectedBy()
					->columnRejectedReason();
		}

		$select->whereEquals('i.invoice_status', "'rejected'");

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'invoice_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}
	
	/**
	 * See getInvoicesByUser() function in InvoiceService
	 */
	public function findInvoicesByUser($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$rollOffType = $this->configService->get('PN.InvoiceOptions.rollOffType', 'currentPeriod');
		switch ($rollOffType) {
			case 'currentPeriod':
				$rollIncrement = 0;
				break;
			case 'twoPeriods':
				$rollIncrement = 1;
				break;
			case 'threePeriods':
				$rollIncrement = 2;
				break;
		}

		$now = new \DateTime();
		$nextMonth = new \DateTime();
		$nextMonth->add(new \DateInterval('P1M'));
		$cutoffDate = new \DateTime();
		$interval = new \DateInterval('P45D');
		$interval->invert = 1;
		$cutoffDate->add($interval);

		$select->join(new \NP\property\sql\join\PropertyFiscalcalJoin())
				->join(new \NP\property\sql\join\FiscalcalFiscalcalMonthJoin())
				->whereNest('OR')
				->whereNest('AND')
				->whereNotIn('i.invoice_status', "'draft','paid'")
				->whereBetween('i.invoice_createddatetm', "'{$cutoffDate->format('Y-m-d H:i:s')}'", "'{$now->format('Y-m-d H:i:s')}'")
				->whereUnnest()
				->whereNest('AND')
				->whereEquals('i.invoice_status', "'paid'")
				->whereExpression("
					DATEADD(m, {$rollIncrement}, i.invoice_period) >= (
						CASE
							WHEN fm.fiscalcalmonth_cutoff >= {$now->format('j')} THEN '{$now->format('Y')}-{$now->format('m')}-01'
							ELSE '{$nextMonth->format('Y')}-{$nextMonth->format('m')}-01'
						END
					)
				");

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'invoice_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	protected function getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort) {
		$select = new sql\InvoiceSelect();
		
		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs')
					->column('invoice_id');
		} else {
			$select->allColumns('i')
					->columnAmount()
					->columnSubjectName()
					->columnPendingDays()
					->columnPendingApprovalDays()
					->columnCreatedBy()
					->columnLastApprovedBy()
					->columnLastApprovedDate()
					->order($sort);
		}

		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$select->join(new sql\join\InvoicePropertyJoin())
			->join(new sql\join\InvoiceVendorsiteJoin(array()))
			->join(new \NP\vendor\sql\join\VendorsiteVendorJoin())
			->join(new sql\join\InvoicePriorityFlagJoin())
			->join(new sql\join\InvoiceVendorOneTimeJoin())
			->whereIn('i.property_id', $propertyFilterSelect);

		return $select;
	}

	/**
	 * 
	 */
	public function isApprover($invoice_id, $userprofile_id) {
		$res = $this->adapter->query(
			Select::get()->from(array('i'=>'invoice'))
						->join(new sql\join\InvoiceApproveJoin())
						->whereEquals('i.invoice_id', '?')
						->whereMerge(
							new \NP\shared\sql\criteria\IsApproverCriteria(
								'invoice',
								$userprofile_id
							)
						),
			array($invoice_id)
		);

		return (count($res)) ? true : false;
	}

	public function rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod) {
		$update = new Update();

		$newAccountingPeriod = \NP\util\Util::formatDateForDB($newAccountingPeriod);
		$oldAccountingPeriod = \NP\util\Util::formatDateForDB($oldAccountingPeriod);

		$update->table('invoice')
				->values(array('invoice_period'=>'?'))
				->whereEquals('invoice_period', '?')
				->whereEquals('property_id', '?')
				->whereNotIn('invoice_status', '?,?,?,?,?');

		$params = array($newAccountingPeriod, $oldAccountingPeriod, $property_id, 'posted', 'paid','sent','submitted', 'void');

		$this->adapter->query($update, $params);
	}
}

?>