Ext.define('NP.store.invoice.Forwards', {
    extend: 'Ext.data.Store',
    
    model: 'NP.model.invoice.InvoicePOForward',
	
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'InvoiceService',
			action: 'getForwards'
		},
		sortParam: 'sort'
    }
});