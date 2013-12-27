/**
 * Model for a Userprofilerole
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.Userprofilerole', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.model.user.Staff',
        'NP.lib.data.JsonFlat'
	],

	idProperty: 'userprofilerole_id',
	fields: [
		{ name: 'userprofilerole_id', type: 'int' },
		{ name: 'userprofile_id', type: 'int' },
		{ name: 'role_id', type: 'int' },
		{ name: 'tablekey_id', type: 'int' },
		{ name: 'userprofilerole_status', defaultValue: 'active' }
	],

	validations: [
		{ field: 'role_id', type: 'presence' },
		{ field: 'userprofilerole_status', type: 'presence' },
		{ field: 'userprofilerole_status', type: 'length', max: 50 }
	]
});