Ext.define('NP.store.user.GLs', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.gl.GLAccount',
	
    // Overriding the model's default proxy
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'UserService',
			action: 'getUserGLAccounts'
		}
    }
});