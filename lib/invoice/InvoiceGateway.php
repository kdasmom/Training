<?php

namespace NP\invoice;

use NP\core\SqlSelect;
use NP\property\PropertyGateway;

use Zend\Db\Adapter\Adapter;
use Zend\Db\Sql\Expression;

class InvoiceGateway extends AbstractPOInvoiceGateway {
	
	protected $propertyGateway;

	public function __construct(Adapter $adapter, PropertyGateway $propertyGateway) {
		$this->propertyGateway = $propertyGateway;
		
		parent::__construct($adapter);
	}
	
	public function findById($id) {
		$select = new InvoiceSelect();
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
				->joinVendor('*', '*')
				->joinProperty(array(
					'property_id',
					'property_id_alt',
					'property_name'
				))
				->joinUserprofile(array(
					'userprofile_id',
					'userprofile_username'
				))
				->where($this->table.'.invoice_id = ?');
		
		$res = $this->executeSelectWithParams($select, array($id));
		return $res[0];
	}
	
	public function findOpenInvoices($userprofile_id, $delegated_to_userprofile_id, $propertyFilterType, $propertyFilterSelection, $pageSize, $page=1, $sort='vendor_name') {
		$propertyFilter = $this->propertyGateway->getPropertyFilterSubSelect($userprofile_id, $delegated_to_userprofile_id, $propertyFilterType, $propertyFilterSelection);

		$select = new InvoiceSelect();
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
					$this->table.".invoice_status = 'open'
					AND vs.vendorsite_status IN ('active','inactive','rejected')
					AND p.property_id " . $propertyFilter['sql']
				)
				->order($sort);
		
		$params = $propertyFilter['params'];
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page, true);
		} else {
			return $this->executeSelectWithParams($select, $params);
		}
	}
	
	public function findRejectedInvoices($userprofile_id, $delegated_to_userprofile_id, $propertyFilterType, $propertyFilterSelection, $pageSize=null, $page=1, $sort='vendor_name') {
		$propertyFilter = $this->propertyGateway->getPropertyFilterSubSelect($userprofile_id, $delegated_to_userprofile_id, $propertyFilterType, $propertyFilterSelection);

		$select = new InvoiceSelect();
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
					$this->table.".invoice_status = 'rejected'
					AND vs.vendorsite_status IN ('active','inactive','rejected')
					AND p.property_id " . $propertyFilter['sql']
				)
				->order($sort);
		
		$params = $propertyFilter['params'];
		
		// If paging is needed
		if ($pageSize !== null) {
			return $this->getPagingArray($select, $params, $pageSize, $page, true);
		} else {
			return $this->executeSelectWithParams($select, $params);
		}
	}
	
	public function findAssociatedPOs($invoice_id) {
		$select = new SqlSelect(array('ii'=>'invoiceitem'));
		
		$select->columns(array(new Expression("DISTINCT p.purchaseorder_id, p.purchaseorder_ref")))
				->join(array('pi' => 'poitem'),
						'pi.reftablekey_id = ii.invoiceitem_id',
						array())
				->join(array('p' => 'purchaseorder'),
						'p.purchaseorder_id = pi.purchaseorder_id',
						array())
				->where("ii.invoice_id = ?")
				->order('p.purchaseorder_id');
		
		return $this->executeSelectWithParams($select, array($invoice_id));
	}
	
	public function findForwards($invoice_id) {
		$select = new SqlSelect(array('ipf'=>'INVOICEPOFORWARD'));
		
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
						SqlSelect::JOIN_LEFT)
				->join(array('uprt' => 'USERPROFILEROLE'),
						'uprt.userprofile_id = upt.userprofile_id',
						array(),
						SqlSelect::JOIN_LEFT)
				->join(array('st' => 'staff'),
						'uprt.tablekey_id = st.staff_id',
						array(),
						SqlSelect::JOIN_LEFT)
				->join(array('pt' => 'person'),
						'pt.person_id = st.person_id',
						array(),
						SqlSelect::JOIN_LEFT)
				->join(array('u2' => 'userprofile'),
						'ipf.from_delegation_to_userprofile_id = u2.userprofile_id',
						array(),
						SqlSelect::JOIN_LEFT)
				->where("
					ipf.table_name = 'invoice' 
					AND ipf.tablekey_id = ?
				");
		
		return $this->executeSelectWithParams($select, array($invoice_id));
	}

	public function canUserApprove($invoice_id, $userprofile_id) {
		return parent::canUserApprove(
			"invoice",
			$invoice_id,
			$userprofile_id
		);
	}

}

?>