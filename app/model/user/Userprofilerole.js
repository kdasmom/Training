/**
 * Model for a Userprofilerole
 *
 * @author 
 */
Ext.define('NP.model.user.Userprofilerole', {
	extend: 'NP.lib.data.Model',
	
	requires: ['NP.lib.core.Config'],

	idProperty: 'userprofilerole_id',
	fields: [
		{ name: 'userprofilerole_id', type: 'int' },
		{ name: 'userprofile_id', type: 'int' },
		{ name: 'role_id', type: 'int' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'userprofilerole_status' }
	],

	validations: [
		{ field: 'userprofilerole_id', type: 'presence' },
		{ field: 'userprofilerole_status', type: 'length', max: 50 }
	]
});