Ext.define('NP.store.user.Properties', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.property.Property',
	
	autoLoad: true,

    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'UserService',
			action: 'getProperties'
		}
    }
});