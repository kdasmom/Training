<?php

namespace NP\invoice\sql;

use NP\core\SqlSelect;

use Zend\Db\Sql\Expression;

/**
 * A custom Select object for Invoice records with some shortcut methods
 *
 * @author Thomas Messier
 */
class InvoiceSelect extends SqlSelect {
	
	public function __construct() {
		parent::__construct();
		$this->from('invoice');
	}
	
	/**
	 * Left joins vendor tables (VENDORSITE, VENDOR)
	 *
	 * @param  string[] $vendorsiteCols Columns to retrieve from the VENDORSITE table
	 * @param  string[] $vendorCols     Columns to retrieve from the VENDOR table
	 * @return NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function joinVendor($vendorsiteCols=array(), $vendorCols=array()) {
		return $this->join(array('vs' => 'vendorsite'),
						$this->table.'.paytablekey_id = vs.vendorsite_id',
						$vendorsiteCols)
					->join(array('v' => 'vendor'),
							'vs.vendor_id = v.vendor_id',
							$vendorCols);
	}
	
	/**
	 * Joins the PROPERTY table
	 *
	 * @param  string[] $cols               Columns to retrieve from the table
	 * @return NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function joinProperty($cols=array()) {
		return $this->join(array('p' => 'property'),
						$this->table.'.property_id = p.property_id',
						$cols);
	}
	
	/**
	 * Joins the USERPROFILE table
	 *
	 * @param  string[] $cols               Columns to retrieve from the table
	 * @return NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function joinUserprofile($cols=array()) {
		return $this->join(array('r' => 'recauthor'),
							new Expression($this->table.".invoice_id = r.tablekey_id AND r.table_name = 'invoice'"),
							array())
						->join(array('u' => 'userprofile'),
							'r.userprofile_id = u.userprofile_id',
							$cols);
	}
	
	/**
	 * Adds the invoice amount subquery as a column
	 *
	 * @return NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnInvoiceAmount() {
		$subSelect = new SqlSelect();
		$subSelect->from(array('ii'=>'invoiceitem'))
					->columns(array('invoice_amount'=>new Expression('SUM(ii.invoiceitem_amount + ii.invoiceitem_shipping + ii.invoiceitem_salestax)')))
					->where('ii.invoice_id = '.$this->table.'.invoice_id');
		$subSelect = new Expression('('.$subSelect->getSqlString().')');
		
		return $this->column($subSelect, 'invoice_amount');
	}
	
	/**
	 * Adds the rejected date subquery as a column
	 *
	 * @return NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnRejectedDate() {
		$subSelect = new SqlSelect();
		$subSelect->from(array('__a'=>'APPROVE_VIEW'))
					->columns(array('rejected_datetm'=>new Expression('TOP 1 approve_datetm')))
					->where("__a.tablekey_id = ".$this->table.".invoice_id 
						AND __a.table_name = 'invoice' 
						AND __a.approvetype_id = (
							SELECT top 1 approvetype_id from approvetype where approvetype_name = 'rejected'
						)")
					->order('__a.approve_id DESC');
		
		$subSelect = new Expression('('.$subSelect->getSqlString().')');
		
		return $this->column($subSelect, 'rejected_datetm');
	}
	
	/**
	 * Adds the rejected by subquery as a column
	 *
	 * @return NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnRejectedBy() {
		$subSelect = new SqlSelect();
		$subSelect->from(array('__a'=>'APPROVE_VIEW'))
					->columns(array('rejected_by'=>new Expression('TOP 1 userprofile_username')))
					->where("__a.tablekey_id = ".$this->table.".invoice_id 
						AND __a.table_name = 'invoice' 
						AND __a.approvetype_id = (
							SELECT top 1 approvetype_id from approvetype where approvetype_name = 'rejected'
						)")
					->order('__a.approve_id DESC');
		
		$subSelect = new Expression('('.$subSelect->getSqlString().')');
		
		return $this->column($subSelect, 'rejected_by');
	}
	
	/**
	 * Adds the created by subquery as a column
	 *
	 * @return NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnCreatedBy() {
		$subSelect = new SqlSelect();
		$subSelect->from(array('__ra'=>'recauthor'))
					->columns(array())
					->join(array('__ur' => 'userprofilerole'),
							'__ra.userprofile_id = __ur.userprofile_id',
							array())
					->join(array('__s' => 'staff'),
							'__ur.tablekey_id = __s.staff_id',
							array())
					->join(array('__p' => 'person'),
							'__s.person_id = __p.person_id',
							array('created_by'=>new Expression("__p.person_firstname + ' ' + __p.person_lastname")))
					->where("__ra.tablekey_id = ".$this->table.".invoice_id 
						AND __ra.table_name = 'invoice'");
		
		$subSelect = new Expression('('.$subSelect->getSqlString().')');
		
		return $this->column($subSelect, 'created_by');
	}
	
}