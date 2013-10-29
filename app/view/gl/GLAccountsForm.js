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
        'NP.store.gl.GlAccounts',
        'NP.store.gl.GlAccountTypes',
        'NP.store.property.Properties',
        'NP.store.vendor.Vendors',
        'NP.view.shared.VendorAssigner',
        'NP.view.shared.PropertyAssigner',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.SaveAndAdd',
    ],

    autoScroll: true,
      
    bodyPadding: 8,
    
    intPkgText       : 'Integration Package',
    glNumberFieldText: 'GL Number',
    glNameFieldText  : 'GL Name',
    categoryFieldText: 'Category',
    statusFieldText  : 'Status',
    typesFieldText   : 'Types',

    initComponent: function() {
        
        var defaultWidth = 578;
        
        var bar = [
            { xtype: 'shared.button.cancel', itemId: 'glaccountCancelBtn' },
            { xtype: 'shared.button.save', itemId: 'glaccountSaveBtn' },
            { xtype: 'shared.button.saveandadd', itemId: 'glaccountSaveAndCreateNewBtn', text: 'Save and Create New'},
            { xtype: 'button', text: 'Previous', itemId: 'prevGlacoountBtn', hidden: true, iconCls: 'back-btn' },
            { xtype: 'button', text: 'Save and Previous', itemId: 'prevSaveGlacoountBtn', hidden: true, iconCls: 'save-back-btn' },
            { xtype: 'button', text: 'Save and Next', itemId: 'nextSaveGlacoountBtn', hidden: true, iconCls: 'save-next-btn' },
            { xtype: 'button', text: 'Next', itemId: 'nextGlacoountBtn', hidden: true, iconCls: 'next-btn' },
        ];
        this.tbar = bar;
        this.bbar = bar;
               
        this.items = [
            // Ids
            {
                xtype       : 'hidden',
                name        : 'glaccount_id_list',
            },
            // Integration Packages
            {
                xtype       : 'customcombo',
                fieldLabel  : this.intPkgText,
                store       : 'system.IntegrationPackages',
                name        : 'integration_package_id',
                displayField: 'integration_package_name',
                valueField  : 'integration_package_id',
                width       : defaultWidth,
                allowBlank  : false
            },
            // GL Number
            {
                xtype     : 'textfield',
                fieldLabel: this.glNumberFieldText,
                name      : 'glaccount_number',
                width     : defaultWidth,
                allowBlank: false
            },
            // GL Name
            {
                xtype     : 'textfield',
                fieldLabel: this.glNameFieldText,
                name      : 'glaccount_name',
                width     : defaultWidth,
                allowBlank: false
            },
            // Category
            {
                xtype       : 'customcombo',
                fieldLabel  : this.categoryFieldText,
                itemId      : 'gl_category',
                name        : 'tree_parent',
                width       : defaultWidth,
                store       : {
                                type   : 'gl.glaccounts',
                                service: 'GLService',
                                action : 'getCategories'
                            },
                displayField: 'glaccount_name',
                valueField  : 'tree_id',
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
                store       : {
                                type    : 'gl.glaccounttypes',
                                service : 'GLService',
                                action  : 'getTypes',
                                autoLoad: true
                            },
                fieldLabel  : this.typesFieldText,
                allowBlank  : false
            },                                
           // Vendor Assignment
           {
                xtype     : 'shared.vendorassigner',
                itemId    : 'vendors',
                name      : 'vendors',
                store     : {
                                type    : 'vendor.vendors',
                                service : 'VendorService',
                                action  : 'getAll'
                            }, 
                autoScroll: true,
                height    : 200
            }
        ];
        // Property Assignment
        if (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE', 0) == 1 && NP.Security.hasPermission(12)) {
             this.items.push(
                     { 
                        xtype     : 'shared.propertyassigner',
                        itemId    : 'properties',
                        name      : 'properties',
                        store     : {
                                        type   : 'property.properties',
                                        service: 'PropertyService',
                                        action : 'getAll'
                                    },  
                        autoScroll: true,
                        height    : 200
                    });       
         }       
        this.callParent(arguments);
    }
});