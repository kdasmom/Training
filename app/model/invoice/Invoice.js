Ext.define('NP.model.invoice.Invoice', {
    extend: 'Ux.data.Model',
    
    requires: 'NP.core.Config',
    
    idProperty: 'invoice_id',
    fields: [
    	{ name: 'invoice_id', type: 'int' },
    	{ name: 'integration_package_id', type: 'int' },
		{ name: 'invoicepayment_type_id', type: 'int' },
    	{ name: 'vendor_id', type: 'int' },
    	{ name: 'vendor_id_alt' },
    	{ name: 'vendorsite_id', type: 'int' },
    	{ name: 'vendor_name' },
    	{ name: 'property_id', type: 'int' },
    	{ name: 'property_id_alt' },
    	{ name: 'property_name' },
    	{ name: 'userprofile_id', type: 'int' },
    	{ name: 'userprofile_username' },
    	{ name: 'invoice_amount', type: 'number' },
    	{ name: 'invoice_ref' },
    	{ name: 'invoice_datetm', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
    	{ name: 'invoice_createddatetm', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
    	{ name: 'invoice_duedate', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
    	{ name: 'invoice_status' },
    	{ name: 'invoice_note' },
		{ name: 'invoice_submitteddate', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
		{ name: 'invoice_startdate', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
		{ name: 'invoice_endate', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
		{ name: 'invoice_reject_note' },
		{ name: 'invoice_period', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
		{ name: 'control_amount', type: 'number' },
		{ name: 'invoice_taxallflag' },
		{ name: 'invoice_budgetoverage_note' },
		{ name: 'invoice_cycle_from', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
		{ name: 'invoice_cycle_to', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
		{ name: 'universal_field1' },
		{ name: 'universal_field2' },
		{ name: 'universal_field3' },
		{ name: 'universal_field4' },
		{ name: 'universal_field5' },
		{ name: 'universal_field6' },
		{ name: 'universal_field7' },
		{ name: 'universal_field8' },
		{ name: 'priorityflag_id_alt', type: 'int' },
		{ name: 'invoice_neededby_datetm', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
		{ name: 'vendor_code' },
		{ name: 'remit_advice', type: 'int' },
		{ name: 'created_by' },
		{ name: 'rejected_datetm', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
		{ name: 'rejected_by' }
    ],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'invoice.InvoiceService',
			action: 'get'
		}
    },
    
    getFormattedStatus: function() {
    	var status = this.get('invoice_status');
		var newStatus;
		
		if (status == 'forapproval') {
			newStatus = 'Pending Approval';
		} else if (status == 'open') {
			newStatus = 'In Progress';
		} else if (status == 'saved') {
			newStatus = 'Completed';
		} else if (status == 'approved') {
			newStatus = 'Approved';
		} else if (status == 'draft') {
			newStatus = 'TEMPLATE';
		} else if (status == 'closed') {
			newStatus = 'Invoiced';
		} else if (status == 'void') {
			newStatus = 'Void';
		} else {
			newStatus = status.toUpperCase();
		}
		
		return newStatus;
    },
    
    getFormattedRemitAdvice: function() {
    	return (this.get('remit_advice') == 1) ? 'Yes' : 'No';
    }
});