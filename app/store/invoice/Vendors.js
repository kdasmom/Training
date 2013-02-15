Ext.define('NP.store.invoice.Vendors', {
    extend: 'Ext.data.Store',
    
    model: 'NP.model.vendor.Vendor',
	
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'VendorService',
			action: 'getForComboBox'
		}
    }
});