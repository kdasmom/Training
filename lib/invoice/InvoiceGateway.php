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
					'property_id',
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
					'PriorityFlag_ID_Alt',
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
				->columnAmount()
				->join(new sql\join\InvoiceVendorsiteJoin(array('vendorsite_id')))
				->join(new \NP\vendor\sql\join\VendorsiteVendorJoin())
				->join(new sql\join\InvoicePropertyJoin())
				->join(new sql\join\InvoiceRecauthorJoin())
				->join(new \NP\user\sql\join\RecauthorUserprofileJoin(array('userprofile_id','userprofile_username')))
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
		$select->allColumns()
				->columnAmount()
				->columnCreatedBy()
				->join(new sql\join\InvoiceVendorsiteJoin(array('vendorsite_id')))
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

		$select->distinct();
		$where = new Where();

		$where->equals('i.invoice_status', "'forapproval'")
			->equals('a.approvetype_id', 1)
			->equals('a.approve_status', "'active'")
			->nest('OR')
			->isNull('a.wftarget_id')
			->in(
				Select::get()->from(array('wft'=>'WFRULETARGET'))
							->column('tablekey_id')
							->where("
								wft.wfruletarget_id = a.wftarget_id 
								AND wft.table_name = 'property'
							"),
				$propertyFilterSelect)
			->unnest();

		if ($isAdmin) {
			$where->nest('OR')
				->exists(Select::get()->from(array('ii'=>'invoiceitem'))
									->column(new Expression('1'))
									->whereEquals('ii.invoice_id', 'i.invoice_id')
									->whereIn('ii.property_id', $propertyFilterSelect->toString()))
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

		$select->join(new sql\join\InvoiceApproveJoin())
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
			$select->allColumns()
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
			->join(new sql\join\InvoiceVendorsiteJoin())
			->join(new \NP\vendor\sql\join\VendorsiteVendorJoin())
			->join(new sql\join\InvoicePriorityFlagJoin())
			->join(new sql\join\InvoiceVendorOneTimeJoin())
			->whereIn('i.property_id', $propertyFilterSelect);

		return $select;
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

    public function getInvoiceRef($invoice_id) {
        $select = new \NP\core\db\Select();
        $select
            ->column('invoice_ref')
            ->from('INVOICE')
            ->whereEquals('invoice_id', $invoice_id)
        ;

        $result = $this->adapter->query($select);
        if (!empty($result) && !empty($result[0]) && !empty($result[0]['invoice_ref'])) {
            return $result[0]['invoice_ref'];
        }
        return null;
    }

    /**
     * Get Template for image index table.
     * 
     * @param int $vendorsite_id Vendorsite id.
     * @param int $property_id Propery id.
     * @param int $utilityaccount_accountnumber Utility account number.
     * @return [] List of templates.
     */
    public function getTemplateForImageIndex($vendorsite_id, $property_id, $utilityaccount_accountnumber) {
        if (empty($vendorsite_id)) 
            return;
        if (empty($property_id)) 
            return;
        
        $select01 = new Select();
        $select01
            ->column('property_name')
            ->from('property')
            ->where(
                Where::get()
                    ->equals('property_id', 'i.property_id')
            )
        ;

        $select02 = new Select();
        $select02
            ->column('property_id')
            ->from('property')
            ->where(
                Where::get()
                    ->equals('integration_package_id', 'v.integration_package_id')
            )
        ;

        $columns = [
            'invoice_id' => 'invoice_id',
            'invoice_ref' => 'invoice_ref',
            'template_name' => 'template_name',
            'property_name' => $select01
        ];
        if (!empty($utilityaccount_accountnumber)) {
            $select03 = new Select();
            $select03
                ->from(['ii' => 'invoiceitem'])
                    ->join(['ua' => 'utilityaccount'], 'ii.utilityaccount_id = ua.utilityaccount_id', [], Select::JOIN_INNER)
                ->where(
                    Where::get()
                        ->equals('ii.invoice_id', 'i.invoice_id')
                        ->equals('ua.utilityaccount_accountnumber', $utilityaccount_accountnumber)
                )
            ;
        }

        $select = new Select();
        $select
            ->columns($columns)
            ->from(['i' => 'invoice'])
                ->join(['vs' => 'vendorsite'], 'vs.vendorsite_id=i.paytablekey_id AND i.paytable_name=\'vendorsite\'', [], Select::JOIN_INNER)
                ->join(['v' => 'vendor'], 'v.vendor_id=vs.vendor_id ', ['integration_package_id'], Select::JOIN_INNER)
        ;
        $where = new Where();
        $where
            ->equals('i.invoice_status', '\'draft\'')
            ->equals('vs.vendorsite_id', $vendorsite_id)
            ->nest('OR')
                ->equals('i.property_id', 0)
                ->nest()
                    ->in('i.property_id', $select02)
                    ->equals('i.property_id', $property_id)
                ->unnest()
            ->unnest()
        ;
        if (!empty($utilityaccount_accountnumber)) {
            $where->exists($select03);
        }
        $select->where($where);

        return $this->adapter->query($select);
    }
}
