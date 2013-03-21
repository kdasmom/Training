<?php

namespace NP\invoice\sql;

use NP\core\db\Select;
use NP\core\db\Where;
use NP\core\db\Expression;

/**
 * A custom Select object for Invoice records with some shortcut methods
 *
 * @author Thomas Messier
 */
class InvoiceSelect extends Select {
	
	public function __construct() {
		parent::__construct();
		$this->from(array('i'=>'invoice'));
	}
	
	/**
	 * Joins vendor tables (VENDORSITE, VENDOR)
	 *
	 * @param  string[] $vendorsiteCols Columns to retrieve from the VENDORSITE table
	 * @param  string[] $vendorCols     Columns to retrieve from the VENDOR table
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function joinVendor($vendorsiteCols=array(), $vendorCols=array()) {
		return $this->join(array('vs' => 'vendorsite'),
						'i.paytablekey_id = vs.vendorsite_id',
						$vendorsiteCols)
					->join(array('v' => 'vendor'),
							'vs.vendor_id = v.vendor_id',
							$vendorCols);
	}
	
	/**
	 * Joins VENDORONETIME table
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function joinVendorOneTime($type=self::JOIN_LEFT) {
		return $this->join(array('vone' => 'vendoronetime'),
						"i.invoice_id = vone.tablekey_id AND vone.table_name = 'invoice'",
						array(),
						$type);
	}
	
	/**
	 * Adds the invoice amount subquery as a column
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnSubjectName($alias='subject_name') {
		return $this->column(new Expression('
			CASE 
				WHEN vone.vendoronetime_name IS NOT NULL THEN vone.vendoronetime_Name 
				ELSE v.vendor_name
			END
		'), $alias);
	}
	
	/**
	 * Joins the PROPERTY table
	 *
	 * @param  string[] $cols           Columns to retrieve from the table
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function joinProperty($cols=array()) {
		return $this->join(array('p' => 'property'),
						'i.property_id = p.property_id',
						$cols);
	}
	
	/**
	 * Joins the USERPROFILE table
	 *
	 * @param  string[] $cols           Columns to retrieve from the table
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function joinUserprofile($cols=array()) {
		return $this->join(array('r' => 'recauthor'),
							"i.invoice_id = r.tablekey_id AND r.table_name = 'invoice'",
							array())
						->join(array('u' => 'userprofile'),
							'r.userprofile_id = u.userprofile_id',
							$cols);
	}
	
	/**
	 * Joins the INTEGRATIONPACKAGE table
	 *
	 * @param  string[] $cols           Columns to retrieve from the table
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function joinIntegrationPackage($cols=array()) {
		return $this->join(array('ip' => 'integrationpackage'),
							"p.integration_package_id = ip.integration_package_id",
							$cols);
	}
	
	/**
	 * Joins the INTEGRATIONPACKAGETYPE table
	 *
	 * @param  string[] $cols           Columns to retrieve from the table
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function joinIntegrationPackageType($cols=array()) {
		return $this->join(array('ipt' => 'integrationpacakgetype'),
							"ip.integration_package_type_id = ipt.integration_package_type_id",
							$cols);
	}
	
	/**
	 * Joins the FISCALCAL table
	 *
	 * @param  string[] $cols           Columns to retrieve from the table
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function joinFiscalcal($year, $cols=array()) {
		return $this->join(array('f' => 'fiscalcal'),
							"i.property_id = f.property_id AND f.fiscalcal_year = {$year}",
							$cols);
	}
	
	/**
	 * Joins the FISCALCALMONTH table
	 *
	 * @param  string[] $cols           Columns to retrieve from the table
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function joinFiscalcalMonth($month, $cols=array()) {
		return $this->join(array('fm' => 'fiscalcalmonth'),
							"f.fiscalcal_id = fm.fiscalcal_id AND fm.fiscalcalmonth_num = {$month}",
							$cols);
	}
	
	/**
	 * Adds the invoice amount subquery as a column
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnInvoiceAmount() {
		$subSelect = new Select();
		$subSelect->from(array('ii'=>'invoiceitem'))
					->column(new Expression('SUM(ii.invoiceitem_amount + ii.invoiceitem_shipping + ii.invoiceitem_salestax)'))
					->where('ii.invoice_id = '.'i.invoice_id');
		
		return $this->column($subSelect, 'invoice_amount');
	}
	
	/**
	 * Adds the pending days column
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnPendingDays() {
		return $this->column(new Expression('DateDiff(day, i.invoice_createddatetm, getDate())'), 'invoice_pending_days');
	}
	
	/**
	 * Adds the rejected date subquery as a column
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnRejectedDate() {
		$approveTypeSubSelect = $this->getApproveTypeSubSelect('rejected');

		$where = new Where();
		$where->equals('__a.tablekey_id', 'i.invoice_id')
			->equals('__a.table_name', "'invoice'")
			->equals('__a.approvetype_id', $approveTypeSubSelect);

		$subSelect = new Select();
		$subSelect->from(array('__a'=>'APPROVE_VIEW'))
					->column('approve_datetm')
					->where($where)
					->limit(1)
					->order('__a.approve_id DESC');
		
		return $this->column($subSelect, 'rejected_datetm');
	}
	
	/**
	 * Adds the rejected by subquery as a column
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnRejectedBy() {
		$approveTypeSubSelect = $this->getApproveTypeSubSelect('rejected');
		
		$where = new Where();
		$where->equals('__a.tablekey_id', 'i.invoice_id')
			->equals('__a.table_name', "'invoice'")
			->equals('__a.approvetype_id', $approveTypeSubSelect);
				
		$subSelect = new Select();
		$subSelect->from(array('__a'=>'APPROVE_VIEW'))
					->column('userprofile_username')
					->where($where)
					->limit(1)
					->order('__a.approve_id DESC');
		
		return $this->column($subSelect, 'rejected_by');
	}
	
	protected function getApproveTypeSubSelect($approvetype_name) {
		$approveTypeSubSelect = new Select();
		$approveTypeSubSelect->from('approvetype')
							->column('approvetype_id')
							->where("approvetype_name = '{$approvetype_name}'")
							->limit(1);

		return $approveTypeSubSelect;
	}

	/**
	 * Adds the created by subquery as a column
	 *
	 * @param \NP\invoice\InvoiceSelect Returns caller object for easy chaining
	 */
	public function columnCreatedBy() {
		$subSelect = new Select();
		$subSelect->from(array('__ra'=>'recauthor'))
					->columns(array(new Expression("__p.person_firstname + ' ' + __p.person_lastname")))
					->join(array('__ur' => 'userprofilerole'),
							'__ra.userprofile_id = __ur.userprofile_id',
							array())
					->join(array('__s' => 'staff'),
							'__ur.tablekey_id = __s.staff_id',
							array())
					->join(array('__p' => 'person'),
							'__s.person_id = __p.person_id',
							array())
					->where("__ra.tablekey_id = i.invoice_id
						AND __ra.table_name = 'invoice'");
		
		return $this->column($subSelect, 'created_by');
	}
	
}