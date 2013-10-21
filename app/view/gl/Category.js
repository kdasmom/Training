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
    
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    initComponent: function() {
        var defaultWidth = 578;
         
        var bar = [
            { xtype: 'shared.button.cancel', itemId: 'glcategoryCancelBtn' },
            { xtype: 'shared.button.save', itemId: 'glcategorySaveBtn' }
        ];
        this.tbar = bar;
        this.bbar = bar;
        
        var glCategoryStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : 'getCategories'
        });
        glCategoryStore.load();
        
        this.items = [{
                xtype     : 'shared.glcategoryorder',
                title     : this.categoryFieldText,
                name      : 'glaccount_order',
                autoScroll: true,
                ddReorder: true,
                height : 200,
                width : defaultWidth
            }],
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
                            fieldLabel: 'Category Name',
                            name      : 'glaccount_name',
                            allowBlank: false
                        },{
                            xtype: 'radiogroup',
                            fieldLabel: this.statusFieldText,
                            width: 250,
                            name: 'glaccount_status',
                            style: 'white-space: nowrap;margin-right:12px;',
                            items: [
                                    { boxLabel: 'Active', inputValue: 'active', checked: true },
                                    { boxLabel: 'Inactive', inputValue: 'inactive' }
                            ]
                        }
                ]
    	});
    	this.callParent(arguments);
    }
});