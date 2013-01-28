Ext.define('NP.store.UserGLs', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.GLAccount',
	
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'user.UserService',
			action: 'getUserGLAccounts'
		}
    }
});