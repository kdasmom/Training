/**
 * Model for an Invoice entity
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.invoice.Invoice', {
    extend: 'NP.lib.data.Model',
    
    requires: ['NP.lib.core.Config'],
    
    idProperty: 'invoice_id',
    fields: [
    	{ name: 'invoice_id', type: 'int' },
    	{ name: 'integration_package_id', type: 'int' },
    	{ name: 'invoicepayment_type_id', type: 'int' },
    	{ name: 'paytablekey_id', type: 'int' },
    	{ name: 'property_id', type: 'int' },
    	{ name: 'invoice_amount', type: 'number' },
    	{ name: 'invoice_ref' },
    	{ name: 'invoice_datetm', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
    	{ name: 'invoice_createddatetm', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
    	{ name: 'invoice_duedate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
    	{ name: 'invoice_status' },
    	{ name: 'invoice_note' },
		{ name: 'invoice_submitteddate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
		{ name: 'invoice_startdate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
		{ name: 'invoice_endate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
		{ name: 'invoice_reject_note' },
		{ name: 'invoice_period', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
		{ name: 'control_amount', type: 'number' },
		{ name: 'invoice_taxallflag' },
		{ name: 'invoice_budgetoverage_note' },
		{ name: 'invoice_cycle_from', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
		{ name: 'invoice_cycle_to', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
		{ name: 'universal_field1' },
		{ name: 'universal_field2' },
		{ name: 'universal_field3' },
		{ name: 'universal_field4' },
		{ name: 'universal_field5' },
		{ name: 'universal_field6' },
		{ name: 'universal_field7' },
		{ name: 'universal_field8' },
		{ name: 'priorityflag_id_alt', type: 'int' },
		{ name: 'invoice_neededby_datetm', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
		{ name: 'vendor_code' },
		{ name: 'remit_advice', type: 'int' }
    ],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'InvoiceService',
			action: 'get'
		}
    }
});