Ext.define('NP.store.user.Regions', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.property.Region',
	
	autoLoad: true,

    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'UserService',
			action: 'getRegions'
		}
    }
});