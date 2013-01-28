Ext.define('NP.store.UserRegions', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.Region',
	
	autoLoad: true,

    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'user.UserService',
			action: 'getRegions'
		}
    }
});