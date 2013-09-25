/**
 * @author Baranov A.V.
 * @date 9/25/13
 */


Ext.define('NP.view.utilitySetup.VendorAccountsList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.utilitysetup.vendoraccountlist',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.View',
        'NP.lib.ui.Grid',
        'NP.lib.ui.ComboBox',
        'NP.view.shared.PropertyCombo',
        'NP.view.utilitySetup.AccountsGrid'
    ],

    // For localization
    createNewUserBtnLabel: 'Create New User',
    nameColText          : 'Name',
    groupColText         : 'Group',
    usernameColText      : 'Username',
    lastUpdatedColText   : 'Last Updated',
    statusColText        : 'Status',
    addNewAccountButtonText: 'Add New Account',
    layout: {
        type : 'vbox',
        align: 'stretch'
    },
    border: false,

    initComponent: function() {
        var that = this;

        var bar = [
            {
                xtype: 'shared.button.cancel'
            },
            {
                xtype: 'shared.button.new',
                text: this.addNewAccountButtonText
            }
        ];
        this.tbar = bar;
        this.bbar = bar;

        var utilityTypesStore = Ext.create('NP.store.utility.UtilityTypes', {
            service     : 'UtilityTypeService',
            action      : 'findAll'
        });

        var glaccountStore = Ext.create('NP.store.gl.GlAccounts', {
            service     : 'GLService',
            action      : 'getAll'
        });

        utilityTypesStore.load();
        glaccountStore.load();

        var filterLabelWidth = 80;
        var filterButtonWidth = 120;

        this.items = [
            {
                xtype   : 'panel',
                layout: 'column',
                border: false,
                margin: '0 0 8 0',
                defaults: {
                    margin: '0 16 0 16'
                },
                dockedItems: {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    layout: { pack: 'center' },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Filter',
                            width: filterButtonWidth,
                            handler: Ext.bind(this.applyFilter, this)
                        },{
                            xtype: 'button',
                            text: 'Reset',
                            width: filterButtonWidth,
                            margin: '0 0 0 5',
                            handler: Ext.bind(this.clearFilter, this)
                        }
                    ]
                },
                items: [
                    {
                        xtype: 'container',
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [
                            {
                                xtype           : 'autocomplete',
                                fieldLabel      : 'Vendor',
                                name            : 'vendor_id',
                                displayField    : 'vendor_name',
                                width           : 337,
                                valueField      : 'vendorsite_id',
                                allowBlank      : false,
                                multiSelect     : false,
                                store           : Ext.create('NP.store.vendor.Vendors', {
                                    service     : 'VendorService',
                                    action      : 'getForCatalogDropDown'
                                })
                            },{
                                xtype                : 'shared.propertycombo',
                                emptyText            : 'All',
                                loadStoreOnFirstQuery: true,
                                labelWidth           : filterLabelWidth
                            }
                        ]
                    },{
                        xtype: 'container',
                        columnWidth: 0.5,
                        layout: 'form',
                        items: [
                            {
                                xtype       : 'customcombo',
                                name        : 'utilitytype_id',
                                fieldLabel  : 'Utility Type',
                                labelWidth  : filterLabelWidth,
                                store       : utilityTypesStore,
                                valueField  : 'UtilityType_Id',
                                displayField: 'UtilityType',
                                emptyText   : 'All',
                                queryMode   : 'local'
                            },
                            {
                                xtype       : 'customcombo',
                                name        : 'glaccount_id',
                                fieldLabel  : 'GL Account',
                                labelWidth  : filterLabelWidth,
                                store       : glaccountStore,
                                valueField  : 'glaccount_id',
                                displayField: 'glaccount_name',
                                emptyText   : 'All'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'utilitysetup.accountsgrid'
            }
        ];

        this.callParent(arguments);

        this.vendorFilter   = this.query('[name="vendor_id"]')[0];
        this.propertyFilter = this.query('[name="property_id"]')[0];
        this.utilitytyperoleFilter     = this.query('[name="utilitytype_id"]')[0];
        this.glaccountFilter   = this.query('[name="glaccount_id"]')[0];

        this.filterFields = ['vendorFilter','propertyFilter','utilitytyperoleFilter','glaccountFilter'];
    }
});