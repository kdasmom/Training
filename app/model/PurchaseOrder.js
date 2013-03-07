Ext.define('NP.model.PurchaseOrder', {
    extend: 'NP.lib.data.Model',
    idProperty: 'purchaseorder_id',
    fields: [
    	{ name: 'purchaseorder_id', type: 'int' },
    	{ name: 'vendor_id', type: 'int' },
    	{ name: 'vendor_id_alt', type: 'string' },
    	{ name: 'vendorsite_id', type: 'int' },
    	{ name: 'vendor_name', type: 'string' },
    	{ name: 'property_id', type: 'int' },
    	{ name: 'property_id_alt', type: 'string' },
    	{ name: 'property_name', type: 'string' },
    	{ name: 'userprofile_id', type: 'int' },
    	{ name: 'userprofile_username', type: 'string' },
    	{ name: 'purchaseorder_amount', type: 'number' },
    	{ name: 'purchaseorder_ref', type: 'string' }
    ],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'POService',
			action: 'get'
		}
    }
});