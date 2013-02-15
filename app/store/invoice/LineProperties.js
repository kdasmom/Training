Ext.define('NP.store.invoice.LineProperties', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.property.Property',
	
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'PropertyService',
			action: 'getForInvoiceItemComboBox'
		}
    }
});