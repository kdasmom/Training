<?php

namespace NP\invoice;

use NP\system\ConfigService;
use NP\property\FiscalCalService;
use NP\property\RegionGateway;
use NP\property\PropertyContext;
use NP\property\sql\PropertyFilterSelect;

use NP\user\RoleGateway;

use NP\core\AbstractGateway;
use NP\core\db\Adapter;
use NP\core\db\Select;
use NP\core\db\Update;
use NP\core\db\Where;
use NP\core\db\Expression;

use NP\system\sql\AuditSelect;
use NP\workflow\sql\ApproveSelect;

/**
 * Gateway for the INVOICE table
 *
 * @author Thomas Messier
 */
class InvoiceGateway extends AbstractGateway {
	protected $tableAlias = 'i';

	protected $configService, $securityService, $fiscalCalService, $roleGateway;

	/**
	 * @param \NP\core\db\Adapter          $adapter         Database adapter object injected
	 * @param \NP\user\RoleGateway         $roleGateway     UserService object injected
	 */
	public function __construct(Adapter $adapter, FiscalCalService $fiscalCalService,
								RoleGateway $roleGateway) {
		$this->fiscalCalService = $fiscalCalService;
		$this->roleGateway      = $roleGateway;
		
		parent::__construct($adapter);
	}
	
	public function setConfigService(\NP\system\ConfigService $configService) {
		$this->configService = $configService;
	}
	
	public function setSecurityService(\NP\security\SecurityService $securityService) {
		$this->securityService = $securityService;
	}
	
	public function setLocalizationService(\NP\locale\LocalizationService $localizationService) {
		$this->localizationService = $localizationService;
	}

	public function translateForSql($phrase) {
		return str_replace("'", "''", $this->localizationService->translate($phrase));
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
				->columnCreatedBy()
				->join(new sql\join\InvoiceVendorsiteJoin())
				->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(['vendor_name','vendor_id_alt','vendor_status','integration_package_id','default_glaccount_id']))
				->join(new \NP\vendor\sql\join\VendorGlAccountJoin())
				->join(new \NP\vendor\sql\join\VendorsiteAddressJoin())
				->join(new \NP\vendor\sql\join\VendorsitePhoneJoin('Main'))
				->join(new sql\join\InvoicePropertyJoin())
				->join(new \NP\property\sql\join\PropertyAddressJoin([
					'property_address_id'      => 'address_id',
					'property_address_line1'   => 'address_line1',
					'property_address_line2'   => 'address_line2',
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
		
		$select->column(new Expression("ISNULL(SUM(pi.poitem_amount + pi.poitem_salestax + pi.poitem_shipping), 0)"), 'po_total')
				->where("ii.invoice_id = ?")
				->group('p.purchaseorder_id, p.purchaseorder_ref, pr.matching_threshold');
		
		$select2 = clone $select;

		$select->join(
					['pi'=>'poitem'],
					'ii.invoiceitem_id = pi.reftablekey_id',
					[]
				)
				->join(new \NP\po\sql\join\PoItemPurchaseorderJoin(['purchaseorder_id','purchaseorder_ref']))
				->join(new \NP\po\sql\join\PoPropertyJoin(['matching_threshold']))
				->whereNotEquals('ii.reftablekey_id', 'pi.poitem_id')
				->order('p.purchaseorder_ref');

		$select2->join(
					['pi'=>'poitem'],
					'ii.reftablekey_id = pi.poitem_id',
					[]
				)
				->join(new \NP\po\sql\join\PoItemPurchaseorderJoin(['purchaseorder_id','purchaseorder_ref']))
				->join(new \NP\po\sql\join\PoPropertyJoin(['matching_threshold']));

		$select->union($select2);

		return $this->adapter->query($select, [$invoice_id, $invoice_id]);
	}

	/**
	 * Finds all associated lines between an invoice and a PO 
	 */
	public function findInvoicePoAssociations($invoice_id, $purchaseorder_id) {
		$select = Select::get()
			->from(['ii'=>'invoiceitem'])
				->join(new sql\join\InvoiceItemPoItemJoin())
			->whereEquals('ii.invoice_id', '?')
			->whereEquals('pi.purchaseorder_id', '?');

		return $this->adapter->query($select, [$invoice_id, $purchaseorder_id]);
	}

	/**
	 * Checks if an invoice has properties used that are different than the header property.
	 *
	 * @param  int $invoice_id
	 * @return boolean
	 */
	public function isInvoiceMultiProp($invoice_id) {
		$select = Select::get()
			->count(true, 'total')
			->from(['ii'=>'invoiceitem'])
				->join(new sql\join\InvoiceItemInvoiceJoin())
			->whereEquals('ii.invoice_id', '?')
			->whereNotEquals(
				'ii.property_id',
				'i.property_id'
			);


		$total = $this->adapter->query($select, [$invoice_id]);

		return (count($total)) ? true : false;
	}

	/**
	 * 
	 */
	public function findInvalidPostDates($invoice_id) {
		$invalid = [];

		$select = Select::get()->columns(['invoiceitem_id','property_id'])
							->from(['ii'=>'invoiceitem'])
							->join(new sql\join\InvoiceItemInvoiceJoin(['invoice_period']))
							->join(new sql\join\InvoiceItemPropertyJoin(['property_id_alt','property_name']))
							->whereEquals('i.invoice_id', '?');

		$lines = $this->adapter->query($select, [$invoice_id]);

		foreach ($lines as $line) {
			$period = $this->fiscalCalService->getAccountingPeriod($line['property_id']);
			$invoicePeriod = \DateTime::createFromFormat('Y-m-d H:i:s.u', $line['invoice_period']);
			if ($period->format('m') <> $invoicePeriod->format('m')) {
				$invalid[$line['invoiceitem_id']] = $period;
			}
		}

		return $invalid;
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
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);
		
		$select->whereEquals('i.invoice_status', "'open'");
		
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

	public function findOverdueInvoices($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$select->whereIsNotNull('i.invoice_duedate')
				->whereLessThan('i.invoice_duedate', '?')
				->whereNotIn('i.invoice_status', "'paid','void','draft'");

		$params = [\NP\util\Util::formatDateForDB()];
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	public function findTemplateInvoices($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$select->whereEquals('i.invoice_status', "'draft'");

		$params = [\NP\util\Util::formatDateForDB()];
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	public function findOnHoldInvoices($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		return $this->findInvoicesOnHold(false, $userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize, $page, $sort);
	}

	public function findPendingInvoices($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$select->columnPendingApprovalDays()
				->columnPendingApprovalFor()
				->whereEquals('i.invoice_status', "'forapproval'");
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, array(), $pageSize, $page);
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findApprovedInvoices($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$select->columnLastApprovedDate()
				->columnLastApprovedBy()
				->whereIn('i.invoice_status', "'saved','approved'");
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, array(), $pageSize, $page);
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findSubmittedInvoices($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$select->whereEquals('i.invoice_status', "'submitted'");
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, array(), $pageSize, $page);
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findTransferredInvoices($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$select->whereIn('i.invoice_status', "'sent','posted'");
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, array(), $pageSize, $page);
		} else {
			return $this->adapter->query($select);
		}
	}

	public function findPaidInvoices($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$context = $this->securityService->getContext();

		$accountingPeriod = $this->fiscalCalService->getAccountingPeriod($context['property_id']);
		$accountingPeriod = \NP\util\Util::formatDateForDB($accountingPeriod);
		
		$rollOffType = $this->configService->get('PN.InvoiceOptions.rollOffType');
		if ($rollOffType == 'currentPeriod') {
			$rollOffIncrement = 0;
		} else if ($rollOffType == 'twoPeriods') {
			$rollOffIncrement = 1;
		} else if ($rollOffType == 'threePeriods') {
			$rollOffIncrement = 2;
		}

		$select->columnPaymentDetails()
				->columnPaymentAmountRemaining()
				->whereEquals('i.invoice_status', "'paid'")
				->whereGreaterThanOrEqual(
					"DATEADD(m, {$rollOffIncrement}, i.invoice_period)",
					'?'
				);
		$params = [$accountingPeriod];

		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page);
		} else {
			return $this->adapter->query($select, $params);
		}
	}

	public function findVoidInvoices($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$select = $this->getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort);

		$select->columnVoidDate()
			->columnVoidBy()
			->whereEquals('i.invoice_status', "'void'");
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, array(), $pageSize, $page);
		} else {
			return $this->adapter->query($select);
		}
	}

	/**
	 * Returns Select object that can be re-used for all the registers
	 */
	private function getBaseRegisterSelect($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection, $sort) {
		$propertyContext = new PropertyContext($userprofile_id, $delegated_to_userprofile_id, $contextType, $contextSelection);
		$propertyFilterSelect = new PropertyFilterSelect($propertyContext);

		$select = new sql\InvoiceSelect();
		$select->allColumns('i')
				->columnAmount()
				->columnCreatedBy()
				->columnPendingDays()
				->join(new sql\join\InvoiceVendorsiteJoin())
				->join(new \NP\vendor\sql\join\VendorsiteVendorJoin())
				->join(new sql\join\InvoicePropertyJoin())
				->join(new sql\join\InvoicePriorityFlagJoin())
				->join(new sql\join\InvoiceInvoicePaymentTypeJoin())
				->whereIn('vs.vendorsite_status', "'active','inactive','rejected'")
				->whereIn('i.property_id', $propertyFilterSelect)
				->order($sort);

		return $select;
	}

	public function findInvoiceStatistics($property_id) {
		$select = Select::get()
			->distinct()
			->count(true, 'total', 'i.invoice_id')
			->columns([
				'sort' => new Expression("
					CASE i.invoice_status
						WHEN 'open' THEN 2
						WHEN 'forapproval' THEN 3
						WHEN 'saved' THEN 4
						WHEN 'hold' THEN 5
						WHEN 'rejected' THEN 6
					END
				"),
				'name' => new Expression("
					CASE i.invoice_status
						WHEN 'open' THEN '{$this->translateForSql('# of Open Invoices')}'
						WHEN 'forapproval' THEN '{$this->translateForSql('# of Invoices Pending Approval')}'
						WHEN 'saved' THEN '{$this->translateForSql('# of Completed Invoices to Approve')}'
						WHEN 'hold' THEN '{$this->translateForSql('# of Invoices on Hold')}'
						WHEN 'rejected' THEN '{$this->translateForSql('# of Rejected Invoices')}'
					END
				"),
				'amount' => new Expression("
					ISNULL(SUM(ii.invoiceitem_amount + ii.invoiceitem_shipping + ii.invoiceitem_salestax), 0)
				")
			])
			->from(['i'=>'invoice'])
				->join(new sql\join\InvoiceInvoiceItemJoin([], Select::JOIN_LEFT))
			->whereIn('i.invoice_status', "'open','forapproval','saved','hold','rejected'")
			->whereEquals('i.property_id', '?')
			->group('i.invoice_status')
			->union(
				Select::get()
					->count(true, 'total')
					->columns([
						'sort' => new Expression('1'),
						'name' => new Expression("'{$this->translateForSql('# of Images to Convert')}'"),
						'amount' => new Expression('SUM(img.Image_Index_Amount)')
					])
					->from(['img'=>'image_index'])
					->whereEquals('img.property_id', '?')
					->whereMerge(new \NP\image\sql\criteria\ImageInvoiceDocCriteria('Invoice,Utility Invoice'))
					->whereMerge(new \NP\image\sql\criteria\ImageInvoiceUnassigned())
					->whereEquals('img.Image_Index_Status', '1')
					->having('count(*) > 0')
			)
			->order('2');

		return $this->adapter->query($select, [$property_id,$property_id]);
	}

	public function findDuplicates($invoice_id) {
		$invoice = $this->adapter->query(
			Select::get()->columns(['paytablekey_id','invoice_ref'])
							->from('invoice')
							->whereEquals('invoice_id', '?'),
			[$invoice_id]
		);
		$invoice = $invoice[0];

		$select = Select::get()->columns(['invoice_id','invoice_ref'])
								->from('invoice')
								->whereNotEquals('invoice_status', "'draft'")
								->whereNotEquals('invoice_id', '?')
								->whereEquals('invoice_ref', '?')
								->whereEquals('paytablekey_id', '?');

		return $this->adapter->query($select, [$invoice_id, $invoice['invoice_ref'], $invoice['paytablekey_id']]);
	}

	public function findDuplicateDateAndAmount($invoice_id) {
		$select = new sql\InvoiceSelect();
		$select->columns([
					'paytablekey_id',
					'property_id',
					'invoice_datetm'
				])
				->columnAmount()
				->whereEquals('i.invoice_id', '?');

		$invoice = $this->adapter->query($select, [$invoice_id]);
		$invoice = $invoice[0];

		if ($invoice['entity_amount'] !== null) {
			$select = Select::get()->columns([])
									->from(['ii'=>'invoiceitem'])
									->join(new sql\join\InvoiceItemInvoiceJoin(['invoice_id','invoice_ref']))
									->whereNotIn('i.invoice_status', "'void','draft'")
									->whereNotEquals('i.invoice_id', '?')
									->whereEquals('i.property_id', '?')
									->whereEquals('i.paytablekey_id', '?')
									->group('i.invoice_id, i.invoice_ref')
									->having('SUM(ii.invoiceitem_shipping + ii.invoiceitem_salestax + ii.invoiceitem_amount) = ?');
			
			$params = [$invoice_id, $invoice['property_id'], $invoice['paytablekey_id']];
			
			if ($invoice['invoice_datetm'] !== null) {
				$select->whereEquals('i.invoice_datetm', '?');
				$params[] = $invoice['invoice_datetm'];
			}

			$params[] = $invoice['entity_amount'];

			return $this->adapter->query($select, $params);
		}

		return [];
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
			$select->columnOnHoldDays()
					->columnOnHoldBy()
					->columnOnHoldNotes()
					->columnOnHoldReason();
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
			$select->count(true, 'totalRecs', 'i.invoice_id');
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
			->join(new sql\join\InvoiceInvoicePaymentTypeJoin())
			->whereIn('i.property_id', $propertyFilterSelect);

		return $select;
	}

	/**
	 * Checks if a given user is a valid approver for a given invoice
	 *
	 * @param  int     $invoice_id
	 * @param  int     $userprofile_id
	 * @return boolean
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

	/**
	 * Checks if any dummy GL accounts are assigned to an invoice
	 *
	 * @param  int     $invoice_id
	 * @return boolean
	 */
	public function hasDummyAccounts($invoice_id) {
		$res = $this->adapter->query(
			Select::get()->count(true, 'dummyCount')
						->from(array('ii'=>'invoiceitem'))
						->join(new sql\join\InvoiceItemGlAccountJoin([]))
						->join(new \NP\gl\sql\join\GlAccountGlAccountTypeJoin([]))
						->whereEquals('ii.invoice_id', '?')
						->whereEquals('gt.glaccounttype_name', "'Dummy'"),
			array($invoice_id)
		);

		return ($res[0]['dummyCount']) ? true : false;
	}

	/**
	 * Returns history log records for an invoice
	 *
	 * @param  int    $invoice_id
	 * @param  int    $pageSize
	 * @param  int    $page
	 * @param  string $sort
	 * @return array
	 */
	public function findHistoryLog($invoice_id, $pageSize=null, $page=null, $sort="approve_datetm") {
		// Add approval log records
		$select = new ApproveSelect();
		$select->addHistoryLogSpecification()
				->order("{$sort},transaction_id,approvetype_name");

		// Add parameters for the approval log query
		$params = ['invoice', $invoice_id];

		// Add log items for images, splits, vendor connect
		$unions = ['ImageDeleted'=>true,'ImageScanned'=>true,'ImageIndexed'=>true,
				'ImageAdded'=>true, 'SplitAudit'=>true,'VendorConnect'=>true, 
				'InvoiceCreated'=>false, 'InvoiceActivated'=>false, 'InvoiceAudit'=>false,
				'InvoiceItemAudit'=>false];

		// Loop through items since they all use the same format/parameters
		foreach ($unions as $union=>$useTableNameParam) {
			$fn = "add{$union}Specification";
			$select->union($this->getAuditSelect()->$fn());
			if ($useTableNameParam) {
				$params[] = 'invoice';
			}
			$params[] = $invoice_id;
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

	/**
	 *
	 * Retrieve payments types
	 *
	 * @param $paymentType
	 * @return array|bool
	 */
	public function getPaymentTypes($paymentType) {
		$select = new Select();

		$select->from(['pt' => 'invoicepaymenttype'])
				->whereNest('OR')
				->whereEquals('pt.invoicepayment_type_id', $paymentType)
				->whereIsNull('pt.invoicepayment_type_id')
				->whereUnNest()
				->where(['pt.universal_field_status' => '?']);

		return $this->adapter->query($select, [1]);
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
     * @param int $utilityaccount_id Utility account ID.
     * @return [] List of templates.
     */
    public function getTemplatesByCriteria($userprofile_id, $delegation_to_userprofile_id,
    										$vendorsite_id, $property_id,
    										$utilityaccount_id=null) {
        if (empty($vendorsite_id)) 
            return;
        if (empty($property_id)) 
            return;
        
        $params = [$vendorsite_id];

        $select = new Select();
        $select = Select::get()
		            ->columns([
						'invoice_id'    => 'invoice_id',
						'invoice_ref'   => 'invoice_ref',
						'template_name' => 'template_name'
			        ])
		            ->from(['i' => 'invoice'])
		            	->join(new sql\join\InvoicePropertyJoin(['property_name']))
		            	->join(new sql\join\InvoiceVendorsiteJoin([]))
		            	->join(new \NP\vendor\sql\join\VendorsiteVendorJoin(['integration_package_id']))
		            ->whereEquals('i.invoice_status', '\'draft\'')
            		->whereEquals('vs.vendorsite_id', '?')
            		->whereNest('OR')
		                ->whereEquals('i.property_id', 0)
        ;
        
        if ($this->configService->get('PN.Main.templateByProp', '0') == '1') {
        	$select->whereEquals('i.property_id', '?');
        	$params[] = $property_id;
        } else {
        	$select->whereIn(
						'i.property_id',
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

        if (!empty($utilityaccount_id)) {
            $select->whereExists(
            	Select::get()->from(['ii' => 'invoiceitem'])
		                    ->whereEquals('ii.invoice_id', 'i.invoice_id')
		                    ->whereEquals('ii.utilityaccount_id', '?')
            );
            $params[] = $utilityaccount_id;
        }

        return $this->adapter->query($select, $params);
    }
}

?>