Ext.define('NP.model.invoice.InvoiceItem', {
    extend: 'NP.lib.data.Model',
    
    idProperty: 'invoiceitem_id',
    fields: [
    	{ name: 'invoiceitem_id', type: 'int' }
		,{ name: 'invoiceitem_linenum', type: 'int' }
		,{ name: 'invoiceitem_description', type: 'string' }
		,{ name: 'invoiceitem_description_alt', type: 'string' }
		,{ name: 'invoiceitem_quantity', type: 'number', defaultValue: 1 }
		,{ name: 'invoiceitem_unitprice', type: 'number' }
		,{ name: 'invoiceitem_amount', type: 'number' }
		,{ name: 'invoiceitem_budgetvariance', type: 'number' }
		,{ name: 'invoiceitem_salestax', type: 'number' }
		,{ name: 'invoiceitem_shipping', type: 'number' }
		,{ name: 'invoiceitem_taxflag', type: 'string' }
		,{ name: 'invoiceitem_split', type: 'int' }
		,{ name: 'invoiceitem_jobflag', type: 'int' }
		,{ name: 'universal_field1', type: 'string', convert: NP.lib.core.Util.modelStringConverter }
		,{ name: 'universal_field2', type: 'string', convert: NP.lib.core.Util.modelStringConverter }
		,{ name: 'universal_field3', type: 'string', convert: NP.lib.core.Util.modelStringConverter }
		,{ name: 'universal_field4', type: 'string', convert: NP.lib.core.Util.modelStringConverter }
		,{ name: 'universal_field5', type: 'string', convert: NP.lib.core.Util.modelStringConverter }
		,{ name: 'universal_field6', type: 'string', convert: NP.lib.core.Util.modelStringConverter }
		,{ name: 'universal_field7', type: 'string', convert: NP.lib.core.Util.modelStringConverter }
		,{ name: 'universal_field8', type: 'string', convert: NP.lib.core.Util.modelStringConverter }
		,{ name: 'vcitem_number', type: 'string' }
		,{ name: 'vcitem_uom', type: 'string' }
		,{ name: 'is_from_catalog', type: 'int' }
		,{ name: 'reftable_name', type: 'string' }
		,{ name: 'reftablekey_id', type: 'int' }
		,{ name: 'invoice_id', type: 'int' }
		,{ name: 'dfsplit_id', type: 'int' }
		,{ name: 'dfsplit_name', type: 'string' }
		,{ name: 'utilityaccount_id', type: 'int' }
		,{ name: 'utilityaccount_accountnumber', type: 'string' }
		,{ name: 'utilityaccount_metersize', type: 'string' }
		,{ name: 'utilitycolumn_usagetype_id', type: 'int' }
		,{ name: 'utilitycolumn_usagetype_name', type: 'string' }
		,{ name: 'unittype_material_id', type: 'int' }
		,{ name: 'unittype_material_name', type: 'string' }
		,{ name: 'unittype_meas_id', type: 'int' }
		,{ name: 'unittype_meas_name', type: 'string' }
		,{ name: 'property_id', type: 'int' }
		,{ name: 'property_id_alt', type: 'string' }
		,{ name: 'property_name', type: 'string' }
		,{ name: 'glaccount_id', type: 'int' }
		,{ name: 'glaccount_name', type: 'string' }
		,{ name: 'glaccount_number', type: 'string' }
		,{ name: 'unit_id', type: 'int' }
		,{ name: 'unit_id_alt', type: 'string' }
		,{ name: 'unit_number', type: 'string' }
		,{ name: 'purchaseorder_id', type: 'int' }
		,{ name: 'purchaseorder_ref', type: 'string' }
		,{ name: 'poitem_amount', type: 'number' }
		,{ name: 'budget_amount', type: 'number' }
		,{ name: 'budget_allocated', type: 'number' }
		,{ name: 'budget_variance', type: 'number', convert: function(val, rec) { return rec.get('budget_amount') - rec.get('budget_allocated'); }}
		,{ name: 'jbcontract_id', type: 'int' }
		,{ name: 'jbcontract_name', type: 'string' }
		,{ name: 'jbcontract_desc', type: 'string' }
		,{ name: 'jbjobcode_id', type: 'int' }
		,{ name: 'jbjobcode_name', type: 'string' }
		,{ name: 'jbjobcode_desc', type: 'string' }
		,{ name: 'jbcostcode_id', type: 'int' } 
		,{ name: 'jbcostcode_name', type: 'string' }
		,{ name: 'jbcostcode_desc', type: 'string' }
		,{ name: 'jbchangeorder_id', type: 'int' }
		,{ name: 'jbchangeorder_name', type: 'string' }
		,{ name: 'jbchangeorder_desc', type: 'string' }
		,{ name: 'jbphasecode_id', type: 'int' }
		,{ name: 'jbphasecode_name', type: 'string' }
		,{ name: 'jbphasecode_desc', type: 'string' }
		,{ name: 'jbassociation_retamt', type: 'number' }
		,{ name: 'jbcontractbudget_id', type: 'int' }
		,{ name: 'jbcontractbudget_amt', type: 'number' }
		,{ name: 'jbcontractbudget_amt_actual', type: 'number' }
		,{ name: 'jbcontractbudget_amt_pnactual', type: 'number' }
    ]
});