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
        
        this.items = [ 
            {
                xtype     : 'shared.glcategoryorder',
                title     : this.categoryFieldText,
                name      : 'glaccount_order',
                displayField    : 'glaccount_number',
                valueField      : 'glaccount_id',
                autoScroll: true,
                ddReorder: true,
                height : 200,
                width : defaultWidth
            },
        // Status
        	{
    			xtype: 'radiogroup',
    			fieldLabel: this.statusFieldText,
                        width: 250,
                        name: 'glaccount_status',
                        style: 'white-space: nowrap;margin-right:12px;',
    			items: [
		    		{ boxLabel: 'Active', inputValue: 'active', checked: true },
		    		{ boxLabel: 'Inactive', inputValue: 'inactive' }
		    	]
    		},
            //Name
            { xtype: 'textfield', fieldLabel: this.nameFieldText, name: 'glaccount_name', allowBlank: false, width: defaultWidth },
            ],
    	this.callParent(arguments);
    }
});