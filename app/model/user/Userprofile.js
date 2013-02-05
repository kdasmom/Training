Ext.define('NP.model.user.Userprofile', {
	extend: 'Ux.data.Model',
	
    idProperty: 'userprofile_id',
    fields: [
        { name: 'userprofile_id', type: 'int' },
        { name: 'userprofile_username', type: 'string' },
        { name: 'userprofile_preferred_property', type: 'int' },
        { name: 'userprofile_default_dashboard', type: 'int' },
        { name: 'userprofile_splitscreen_size', type: 'int' },
        { name: 'userprofile_splitscreen_ishorizontal', type: 'int' },
        { name: 'userprofile_splitscreen_imageorder', type: 'int' },
        { name: 'userprofile_splitscreen_loadwithoutimage', type: 'int' },
        { name: 'userprofile_preferred_region', type: 'int' }
	],
	
    proxy: {
        type: 'ajax',
        url: 'ajax.php',
		extraParams: {
			service: 'user.UserService',
			action: 'get'
		}
    }
});
