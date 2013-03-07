Ext.define('NP.model.user.UserDelegation', {
	extend: 'NP.lib.data.Model',

    requires: 'NP.lib.core.Config',

    idProperty: 'delegation_id',
    fields: [
    	{ name: 'delegation_id', type: 'int' },
    	{ name: 'delegation_startdate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
        { name: 'delegation_stopdate', type: 'date', dateFormat: NP.lib.core.Config.getServerDateFormat() },
    	{ name: 'delegation_to_userprofile_id', type: 'int' },
    	{ name: 'userprofile_id', type: 'int' },
    	{ name: 'userprofile_username' },
    	{ name: 'role_id', type: 'int' },
    	{ name: 'person_firstname' },
        { name: 'person_lastname' }
	]
});
