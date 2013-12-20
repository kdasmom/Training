/**
 * Model for a Role
 *
 * @author Thomas Messier
 */
Ext.define('NP.model.user.Role', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.user.Userprofile'
	],

	idProperty: 'role_id',
	fields: [
		{ name: 'role_id', type: 'int' },
		{ name: 'asp_client_id', type: 'int' },
		{ name: 'role_name' },
		{ name: 'table_name' },
		{ name: 'role_entrypage' },
		{ name: 'is_admin_role', type: 'int' },
		{ name: 'role_updated_by', type: 'int' },
		{ name: 'role_updated_datetm', type: 'date' },
		{ name: 'role_dashboard_layout' },

		// These fields are not database columns
		{ name: 'role_user_count', type: 'int' },

		{ name: 'userprofile_username' } // for role_updated_by
	],

	validations: [
		{ field: 'role_name', type: 'length', max: 255 },
		{ field: 'table_name', type: 'length', max: 100 },
		{ field: 'role_entrypage', type: 'length', max: 200 },
		{ field: 'is_admin_role', type: 'presence' }
	]
});