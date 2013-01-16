Ext.define('NP.store.InvoiceForwards', {
    extend: 'Ext.data.Store',
    
    model: 'NP.model.InvoicePOForward',
	
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'invoice.InvoiceService',
			action: 'getForwards'
		},
		sortParam: 'sort'
    }
});