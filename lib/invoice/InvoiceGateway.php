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
		$select->columns(array(
					'invoice_id',
					'invoicepayment_type_id',
					'invoice_ref',
					'invoice_datetm',
					'invoice_createddatetm',
					'invoice_duedate',
					'invoice_status',
					'invoice_note',
					'invoice_submitteddate',
					'invoice_startdate',
					'invoice_endate',
					'invoice_reject_note',
					'invoice_period',
					'control_amount',
					'invoice_taxallflag',
					'invoice_budgetoverage_note',
					'invoice_cycle_from',
					'invoice_cycle_to',
					'priorityflag_id_alt',
					'invoice_neededby_datetm',
					'vendor_code',
					'remit_advice',
					'universal_field1',
					'universal_field2',
					'universal_field3',
					'universal_field4',
					'universal_field5',
					'universal_field6',
					'universal_field7',
					'universal_field8',
					'paytablekey_id'
				))
				->columnInvoiceAmount()
				->joinVendor(null, null)
				->joinProperty(array(
					'property_id',
					'property_id_alt',
					'property_name'
				))
				->joinUserprofile(array(
					'userprofile_id',
					'userprofile_username'
				))
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
	 * Get forwards associated to an invoice, if any
	 *
	 * @param  int $invoice_id
	 * @return array           Array with forward records in a specific format
	 */
	public function findForwards($invoice_id) {
		$select = new Select(array('ipf'=>'INVOICEPOFORWARD'));
		
		$select->columns(
					array(
						"invoicepo_forward_id"=>"invoicepo_forward_id",
						"forward_datetm"=>"forward_datetm",
						"forward_to_email"=>"forward_to_email",
						"forward_from_name"=>new Expression("
							isNull(pf.person_firstname,'') + ' ' + isNull(pf.person_lastname,'') + 
							CASE
								WHEN ipf.forward_from_userprofile_id <> ISNULL(ipf.from_delegation_to_userprofile_id, 0) 
									AND ipf.forward_from_userprofile_id IS NOT NULL 
									AND ipf.from_delegation_to_userprofile_id IS NOT NULL THEN
										' (done by ' + u2.userprofile_username + ' on behalf of ' + upf.userprofile_username + ')'
								ELSE ''
							END
						"),
						"forward_to_name"=>new Expression("isNull(pt.person_firstname,'') + ' ' + isNull(pt.person_lastname,'')")
					)
				)
				->join(array('upf' => 'USERPROFILE'),
						'upf.userprofile_id = ipf.forward_from_userprofile_id',
						array())
				->join(array('uprf' => 'USERPROFILEROLE'),
						'uprf.userprofile_id = upf.userprofile_id',
						array())
				->join(array('sf' => 'staff'),
						'uprf.tablekey_id = sf.staff_id',
						array())
				->join(array('pf' => 'person'),
						'pf.person_id = sf.person_id',
						array())
				->join(array('upt' => 'USERPROFILE'),
						'upt.userprofile_id = ipf.forward_to_userprofile_id',
						array(),
						Select::JOIN_LEFT)
				->join(array('uprt' => 'USERPROFILEROLE'),
						'uprt.userprofile_id = upt.userprofile_id',
						array(),
						Select::JOIN_LEFT)
				->join(array('st' => 'staff'),
						'uprt.tablekey_id = st.staff_id',
						array(),
						Select::JOIN_LEFT)
				->join(array('pt' => 'person'),
						'pt.person_id = st.person_id',
						array(),
						Select::JOIN_LEFT)
				->join(array('u2' => 'userprofile'),
						'ipf.from_delegation_to_userprofile_id = u2.userprofile_id',
						array(),
						Select::JOIN_LEFT)
				->where("
					ipf.table_name = 'invoice' 
					AND ipf.tablekey_id = ?
				");
		
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
		$select->columns(array(
					'invoice_id',
					'invoice_ref',
					'invoice_createddatetm',
					'invoice_datetm',
					'invoice_duedate'
				))
				->columnInvoiceAmount()
				->joinVendor(array('vendorsite_id'), array('vendor_name'))
				->joinProperty(array('property_name'))
				->where(
					"i.invoice_status = 'open'
					AND vs.vendorsite_status IN ('active','inactive','rejected')
					AND p.property_id IN (" . $propertyFilterSelect->toString() . ")"
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
		$propertyContext = new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection);
		$propertyFilterSelect = new PropertyFilterSelect($propertyContext);

		$select = new sql\InvoiceSelect();
		$select->columns(array(
					'invoice_id',
					'invoice_ref',
					'invoice_createddatetm',
					'invoice_datetm',
					'invoice_duedate'
				))
				->columnInvoiceAmount()
				->columnRejectedDate()
				->columnRejectedBy()
				->columnCreatedBy()
				->joinVendor(array('vendorsite_id'), array('vendor_name'))
				->joinProperty(array('property_name'))
				->where(
					"i.invoice_status = 'rejected'
					AND vs.vendorsite_status IN ('active','inactive','rejected')
					AND p.property_id IN (" . $propertyFilterSelect->toString() . ")"
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
	 * See getInvoicesToApprove() function in InvoiceService
	 */
	public function findInvoicesToApprove($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$role = $this->roleGateway->findByUser($userprofile_id);
		$isAdmin = ($role['is_admin_role'] == 1) ? true : false;
		$approveSubSelect = new Select();
		$approveSubSelect->from(array('a'=>'approve'))
						->columns(array(
							'tablekey_id',
							'approve_datetm',
							'wftarget_id',
							'forwardto_tablekeyid',
							'forwardto_tablename'
						))
						->join(array('i2' => 'invoice'),
							"a.tablekey_id = i2.invoice_id AND a.table_name = 'invoice'",
							array())
						->where("
							a.approvetype_id = 1
							AND a.approve_status = 'active'
							AND i2.invoice_status = 'forapproval'
						");

		$select = new sql\InvoiceSelect();
		$select->distinct();
		$where = new Where();

		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs')
					->column('invoice_id');
		} else {
			$select->columns(array(
								'invoice_id',
								'invoice_ref',
								'invoice_createddatetm',
								'invoice_datetm',
								'invoice_duedate'
							))
					->column(new Expression('DateDiff(day, a.approve_datetm, getDate())'), 'invoice_pending_days')
					->columnSubjectName()
					->columnInvoiceAmount()
					->joinVendorOneTime()
					->order($sort);
		}

		$targetSubSelect = new Select();
		$targetSubSelect->from(array('wft'=>'WFRULETARGET'))
						->column('tablekey_id')
						->where("
							wft.wfruletarget_id = a.wftarget_id 
							AND wft.table_name = 'property'
						");

		$where->equals('i.invoice_status', "'forapproval'")
			->nest('OR')
			->isNull('a.wftarget_id')
			->in($targetSubSelect, $propertyFilterSelect)
			->unnest();

		if ($isAdmin) {
			$invoiceitemSubSelect = new Select();
			$invoiceitemSubSelect->from(array('ii'=>'invoiceitem'))
								->column(new Expression('1'))
								->where("
									ii.invoice_id = i.invoice_id 
									AND ii.property_id IN (" . $propertyFilterSelect->toString() . ")
								");

			$where->nest('OR')
				->exists($invoiceitemSubSelect)
				->in('i.property_id', $propertyFilterSelect);
		} else {
			$where->nest('OR')
				->nest()
				->equals('a.forwardto_tablekeyid', $role['role_id'])
				->equals('a.forwardto_tablename', "'role'")
				->unnest()
				->nest()
				->in('a.forwardto_tablekeyid', $role['userprofilerole_id'])
				->equals('a.forwardto_tablename', "'userprofilerole'");
		}

		$select->joinVendor(array('vendorsite_id'), array('vendor_name'))
				->joinProperty(array('property_name'))
				->join(array('a'=>$approveSubSelect),
					'i.invoice_id = a.tablekey_id',
					array())
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
	 * See getInvoicesOnHold() function in InvoiceService
	 */
	public function findInvoicesOnHold($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$select = new sql\InvoiceSelect();
		$select->distinct();

		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs')
					->column('invoice_id');
		} else {
			$select->columns(array(
								'invoice_id',
								'invoice_ref',
								'invoice_createddatetm',
								'invoice_datetm',
								'invoice_duedate'
							))
					->column(new Expression('DateDiff(day, a.approve_datetm, getDate())'), 'invoice_days_onhold')
					->column(new Expression('(SELECT userprofile_username FROM USERPROFILE WHERE userprofile_id = a.userprofile_id)'), 'invoice_onhold_by')
					->columnInvoiceAmount()
					->order($sort);
		}

		$approvetypeSubSelect = new Select();
		$approvetypeSubSelect->from('approvetype')
						->column('approvetype_id')
						->where("approvetype_name = 'hold'")
						->limit(1);

		$approveSubSelect = new Select();
		$approveSubSelect->from(array('a'=>'approve'))
						->column('approve_id')
						->where("
							tablekey_id = i.invoice_id 
							AND table_name = 'invoice' 
							AND approvetype_id = (" . $approvetypeSubSelect->toString() . ")
						")
						->order('approve_id DESC')
						->limit(1);

		$select->joinVendor(array('vendorsite_id'), array('vendor_name'))
				->joinProperty(array('property_name'))
				->join(array('a'=>'approve'),
					'i.invoice_id = a.tablekey_id',
					array('invoice_hold_datetm'=>'approve_datetm'))
				->where("
					i.invoice_status = 'hold'
					AND a.approve_id = isNULL((" . $approveSubSelect->toString() . "),0)
					AND (
						i.property_id IN (" . $propertyFilterSelect->toString() . ")
						OR EXISTS (
							SELECT 1
							FROM invoiceitem ii
							WHERE ii.invoice_id = i.invoice_id
								AND ii.property_id IN (" . $propertyFilterSelect->toString() . ")
						)
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
	
	/**
	 * See getInvoicesCompleted() function in InvoiceService
	 */
	public function findInvoicesCompleted($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$select = new sql\InvoiceSelect();
		
		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs');
		} else {
			$jobcodeSubSelect = new Select();
			$jobcodeSubSelect->from(array('jc'=>'jbjobcode'))
							->column(new Expression('1'))
							->join(array('ja'=>'jbjobassociation'),
								'ja.jbjobcode_id = jc.jbjobcode_id',
								array())
							->join(array('ii'=>'invoiceitem'),
								"ja.tablekey_id = ii.invoiceitem_id AND ja.table_name = 'invoiceitem'",
								array())
							->where("ii.invoice_id = i.invoice_id AND jc.jbjobcode_status = 'inactive'")
							->limit(1);

			$select->columns(array(
								'invoice_id',
								'invoice_ref',
								'invoice_datetm',
								'invoice_duedate',
								'invoice_neededby_datetm',
								'invoice_period',
								'priorityflag_id_alt'
							))
					->column(new Expression("ISNULL((" . $jobcodeSubSelect->toString() . "), 0)"), 'invoice_inactive_jobcode')
					->columnInvoiceAmount()
					->columnPendingDays()
					->order($sort);
		}

		$select->joinVendor(array('vendorsite_id'), array('vendor_name'))
				->joinProperty(array('property_name'))
				->where("
					i.invoice_status = 'saved'
					AND i.property_id IN (" . $propertyFilterSelect->toString() . ")
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
	
	/**
	 * See getInvoicesRejected() function in InvoiceService
	 */
	public function findInvoicesRejected($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$select = new sql\InvoiceSelect();
		
		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs');
		} else {
			$select->columns(array(
								'invoice_id',
								'invoice_ref',
								'invoice_datetm',
								'invoice_duedate',
								'invoice_neededby_datetm',
								'priorityflag_id_alt'
							))
					->columnInvoiceAmount()
					->columnPendingDays()
					->order($sort);
		}

		$select->joinVendor(array('vendorsite_id'), array('vendor_name'))
				->joinProperty(array('property_name'))
				->where("
					i.invoice_status = 'rejected'
					AND i.property_id IN (" . $propertyFilterSelect->toString() . ")
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
	
	/**
	 * See getInvoicesByUser() function in InvoiceService
	 */
	public function findInvoicesByUser($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

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

		$select = new sql\InvoiceSelect();
		
		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs');
		} else {
			$select->columns(array(
								'invoice_id',
								'invoice_ref',
								'invoice_datetm',
								'invoice_status',
								'priorityflag_id_alt'
							))
					->columnInvoiceAmount()
					->columnPendingDays()
					->order($sort);
		}

		$now = new \DateTime();
		$nextMonth = new \DateTime();
		$nextMonth->add(new \DateInterval('P1M'));
		$cutoffDate = new \DateTime();
		$interval = new \DateInterval('P45D');
		$interval->invert = 1;
		$cutoffDate->add($interval);

		$select->joinVendor(array('vendorsite_id'), array('vendor_name'))
				->joinProperty(array('property_name'))
				->joinFiscalcal($now->format('Y'))
				->joinFiscalcalMonth($now->format('n'))
				->joinIntegrationPackage()
				->joinIntegrationPackageType(array('integration_package_type_display_name'))
				->where("
					i.property_id IN (" . $propertyFilterSelect->toString() . ")
					AND (
						(
							i.invoice_status NOT IN ('draft','paid') 
							AND i.invoice_createddatetm BETWEEN '{$cutoffDate->format('Y-m-d H:i:s')}' AND '{$now->format('Y-m-d H:i:s')}'
						)
						OR (
							i.invoice_status = 'paid' 
							AND DATEADD(m, {$rollIncrement}, i.invoice_period) >= (
								CASE
									WHEN fm.fiscalcalmonth_cutoff >= {$now->format('j')} THEN '{$now->format('Y')}-{$now->format('m')}-01'
									ELSE '{$nextMonth->format('Y')}-{$nextMonth->format('m')}-01'
								END
							)
						)
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