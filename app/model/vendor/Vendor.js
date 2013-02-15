Ext.define('NP.model.vendor.Vendor', {
	extend: 'Ux.data.Model',
	
    idProperty: 'vendor_id',
    fields: [
    	{ name: 'vendor_id', type: 'int' },
    	{ name: 'vendorsite_id', type: 'int' },
    	{ name: 'vendor_id_alt', type: 'string' },
    	{ name: 'vendor_name', type: 'string' },
    	{ name: 'address_line1', type: 'string' },
    	{ name: 'address_city', type: 'string' },
    	{ name: 'address_state', type: 'string' },
    	{ name: 'address_zip', type: 'string' }
	],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'VendorService',
			action: 'get'
		}
    }
});
