/**
 * GL Account Setup > GLAccounts section > Form
 *
 * @author Aliaksandr Zubik
 */
Ext.define('NP.view.gl.GLAccountsForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias: 'widget.gl.glaccountsform',
    
    requires: [
    	'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.view.shared.VendorAssigner',
        'NP.view.shared.PropertyAssigner',
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
        
//        var glStore = Ext.create('NP.store.gl.GlAccounts', {
//            service : 'GLService',
//            action  : 'getAll'
//        });
//        glStore.load();
        
        var glCategoryStore = Ext.create('NP.store.gl.GlAccounts', {
            service : 'GLService',
            action  : 'getCategories'
        });
        glCategoryStore.load();
        
        var glTypeStore = Ext.create('NP.store.gl.GlAccountTypes', {
            service : 'GLService',
            action  : 'getTypes'
        });
        glTypeStore.load();
        
        var propertyStore = Ext.create('NP.store.property.Properties', {
            service : 'PropertyService',
            action  : 'getAll'
         });
        propertyStore.load();
        
        var vendorStore = Ext.create('NP.store.vendor.Vendors', {
            service : 'VendorService',
            action  : 'getAll'
         });
        vendorStore.load();
        this.items = [
            // GL Number
            { xtype: 'textfield', fieldLabel: this.glNumberFieldText, name: 'glaccount_number', width: defaultWidth, allowBlank: false },
            // GL Name
            { xtype: 'textfield', fieldLabel: this.glNameFieldText, name: 'glaccount_name', width: defaultWidth, allowBlank: false },
            // Category
            {
                xtype       : 'customcombo',
                fieldLabel  : this.categoryFieldText,
                name        : 'glaccount_category',
                width       : defaultWidth,
                store       : glCategoryStore,
                displayField: 'glaccount_name',
                valueField  : 'glaccount_name',
                allowBlank  : false
            },
            // Status
            {
                xtype       : 'customcombo',
                fieldLabel  : this.statusFieldText,
                name        : 'glaccount_status',
                width       : defaultWidth,
                store       : Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'Active', value: 'active'},
                        {name: 'Inactive', value: 'inactive'}
                    ]
                }),
                displayField: 'name',
                valueField  : 'value',
                allowBlank  : false
            },
            // Types
            {
                xtype       : 'customcombo',
                name        : 'glaccounttype_id',
                width       : defaultWidth,
                displayField: 'glaccounttype_name',
                valueField  : 'glaccounttype_id',
                store       : glTypeStore,
                fieldLabel  : this.typesFieldText,
                allowBlank  : false
            },                                
           // Vendor Assignment
           {
                xtype     : 'shared.vendorassigner',
                name      : 'vendors',
                store     : vendorStore, 
                autoScroll: true,
                height    : 200
            }
        ];
        // Property Assignment
        if (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE', 0) == 1 && NP.Security.hasPermission(12)) {
             this.items.push(
                     { 
                        xtype     : 'shared.propertyassigner', 
                        name      : 'properties',
                        store     : propertyStore,  
                        autoScroll: true,
                        height    : 200
                    });       
         }       

        this.callParent(arguments);
    }
});