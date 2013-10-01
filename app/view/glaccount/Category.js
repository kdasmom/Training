/**
 * GL Account Setup > Category
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.glaccount.Category', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.glaccount.category',
    
    title: 'Category',
    
    requires: [
        'NP.lib.core.Config',
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
                xtype           : 'customcombo',
                emptyText       : this.allCategoriesEmptyText,
                width           : defaultWidth,
                name            : 'glaccount_level',
                displayField    : 'glaccount_number',
                valueField      : 'glaccount_id',
                store           : glCategoryStore,
                fieldLabel      : this.categoryFieldText
            },
        // Status
    		{ xtype: 'combo',
                    width: defaultWidth,
                    allowBlank: false,
                    mode:           'local',
                    triggerAction:  'all',
                    forceSelection: true,
                    editable:       false,
                    fieldLabel:     this.statusFieldText,
                    name:           'glaccount_status',
                    displayField:   'name',
                    valueField:     'value',
                    queryMode: 'local',
                    store:          Ext.create('Ext.data.Store', {
                        fields : ['name', 'value'],
                        data   : [
                            {name : 'Active',   value: 'active'},
                            {name : 'Inactive',  value: 'inactive'},
                        ]
                    })},
            //Name
            { xtype: 'textfield', fieldLabel: this.nameFieldText, name: 'glaccount_name', width: defaultWidth },
            ],
    	this.callParent(arguments);
    }
});