Ext.define('NP.model.invoice.InvoicePOForward', {
    extend: 'Ux.data.Model',
    
    requires: 'NP.core.Config',
    
    idProperty: 'invoicepo_forward_id',
    fields: [
    	{ name: 'invoicepo_forward_id' },
    	{ name: 'forward_datetm', type: 'date', dateFormat: NP.core.Config.getServerDateFormat() },
    	{ name: 'forward_to_email' },
    	{ name: 'forward_from_name' },
    	{ name: 'forward_to_name' }
    ]
});