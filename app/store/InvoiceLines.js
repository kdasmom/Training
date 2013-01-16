Ext.define('NP.store.InvoiceLines', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.InvoiceItem',
	
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'invoice.InvoiceService',
			action: 'getInvoiceLines'
		}
    }
});