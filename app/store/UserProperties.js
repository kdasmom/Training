Ext.define('NP.store.UserProperties', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.Property',
	
	autoLoad: true,

    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'user.UserService',
			action: 'getProperties'
		}
    }
});