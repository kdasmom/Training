/**
 * GL Account Setup > GLAccounts section > Form
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.glaccount.GLAccountsForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.glaccount.glaccountsform',
    
    requires: [
    	'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.view.shared.VendorAssigner',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
    ],

    autoScroll: true,

    bodyPadding: 8,
    
    glNumberFieldText : 'GL Number',
    glNameFieldText : 'GL Name',
    categoryFieldText : 'Category',
    statusFieldText : 'Status',
    typesFieldText : 'Types',

    initComponent: function() {
        
        var defaultWidth = 578;
        
        var bar = [
            { xtype: 'shared.button.cancel', itemId: 'glaccountCancelBtn' },
            { xtype: 'shared.button.save', itemId: 'glaccountSaveBtn' }
        ];
        this.tbar = bar;
        this.bbar = bar;
        
        var glStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : 'getAll'
        });
        glStore.load();
        
        var glTypeStore = Ext.create('NP.store.gl.GlAccountTypes', {
            service : 'GLService',
            action  : 'getTypes'
        });
        glTypeStore.load();
        
        this.items = [
            // GL Number
            { xtype: 'textfield', fieldLabel: this.glNumberFieldText, name: 'glaccount_number', width: defaultWidth, allowBlank: false },
            // GL Name
            { xtype: 'textfield', fieldLabel: this.glNameFieldText, name: 'glaccount_name', width: defaultWidth },
            // Category
            {
                xtype           : 'customcombo',
                emptyText       : this.allCategoriesEmptyText,
                width           : defaultWidth,
                name            : 'glaccount_level',
                displayField    : 'glaccount_name',
                valueField      : 'glaccount_id',
                store           : glStore,
                fieldLabel      : this.categoryFieldText
            },
            // Status
    		{ xtype: 'combo',
                    width: defaultWidth,
                    allowBlank: false,
                    mode:           'local',
                    value:          'mrs',
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
            // Types
            {
                xtype           : 'customcombo',
                emptyText       : this.allCategoriesEmptyText,
                width           : defaultWidth,
                name            : 'glaccount_types',
                displayField    : 'glaccounttype_name',
                valueField      : 'glaccounttype_id',
                store           : glTypeStore,
                fieldLabel      : this.typesFieldText
            },                                
           // Vendor Assignment
           {
                xtype     : 'shared.vendorassigner',
                title     : 'Vendor Assignment',
                hideLabel : true,
                name      : 'vendor_glaccounts',
                fromTitle : 'Unassigned',
                toTitle   : 'Assigned',
                autoScroll: true,
                margin    : 8
            }
        ];

        this.callParent(arguments);
    }
});