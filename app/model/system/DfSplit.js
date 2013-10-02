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
		{ name: 'dfsplit_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'integration_package_id', type: 'int' },
		{ name: 'dfsplit_update_datetm', type: 'date', dateFormat: NP.Config.getServerDateFormat() },
		{ name: 'dfsplit_update_userprofile', type: 'int' },
		// This is a computed fields that doesn't exist in the table
		{ name: 'alert' }
	],
    
    belongsTo: [
        {
        	model     : 'NP.model.vendor.Vendorsite',
            name      : 'vendorsite',
            getterName: 'getVendorsite',
            foreignKey: 'vendorsite_id',
            primaryKey: 'vendorsite_id',
			reader    : 'jsonflat'
        },{
            model     : 'NP.model.user.Userprofile',
            name      : 'updater',
            getterName: 'getUpdater',
            foreignKey: 'dfsplit_update_userprofile',
            primaryKey: 'userprofile_id'
        }
    ]
});