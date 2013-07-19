/**
 * User Manager > Users tab > Form > Permissions
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.user.UsersFormPermissions', {
    extend: 'Ext.container.Container',
    alias: 'widget.user.usersformpermissions',

    requires: [
    	'NP.lib.core.Config',
    	'NP.view.shared.PropertyAssigner'
    ],

    layout: {
    	type: 'vbox',
    	align: 'stretch'
    },

    padding: 8,

    // For localization
	title              : 'Permissions',
	codingPropertyLabel: NP.Config.getPropertyLabel(true) + ' for Coding Access Only',
    
    initComponent: function() {
    	this.defaults = { flex: 1 };
    	var propertyStore = Ext.create('NP.store.property.Properties', {
		                       service : 'PropertyService',
		                       action  : 'getAll'
		                    });
    	propertyStore.load();

    	this.items = [
    		{ xtype: 'shared.propertyassigner', store: propertyStore },
    		{ xtype: 'shared.propertyassigner', store: propertyStore, name: 'coding_properties', fieldLabel: this.codingPropertyLabel }
    	];

    	this.callParent(arguments);
    }
});