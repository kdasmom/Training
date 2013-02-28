<?php

namespace NP\invoice;

use NP\core\AbstractGateway;

class InvoiceItemGateway extends AbstractGateway {
	
	public function findByInvoice($invoice_id) {
		return $this->find(
			'invoice_id = ?',
			array($invoice_id),
			'invoiceitem_linenum ASC'
		);
	}
	
	public function getByInvoice($invoice_id, $invoiceitem_id=null) {
		$select = new sql\InvoiceItemSelect(array('ii'=>'invoiceitem'));
		
		if ($invoiceitem_id != null) {
			$where = "ii.invoiceitem_id = ?";
			$params = array($invoiceitem_id);
		} else {
			$where = "ii.invoice_id = ?";
			$params = array($invoice_id);
		}
		
		$select->joinGL(array("glaccount_id", "glaccount_name", "glaccount_number"))
				->joinProperty(array("property_id", "property_name", "property_id_alt"))
				->joinUtil(array("utilityaccount_id", "utilityaccount_accountnumber", "utilityaccount_metersize"))
				->joinJobcost(
					array("jbcontract_id","jbcontract_name","jbcontract_desc"), 
					array("jbchangeorder_id", "jbchangeorder_name", "jbchangeorder_desc"), 
					array("jbjobcode_id", "jbjobcode_name", "jbjobcode_desc"),
					array("jbphasecode_id", "jbphasecode_name", "jbphasecode_desc"),
					array("jbcostcode_id", "jbcostcode_name", "jbcostcode_desc")
				)
				->joinUnitTypeMaterial(array('unittype_material_id','unittype_material_name'))
				->joinUnitTypeMeas(array('unittype_meas_id','unittype_meas_name'))
				->where($where)
				->order("ii.invoiceitem_linenum, ii.invoiceitem_description, ii.invoiceitem_id");
		
		return $this->adapter->query($select, $params);
	}
	
}

?>