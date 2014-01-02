/**
 * Model for a DfSplit
 *
 * @author Thomas MEssier
 */
Ext.define('NP.model.system.DfSplit', {
	extend: 'Ext.data.Model',
	
	requires: [
		'NP.lib.core.Config',
		'NP.model.vendor.Vendorsite',
		'NP.model.user.Userprofile'
	],

	idProperty: 'dfsplit_id',
	fields: [
		{ name: 'dfsplit_id', type: 'int' },
		{ name: 'dfsplit_name' },
		{ name: 'dfsplit_status', defaultValue: 'active' },
		{ name: 'vendorsite_id', type: 'int' },
		{ name: 'dfsplit_datetm', type: 'date' },
		{ name: 'integration_package_id', type: 'int' },
		{ name: 'dfsplit_update_datetm', type: 'date' },
		{ name: 'dfsplit_update_userprofile', type: 'int' },

		// This is a computed fields that doesn't exist in the table
		{ name: 'alert' },

		{ name: 'userprofile_username' }, // for dfsplit_update_userprofile

		{ name: 'vendor_id', type: 'int' },
		{ name: 'vendor_id_alt' },
		{ name: 'vendor_name' }		
	]
});