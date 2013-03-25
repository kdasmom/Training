/**
 * Store for Invoices. This store uses the invoice fields from the model and adds onto them, allowing to use
 * different fields that come from joining tables to invoice.
 *
 * @author Thomas Messier
 */
Ext.define('NP.store.invoice.Invoice', {
    extend: 'NP.lib.data.Store',
	
    requires: ['NP.lib.core.Config','NP.model.invoice.Invoice'],

    constructor: function(cfg) {
    	Ext.apply(this, cfg);

    	this.fields = NP.model.invoice.Invoice.getFields();
    	this.fields.push(
    		{ name: 'integration_package_type_display_name' },
    		{ name: 'vendor_id', type: 'int' },
    		{ name: 'vendor_id_alt' },
    		{ name: 'vendor_name' },
    		{ name: 'property_id_alt' },
    		{ name: 'property_name' },
    		{ name: 'userprofile_id', type: 'int' },
	    	{ name: 'userprofile_username' },
	    	{ name: 'created_by' },
			{ name: 'rejected_datetm', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
			{ name: 'rejected_by' },
			{ name: 'invoice_pending_days', type: 'int' },
			{ name: 'invoice_onhold_by' },
			{ name: 'invoice_days_onhold', type: 'int' }
    	);

    	this.callParent(arguments);
    }    
});