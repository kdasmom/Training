<?php

namespace NP\invoice;

use NP\core\AbstractGateway;
use NP\core\SqlSelect;

use Zend\Db\Sql\Expression;

class InvoiceItemGateway extends AbstractGateway {
	
	public function findByInvoice($invoice_id) {
		return $this->find(
			'invoice_id = ?',
			array($invoice_id),
			'invoiceitem_linenum ASC'
		);
	}
	
	public function getByInvoice($invoice_id, $invoiceitem_id=null) {
		$select = new InvoiceItemSelect(array('ii'=>'invoiceitem'));
		
		if ($invoiceitem_id != null) {
			$where = "invoiceitem.invoiceitem_id = ?";
			$params = array($invoiceitem_id);
		} else {
			$where = "invoiceitem.invoice_id = ?";
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
				->joinUnitTypeMaterial("unittype_material_id", "unittype_material_name")
				->joinUnitTypeMeas("unittype_meas_id", "unittype_meas_name")
				->where($where)
				->order("invoiceitem.invoiceitem_linenum, invoiceitem.invoiceitem_description, invoiceitem.invoiceitem_id");
		
		return $this->executeSelectWithParams($select, $params);
	}
	
}

?>