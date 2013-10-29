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
        'NP.lib.core.Translator',
    	'NP.view.shared.PropertyAssigner'
    ],

    layout: {
    	type: 'vbox',
    	align: 'stretch'
    },

    padding: 8,

    initComponent: function() {
        var me = this,
            codingPropertyLabel = NP.Translator.translate(
                '{properties} for Coding Access Only',
                { properties: NP.Config.getPropertyLabel(true) }
            );

        me.title = NP.Translator.translate('Permissions');

    	me.defaults = { flex: 1 };
    	var propertyStore = Ext.create('NP.store.property.Properties', {
		                       service : 'PropertyService',
		                       action  : 'getAll'
		                    });
    	propertyStore.load();

    	me.items = [
    		{ xtype: 'shared.propertyassigner', store: propertyStore },
    		{ xtype: 'shared.propertyassigner', store: propertyStore, name: 'coding_properties', fieldLabel: codingPropertyLabel }
    	];

    	me.callParent(arguments);
    }
});