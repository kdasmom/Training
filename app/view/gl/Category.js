/**
 * GL Account Setup > Category
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.gl.Category', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.gl.category',
    
    title: 'Category',
    
    requires: [
        'NP.lib.core.Config',    	
        'NP.view.gl.CategoryGrid',
    	'NP.view.gl.CategoryForm',
        'NP.view.shared.GlCategoryOrder',
    	'NP.view.shared.button.Cancel',
    	'NP.view.shared.button.Save',
    	'NP.view.shared.button.New',
    ],
    
    nameFieldText : 'Name',
    categoryFieldText : 'Category',
    statusFieldText : 'Status',
    
    bind: {
    	models: ['gl.GlAccount']
    },
    bodyPadding: 8,
    
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    initComponent: function() {
        var defaultWidth = 578;
         
        var bar = [
            { xtype: 'shared.button.cancel', itemId: 'glcategoryCancelBtn' },
            { xtype: 'shared.button.save', itemId: 'glcategoryOrderSaveBtn', text: 'Save Order' },
            { xtype: 'shared.button.new', itemId: 'glcategoryNewBtn', text: 'Add new' }
        ];
        this.tbar = bar;
        this.bbar = bar;
        
        var glCategoryStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : 'getCategories'
        });
        glCategoryStore.load();
        this.items = [
    			{
                            xtype: 'gl.categorygrid',
                            store: glCategoryStore,
                            flex: 1
		    	},{
                            xtype: 'gl.categoryform',
                            flex : 1
		    	}
                    ];
    	this.callParent(arguments);
    }
});