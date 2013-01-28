Ext.define('NP.store.PropertyUnits', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.Unit',
	
	// Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'property.PropertyService',
			action: 'getUnits'
		}
    }
});