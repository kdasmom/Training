Ext.define('NP.store.InvoiceItemProperties', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.Property',
	
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'property.PropertyService',
			action: 'getForInvoiceItemComboBox'
		}
    }
});