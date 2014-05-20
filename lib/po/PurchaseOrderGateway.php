<?php

namespace NP\po;

use NP\core\AbstractGateway;
use NP\core\db\Update;

use NP\property\PropertyContext;
use NP\property\sql\PropertyFilterSelect;
use NP\user\RoleGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

use NP\system\sql\AuditSelect;
use NP\workflow\sql\ApproveSelect;

/**
 * Gateway for the PURCHASEORDER table
 *
 * @author Thomas Messier
 */
class PurchaseOrderGateway extends AbstractGateway {
	protected $tableAlias = 'p';

	protected $roleGateway, $configService, $securityService;

	public function __construct(Adapter $adapter, RoleGateway $roleGateway) {
		$this->roleGateway = $roleGateway;
		
		parent::__construct($adapter);
	}

	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}

	public function setSecurityService(\NP\security\SecurityService $securityService) {
		$this->securityService = $securityService;
	}

	public function findById($purchaseorder_id, $cols=null) {
		$select = new sql\PoSelect();
		$select->allColumns('p')
				->columnAmount()
				->columnShippingAmount()
				->columnTaxAmount()
				->columnCreatedBy()
				->columnLastApprovedBy()
				->columnLastApprovedDate()
				->join(new sql\join\PoVendorsiteJoin())
				->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(['vendor_name','vendor_id_alt','vendor_status','integration_package_id','default_glaccount_id','default_due_date']))
				->join(new \NP\vendor\sql\join\VendorGlAccountJoin())
				->join(new \NP\vendor\sql\join\VendorsiteAddressJoin())
				->join(new \NP\vendor\sql\join\VendorsitePhoneJoin('Main'))
				->join(new sql\join\PoPropertyJoin())
				->join(new \NP\property\sql\join\PropertyAddressJoin([
					'property_address_id'      => 'address_id',
					'property_address_attn'    => 'address_attn',
					'property_address_line1'   => 'address_line1',
					'property_address_line2'   => 'address_line2',
					'property_address_line3'   => 'address_line3',
					'property_address_city'    => 'address_city',
					'property_address_state'   => 'address_state',
					'property_address_country' => 'address_country',
					'property_address_zip'     => 'address_zip',
					'property_address_zipext'  => 'address_zipext'
				], Select::JOIN_LEFT, 'adrp'))
				->join(new \NP\property\sql\join\PropertyPhoneJoin([
					'property_phone_number'      => 'phone_number',
					'property_phone_ext'         => 'phone_ext',
					'property_phone_countrycode' => 'phone_countrycode'
				], Select::JOIN_LEFT, 'php'))
				->join(new sql\join\PoPrintTemplateJoin())
				->join(new sql\join\PoShipToPropertyJoin())
				->join(new sql\join\PoBillToPropertyJoin())
				->join(new sql\join\PoRecauthorJoin())
				->join(new \NP\user\sql\join\RecauthorUserprofileJoin(array('userprofile_username')))
				->where('p.purchaseorder_id = ?');
		
		$res = $this->adapter->query($select, array($purchaseorder_id));
		return $res[0];
	}

	/**
	 * Deprecated: alias for findById
	 */
	public function findPo($purchaseorder_id) {
		return $this->findById($purchaseorder_id);
	}

	/**
	 * Checks if a given user is a valid approver for a given PO
	 *
	 * @param  int     $purchaseorder_id
	 * @param  int     $userprofile_id
	 * @return boolean
	 */
	public function isApprover($purchaseorder_id, $userprofile_id) {
		$res = $this->adapter->query(
			Select::get()->from(array('p'=>'purchaseorder'))
						->join(new sql\join\PoApproveJoin())
						->whereEquals('p.purchaseorder_id', '?')
						->whereMerge(
							new \NP\shared\sql\criteria\IsApproverCriteria(
								'purchaseorder',
								$userprofile_id
							)
						),
			array($purchaseorder_id)
		);

		return (count($res)) ? true : false;
	}

	public function findPosToApprove($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$role = $this->roleGateway->findByUser($userprofile_id);
		$isAdmin = ($role['is_admin_role'] == 1) ? true : false;

		$select->distinct();
		$where = new Where();

		$where->equals('p.purchaseorder_status', "'forapproval'")
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
				->exists(Select::get()->from(array('pi'=>'poitem'))
									->column(new Expression('1'))
									->whereEquals('pi.purchaseorder_id', 'p.purchaseorder_id')
									->whereIn('pi.property_id', $propertyFilterSelect->toString()))
				->in('p.property_id', $propertyFilterSelect);
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

		$select->join(new sql\join\PoApproveJoin())
				->where($where);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'purchaseorder_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findPosReleased($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
		
		$receiving = $this->configService->get('CP.RECEIVING_DEFAULT', '1');

		$select->whereEquals('p.purchaseorder_status', "'saved'")
			->whereNest('OR')
			->whereEquals('p.purchaseorder_rct_canReceive', 0)
			->whereIsNull('p.purchaseorder_rct_canReceive')
			->whereUnnest();

		if ($receiving === '1') {
			$select->whereEquals('p.purchaseorder_rct_req', 1);
		}

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'purchaseorder_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findPosByUser($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		if ($countOnly != 'true') {
			$select->columnRejectedBy()
					->columnRejectedDate();
		}

		$select->join(new sql\join\PoRecauthorJoin())
			->join(new \NP\property\sql\join\PropertyFiscalcalJoin())
			->join(new \NP\property\sql\join\FiscalcalFiscalcalMonthJoin())
			// Where
			->whereEquals('ra.userprofile_id', '?')
			->whereNotEquals('p.purchaseorder_status', "'draft'")
			->whereMerge(new sql\criteria\PoPeriodCriteria());

		$params = array($userprofile_id);

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, $params, $pageSize, $page, 'purchaseorder_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select, $params);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	public function findPosRejected($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=null, $sort="vendor_name") {
		$select = $this->getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		if ($countOnly != 'true') {
			$select->columnRejectedBy()
					->columnRejectedDate();
		}

		$select->whereEquals('p.purchaseorder_status', "'rejected'");

		// If paging is needed
		if ($pageSize !== null && $countOnly == 'false') {
			return $this->getPagingArray($select, array(), $pageSize, $page, 'purchaseorder_id');
		} else if ($countOnly == 'true') {
			$res = $this->adapter->query($select);
			return $res[0]['totalRecs'];
		} else {
			return $this->adapter->query($select);
		}
	}

	protected function getDashboardSelect($countOnly, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort) {
		$select = new sql\PoSelect();
		
		if ($countOnly == 'true') {
			$select->count(true, 'totalRecs', 'p.purchaseorder_id');
		} else {
			$select->allColumns('p')
					->columnAmount()
					->columnPendingDays()
					->columnPendingApprovalDays()
					->columnCreatedBy()
					->columnLastApprovedBy()
					->columnLastApprovedDate()
					->columnSentToVendor()
					->order($sort);
		}

		$propertyFilterSelect = new PropertyFilterSelect(new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection));

		$select->join(new sql\join\PoPropertyJoin())
			->join(new sql\join\PoVendorsiteJoin())
			->join(new sql\join\PoPriorityFlagJoin())
			->join(new \NP\vendor\sql\join\VendorsiteVendorJoin())
			->whereIn('p.property_id', $propertyFilterSelect);

		return $select;
	}

	/**
	 * 
	 */
	public function findPosLinkableToInvoice($invoice_id) {
		// Get the vendor info for the invoice because we'll need to use different logic
		// if invoice vendor is has finance_vendor field set to one
		$invoiceVendor = $this->adapter->query(
				Select::get()->columns(array())
							->from(array('i'=>'invoice'))
							->join(new \NP\invoice\sql\join\InvoiceVendorsiteJoin(array('vendorsite_id')))
							->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(array('finance_vendor')))
							->whereEquals('i.invoice_id', '?')
			, array($invoice_id));

		// Build the query for getting linkable POs
		$propertyContext = new PropertyContext(
			$this->securityService->getUserId(),
			$this->securityService->getUserId(),
			'all',
			null
		);
		$propertyFilterSelect = new PropertyFilterSelect($propertyContext);

		$select = new sql\PoSelect();
		$select->columns(array(
						'purchaseorder_id',
						'purchaseorder_ref'
					))
				->columnAmount()
				->join(new sql\join\PoPropertyJoin())
				->join(new sql\join\PoVendorsiteJoin())
				->join(new \NP\vendor\sql\join\VendorsiteVendorJoin())
				->whereEquals('p.purchaseorder_status', "'saved'")
				->whereIn(
					'p.property_id',
					$propertyFilterSelect
				);
		
		// Only do this if receiving is on
		if ($this->configService->get('CP.RECEIVING_DEFAULT', '0') == '1') {
			$select->whereIsNotNull(
				Select::get()->column('rctitem_id')
							->from(array('rcti'=>'rctitem'))
							->whereEquals('rcti.rctitem_status', "'approved'")
							->whereIn(
								'rcti.poitem_id',
								Select::get()->column('poitem_id')
											->from(array('pi'=>'poitem'))
											->whereEquals('pi.purchaseorder_id', 'p.purchaseorder_id')
							)
							->limit(1)
			);
		}

		// Only do this finance_vendor is not set to 1 or the user doesn't have finance vendor permissions
		if ($invoiceVendor[0]['finance_vendor'] != 1 || !$this->securityService->hasPermission($securityService)) {
			$select->whereEquals('p.vendorsite_id', $invoiceVendor[0]['vendorsite_id']);
		}

		return $this->adapter->query($select);
	}

	public function isMultiProp($purchaseorder_id) {
		$select = Select::get()
			->count(true, 'total')
			->from(['pi'=>'poitem'])
				->join(new sql\join\PoItemPurchaseorderJoin())
			->whereEquals('pi.purchaseorder_id', '?')
			->whereNotEquals(
				'pi.property_id',
				'p.property_id'
			);


		$total = $this->adapter->query($select, [$purchaseorder_id]);

		return (count($total)) ? true : false;
	}

	public function rollPeriod($property_id, $newAccountingPeriod, $oldAccountingPeriod) {
		$update = new Update();

		$newAccountingPeriod = \NP\util\Util::formatDateForDB($newAccountingPeriod);
		$oldAccountingPeriod = \NP\util\Util::formatDateForDB($oldAccountingPeriod);

		$update->table('purchaseorder')
				->values(array('purchaseorder_period'=>'?'))
				->whereEquals('purchaseorder_period', '?')
				->whereEquals('property_id', '?')
				->whereNotEquals('purchaseorder_status', '?');

		$params = array($newAccountingPeriod, $oldAccountingPeriod, $property_id, 'closed');

		$this->adapter->query($update, $params);
	}

	/**
	 * Retrieve order's POs
	 *
	 * @param $vendorsite_id
	 * @param $property_id
	 * @return array|bool
	 */
	public function getOrderPOs($vendorsite_id, $property_id) {
		$select = new Select();

		$select->from(['p' => 'purchaseorder'])
				->where([
						'vendorsite_id' 		=> '?',
						'property_id'			=> '?',
						'purchaseorder_status'	=> '?'
				])
				->order('purchaseorder_ref asc');

		return $this->adapter->query($select, [$vendorsite_id, $property_id, 'open']);
	}

    /**
     * Get Template for image index table.
     * 
     * @param int $vendorsite_id Vendorsite id.
     * @param int $property_id Propery id.
     * @return [] List of templates.
     */
    public function getTemplatesByCriteria($userprofile_id, $delegation_to_userprofile_id,
    										$vendorsite_id, $property_id) {
        if (empty($vendorsite_id)) 
            return;
        if (empty($property_id)) 
            return;
        
        $params = [$vendorsite_id];

        $select = new Select();
        $select = Select::get()
		            ->columns([
						'purchaseorder_id',
						'purchaseorder_ref'
			        ])
		            ->from(['p' => 'purchaseorder'])
		            	->join(new sql\join\PoPropertyJoin(['property_name']))
		            	->join(new sql\join\PoVendorsiteJoin([]))
		            	->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(['integration_package_id']))
		            ->whereEquals('p.purchaseorder_status', '\'draft\'')
            		->whereEquals('vs.vendorsite_id', '?')
            		->whereNest('OR')
		                ->whereEquals('p.property_id', 0)
        ;
        
        if ($this->configService->get('PN.Main.templateByProp', '0') == '1') {
        	$select->whereEquals('p.property_id', '?');
        	$params[] = $property_id;
        } else {
        	$select->whereIn(
						'p.property_id',
						new PropertyFilterSelect(
	                        new PropertyContext(
	                            $userprofile_id,
	                            $delegation_to_userprofile_id,
	                            'all',
	                            null
	                        )
	                    )
					);
        }
        $select->whereUnnest();

        return $this->adapter->query($select, $params);
    }

	/**
	 * 
	 */
	public function unlinkFromInvoice($invoice_id) {
		$this->update(
			['purchaseorder_status' => 'saved'],
			Where::get()
				->equals('purchaseorder_status', '?')
				->in(
					'purchaseorder_id',
					Select::get()->column('purchaseorder_id')
								->from('poitem')
								->whereEquals('reftable_name', '?')
								->whereIn(
									'reftablekey_id',
									Select::get()->column('invoiceitem_id')
												->from('invoiceitem')
												->whereEquals('invoice_id', '?')
								)
				),
			['closed', 'invoiceitem', $invoice_id]
		);
	}

	/**
	 * Returns Select object that can be re-used for all the registers
	 */
	private function getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort) {
		$propertyContext = new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection);
		$propertyFilterSelect = new PropertyFilterSelect($propertyContext);

		$select = new sql\PoSelect();
		$select->allColumns('p')
				->columnAmount()
				->columnCreatedBy()
				->columnPendingDays()
				->join(new sql\join\PoVendorsiteJoin())
				->join(new \NP\vendor\sql\join\VendorsiteVendorJoin())
				->join(new sql\join\PoPropertyJoin())
				->join(new sql\join\PoPriorityFlagJoin())
				->whereIn('vs.vendorsite_status', "'active','inactive','rejected'")
				->whereIn('p.property_id', $propertyFilterSelect)
				->order($sort);

		return $select;
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
	public function findOpenPos($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
		
		$select->whereEquals('p.purchaseorder_status', "'open'");
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, array(), $pageSize, $page);
		} else {
			return $this->adapter->query($select);
		}
	}
	
	/**
	 * Find rejected POs for a user given a certain context filter
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
	public function findRejectedPos($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		// Just use the same function as the one used for Rejected Invoices dashboard
		return $this->findPosRejected(false, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	public function findTemplatePos($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$select->whereEquals('p.purchaseorder_status', "'draft'");

		$params = [\NP\util\Util::formatDateForDB()];
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	public function findPendingPos($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$select->columnPendingApprovalDays()
				->columnPendingApprovalFor()
				->whereIn('p.purchaseorder_status', "'forapproval','approved'");
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, array(), $pageSize, $page);
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findApprovedPos($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$isReceivingOn = $this->configService->get('RECEIVING_ON', '0');

		$select->columnLastApprovedDate()
				->columnLastApprovedBy()
				->columnReceivedStatus($isReceivingOn)
				->columnSentToVendorDate()
				->whereEquals('p.purchaseorder_status', "'saved'")
				->whereLessThanOrEqual(
					'DateDiff(day, p.purchaseorder_created, getdate())',
					$this->configService->get('PN.POOptions.NumDaysReleasedPO', 0)
				);
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, array(), $pageSize, $page);
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findInvoicedPos($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$isReceivingOn = $this->configService->get('RECEIVING_ON', '0');

		$select->columnLastApprovedDate()
				->columnLastApprovedBy()
				->columnReceivedStatus($isReceivingOn)
				->columnSentToVendorDate()
				->join(new \NP\property\sql\join\PropertyFiscalcalJoin())
				->join(new \NP\property\sql\join\FiscalcalFiscalcalMonthJoin())
				->whereEquals('p.purchaseorder_status', "'closed'")
				->whereNotExists(
					Select::get()
						->from(['pi'=>'poitem'])
						->whereEquals('pi.purchaseorder_id', 'p.purchaseorder_id')
						->whereNest('OR')
							->whereNotEquals('pi.reftable_name', "'invoiceitem'")
							->whereIsNull('pi.reftable_name')
							->whereIsNull('pi.reftablekey_id')
							->whereEquals('pi.reftablekey_id', 0)
						->whereUnnest()
				)
				->whereMerge(new sql\criteria\PoPeriodCriteria());
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, array(), $pageSize, $page);
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findCancelledPos($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$isReceivingOn = $this->configService->get('RECEIVING_ON', '0');

		$select->columnLastApprovedDate()
				->columnLastApprovedBy()
				->columnReceivedStatus($isReceivingOn)
				->columnSentToVendorDate()
				->join(new \NP\property\sql\join\PropertyFiscalcalJoin())
				->join(new \NP\property\sql\join\FiscalcalFiscalcalMonthJoin())
				->whereEquals('p.purchaseorder_status', "'closed'")
				->whereNotExists(
					Select::get()
						->from(['pi'=>'poitem'])
						->whereEquals('pi.purchaseorder_id', 'p.purchaseorder_id')
						->whereNest('OR')
							->whereNotEquals('pi.reftable_name', "'invoiceitem'")
							->whereIsNull('pi.reftablekey_id')
							->whereNotEquals('pi.reftablekey_id', 0)
						->whereUnnest()
				)
				->whereMerge(new sql\criteria\PoPeriodCriteria());
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, array(), $pageSize, $page);
		} else {
			return $this->adapter->query($select);
		}
	}

    /**
     * Gets the total amount allocated to invoices for a certain GL/GL Category, property, and period
     */
    public function getTotalAmountByBudget($glaccount_id, $property_id, $start_period, $end_period=null, $isCategory=false) {
    	$budgetCompareWithTax = $this->configService->get('PN.Intl.budgetCompareWithTax', '1');
    	$col = 'ISNULL(SUM(ISNULL(pi.poitem_amount, 0) + ISNULL(pi.poitem_shipping, 0)';
    	if ($budgetCompareWithTax == '1') {
    		$col .= ' + ISNULL(pi.poitem_salestax, 0)';
    	}
    	$col .= '), 0)';

    	$select = Select::get()
    		->column(
    			new Expression($col),
    			'po_total'
    		)
    		->from(['p'=>'purchaseorder'])
    			->join(new sql\join\PurchaseorderPoItemJoin([]))
    		->whereNotIn('p.purchaseorder_status', "'closed','rejected','draft'")
    		->whereEquals('pi.property_id', '?')
    		->whereNest('OR')
    			->whereNotEquals('pi.reftable_name', "'invoiceitem'")
    			->whereIsNull('pi.reftable_name')
    		->whereUnnest();

    	if ($isCategory) {
    		$select->join(new \NP\gl\sql\join\GlAccountTreeJoin([], Select::JOIN_INNER, 'tr', 'pi'))
    			->join(new \NP\system\sql\join\TreeTreeParentJoin([]))
    			->whereEquals('tr2.tablekey_id', '?');
    	} else {
    		$select->whereEquals('pi.glaccount_id', '?');
    	}

		$params = [$property_id, $glaccount_id];
		if (!empty($end_period)) {
			$select->whereBetween('pi.poitem_period', '?', '?');
			array_push($params, $start_period, $end_period);
		} else {
			$select->whereEquals('pi.poitem_period', '?');
			$params[] = $start_period;
		}

    	$res = $this->adapter->query($select, $params);

    	return (float)$res[0]['po_total'];
    }

	/**
	 * Returns history log records for a PO
	 *
	 * @param  int    $purchaseorder_id
	 * @param  int    $pageSize
	 * @param  int    $page
	 * @param  string $sort
	 * @return array
	 */
	public function findHistoryLog($purchaseorder_id, $showAudit=false, $pageSize=null, $page=null, $sort="approve_datetm") {
		// Add approval log records
		$select = new ApproveSelect();
		$select->addHistoryLogSpecification()
				->order("{$sort},transaction_id,approvetype_name");

		// Add parameters for the approval log query
		$params = ['purchaseorder', $purchaseorder_id];

		// Add log items for images, splits, vendor connect
		$unions = ['ImageDeleted'=>true,'ImageScanned'=>true,'ImageIndexed'=>true,
				'ImageAdded'=>true, 'PoCreated'=>false];

		if ($showAudit) {
			$unions = array_merge($unions, [
				'SplitAudit'  => true,
				'PoAudit'     => false,
				'PoItemAudit' => false
			]);
		}

		// Loop through items since they all use the same format/parameters
		foreach ($unions as $union=>$useTableNameParam) {
			$fn = "add{$union}Specification";
			$select->union($this->getAuditSelect()->$fn());
			if ($useTableNameParam) {
				$params[] = 'purchaseorder';
			}
			$params[] = $purchaseorder_id;
		}

		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	private function getAuditSelect() {
		return new AuditSelect($this->configService);
	}

	/**
	 * Checks if a PO is to be submitted electronically
	 */
	public function findPoCatalogInfo($purchaseorder_id) {
		$res = $this->adapter->query(
			Select::get()
				->columns([
					'purchaseorder_status',
					'property_id',
					'total_lines'         => Select::get()
												->count()
												->from(['pi'=>'poitem'])
												->whereEquals('pi.purchaseorder_id', 'p.purchaseorder_id'),
					'total_catalog_lines' => Select::get()
												->count()
												->from(['pi'=>'poitem'])
												->whereEquals('pi.purchaseorder_id', 'p.purchaseorder_id')
												->whereEquals('pi.is_from_catalog', 1)
				])
				->from(['p'=>'purchaseorder'])
					->join(new sql\join\PoVendorsiteJoin())
				->whereEquals('p.purchaseorder_id', '?'),
			[$purchaseorder_id]
		);

		return $res[0];
	}
}

?>