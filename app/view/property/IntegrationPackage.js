/**
 * Property Setup > Integration Package section
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.property.IntegrationPackage', {
    extend: 'NP.view.shared.PickList',
    alias: 'widget.property.integrationpackage',
    
    title: 'Integration Package',

    entityType: 'system.IntegrationPackage',

    initComponent: function() {
    	this.grid = Ext.create('NP.lib.ui.Grid', {
    		border  : false,
    		selModel: Ext.create('Ext.selection.CheckboxModel', { checkOnly: true }),
    		columns: [
    			{ text: 'Name', dataIndex: 'integration_package_name', flex: 1 },
    			{ text: 'Data Source', dataIndex: 'integration_package_datasource', flex: 1 }
    		],
    		store: Ext.create('NP.store.system.IntegrationPackages'),
    		flex: 1
    	});

    	this.form = Ext.create('NP.lib.ui.BoundForm', {
    		bind       : {
    			models: ['system.IntegrationPackage']
    		},
			title      : 'Integration Package',
			layout     : 'form',
			bodyPadding: 8,
			flex       : 1,
			items      : [
    			{
					xtype     : 'textfield',
					fieldLabel: 'Package Name',
					name      : 'integration_package_name',
					allowBlank: false
    			},{
    				xtype     : 'textfield',
					fieldLabel: 'Data Source',
					name      : 'integration_package_datasource',
					allowBlank: false
    			}
    		]
    	});

    	this.callParent(arguments);
    }
});