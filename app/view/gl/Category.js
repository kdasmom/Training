/**
 * GL Account Setup > Category
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.gl.Category', {
    extend: 'NP.view.shared.PickList',
    alias: 'widget.gl.category',
    
    title: 'Category',
    
    entityType: 'gl.GlAccount',   
    
    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.GlCategoryOrder',
    	'NP.view.shared.button.Cancel',
    	'NP.view.shared.button.Save',
    ],
    
    nameFieldText : 'Name',
    categoryFieldText : 'Category',
    statusFieldText : 'Status',
    
    bind: {
    	models: ['gl.GlAccount']
    },
    bodyPadding: 8,

    initComponent: function() {
        var glCategoryStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : 'getCategories'
        });
        glCategoryStore.load();
        
        this.grid = Ext.create('NP.lib.ui.Grid', {
    		border  : true,
    		selModel: Ext.create('Ext.selection.CheckboxModel', { checkOnly: true }),
    		columns: [
    			{ text: 'Name', dataIndex: 'glaccount_name', flex: 1 }
    			],
    		store: glCategoryStore,
    		flex: 1
    	});

    	this.form = Ext.create('NP.lib.ui.BoundForm', {
    		bind       : {
    			models: ['gl.GlAccount']
    		},
			title      : 'Category',
			layout     : 'form',
			bodyPadding: 8,
			flex       : 1,
			items      : [
    			{
					xtype     : 'textfield',
					fieldLabel: 'Name',
					name      : 'glaccount_name',
					allowBlank: false
    			}
    		]
    	});
    	this.callParent(arguments);
    }
});