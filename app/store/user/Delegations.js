Ext.define('NP.store.user.Delegations', {
	extend: 'Ext.data.Store',
	
	requires: ['NP.lib.core.Security'],

	model: 'NP.model.user.UserDelegation',
	
	// Adding a listener to add the current user to the store as the topmost user
	listeners: {
    	load: function(store, recs) {
    		var currentUser = NP.lib.core.Security.getDelegatedToUser();
    		store.insert(0, {
				userprofile_username: currentUser.get('userprofile_username'),
				userprofile_id      : currentUser.get('userprofile_id')
    		});
    	}
    },

    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'UserService',
			action: 'getDelegationsTo',
			delegation_status: 1
		}
    }
});