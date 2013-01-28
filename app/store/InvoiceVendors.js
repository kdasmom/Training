Ext.define('NP.store.InvoiceVendors', {
    extend: 'Ext.data.Store',
    
    model: 'NP.model.Vendor',
	
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'vendor.VendorService',
			action: 'getForComboBox'
		}
    }
});