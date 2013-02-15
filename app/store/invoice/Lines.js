Ext.define('NP.store.invoice.Lines', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.invoice.InvoiceItem',
	
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'InvoiceService',
			action: 'getInvoiceLines'
		}
    }
});