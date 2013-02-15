Ext.define('NP.store.PropertyUnits', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.property.Unit',
	
	// Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'PropertyService',
			action: 'getUnits'
		}
    }
});