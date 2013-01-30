Ext.define('NP.store.user.UserDelegations', {
	extend: 'Ext.data.Store',
	
	model: 'NP.model.user.UserDelegation',
	
	autoLoad: true,

    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'user.UserService',
			action: 'getDelegationsTo',
			delegation_status: 1
		}
    }
});