<?php

namespace NP\invoice;

use NP\core\db\Select;
use NP\property\PropertyGateway;

use NP\core\db\Adapter;
use NP\core\db\Expression;

/**
 * Gateway for the INVOICE table
 *
 * @author Thomas Messier
 */
class InvoiceGateway extends AbstractPOInvoiceGateway {
	
	/**
	 * @var \NP\property\PropertyGateway
	 */
	protected $propertyGateway;

	/**
	 * @param \NP\core\db\Adapter     $adapter         Database adapter object injected
	 * @param \NP\property\PropertyGateway $propertyGateway PropertyGateway object injected
	 */
	public function __construct(Adapter $adapter, PropertyGateway $propertyGateway) {
		$this->propertyGateway = $propertyGateway;
		
		parent::__construct($adapter);
	}
	
	/**
	 * Overrides the default gateway function and returns a record for the specified invoice ID
	 *
	 * @param  int   $invoice_id ID of the invoice to be retrieved
	 * @return array
	 */
	public function findById($invoice_id) {
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
	 * Find open invoices for a user given a certain context filter
	 *
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string $contextFilterType           The context filter type; valid values are 'property','region', and 'all'
	 * @param  int    $contextFilterSelection      The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int    $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int    $page                        The page for which to return records
	 * @param  string $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                               Array of invoice records
	 */
	public function findOpenInvoices($userprofile_id, $delegated_to_userprofile_id, $contextFilterType, $contextFilterSelection, $pageSize, $page=1, $sort='vendor_name') {
		$propertyFilter = $this->propertyGateway->getPropertyFilterSubSelect($userprofile_id, $delegated_to_userprofile_id, $contextFilterType, $contextFilterSelection);

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
					AND p.property_id " . $propertyFilter['sql']
				)
				->order($sort);
		
		$params = $propertyFilter['params'];
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page, true);
		} else {
			return $this->adapter->query($select, $params);
		}
	}
	
	/**
	 * Find rejected invoices for a user given a certain context filter
	 *
	 * @param  int    $userprofile_id              The active user ID, can be a delegated account
	 * @param  int    $delegated_to_userprofile_id The user ID of the user logged in, independent of delegation
	 * @param  string $contextFilterType           The context filter type; valid values are 'property','region', and 'all'
	 * @param  int    $contextFilterSelection      The context filter selection; if filter type is 'all', should be null, if 'property' should be a property ID, if 'region' should be a region ID
	 * @param  int    $pageSize                    The number of records per page; if null, all records are returned
	 * @param  int    $page                        The page for which to return records
	 * @param  string $sort                        Field(s) by which to sort the result; defaults to vendor_name
	 * @return array                               Array of invoice records
	 */
	public function findRejectedInvoices($userprofile_id, $delegated_to_userprofile_id, $contextFilterType, $contextFilterSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$propertyFilter = $this->propertyGateway->getPropertyFilterSubSelect($userprofile_id, $delegated_to_userprofile_id, $contextFilterType, $contextFilterSelection);

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
					AND p.property_id " . $propertyFilter['sql']
				)
				->order($sort);
		
		$params = $propertyFilter['params'];
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page, true);
		} else {
			return $this->adapter->query($select, $params);
		}
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

}

?>