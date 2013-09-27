/**
 * @author Baranov A.V.
 * @date 9/25/13
 */


Ext.define('NP.view.utilitySetup.VendorAccountsList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.utilitysetup.vendoraccountslist',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Delete',
        'NP.view.shared.button.Print',
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
    title: 'Utility Accounts',
    vendorColText: 'Vendor',
    vendorIdColText: 'VendorID',
    utilityTypeColText: 'Utility',
    accountColText: 'Account',
    meterColText:  'Meter',
    glAccountColText:  'GLAccount',
    propertyColText:  'Property',
    unitColText:  'Unit/Dept',

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
            },
            {
                xtype: 'shared.button.delete'
            },
            {
                xtype: 'shared.button.print'
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
                xtype   : 'customgrid',
                border  : false,
                paging  : true,
                flex    : 1,
                selModel: Ext.create('Ext.selection.CheckboxModel'),
                stateful: true,
                stateId : 'utility_accounts_grid',
                store   : Ext.create('NP.store.utility.UtilityAccounts', {
                    service    : 'UtilityAccountService',
                    action     : 'getAll',
                    paging     : true,
                    extraParams: {
                        vendor_id       : null,
                        property_id     : null,
                        utilitytype_id  : null,
                        glaccount_id    : null
                    }
                }),
                columns : [
                    {
                        text: this.vendorColText,
                        dataIndex: 'vendor_name',
                        flex: 1,
                        renderer: function(val, meta, rec) {
                            val = rec.raw.vendor_name;

                            return val;
                        }
                    },
                    {
                        text: this.vendorIdColText,
                        dataIndex: 'vendor_id',
                        flex: 1,
                        renderer: function(val, meta, rec) {
                            val = rec.raw.vendor_id;

                            return val;
                        }
                    },
                    {
                        text: this.utilityTypeColText,
                        dataIndex: 'utilitytype',
                        flex: 1,
                        renderer: function(val, meta, rec) {
                            val = rec.raw.utilitytype;

                            return val;
                        }
                    },
                    {
                        text: this.accountColText,
                        dataIndex: 'UtilityAccount_AccountNumber',
                        flex: 1
                    },
                    {
                        text: this.meterColText,
                        dataIndex: 'UtilityAccount_MeterSize',
                        flex: 1
                    },
                    {
                        text: this.glAccountColText,
                        dataIndex: 'glaccount_name',
                        flex: 1
                    },
                    {
                        text: this.propertyColText,
                        dataIndex: 'property_name',
                        flex: 1,
                        renderer: function(val, meta, rec) {
                            val = rec.raw.property_name;

                            return val;
                        }
                    },
                    {
                        text: this.unitColText,
                        dataIndex: 'unit_number',
                        flex: 1,
                        renderer: function(val, meta, rec) {
                            val = rec.raw.unit_number;

                            return val;
                        }
                    },
                    {
                        xtype: 'actioncolumn',
                        items: [
                            {
                                icon: 'resources/images/buttons/edit.gif',
                                tooltip: 'Edit',
                                handler: function(gridView, rowIndex, colIndex) {
                                    var grid = gridView.ownerCt;
                                    grid.fireEvent('editrow', grid, grid.getStore().getAt(rowIndex), rowIndex);
                                }
                            }
                        ],
                        align: 'center'
                    }
                ]
            }
        ];

        this.callParent(arguments);

        this.vendorFilter   = this.query('[name="vendor_id"]')[0];
        this.propertyFilter = this.query('[name="property_id"]')[0];
        this.utilitytyperoleFilter     = this.query('[name="utilitytype_id"]')[0];
        this.glaccountFilter   = this.query('[name="glaccount_id"]')[0];

        this.filterFields = ['vendorFilter','propertyFilter','utilitytyperoleFilter','glaccountFilter'];


        this.addEvents('editrow');
    },

    applyFilter: function() {


        var that = this;

        var grid = this.query('customgrid')[0];

        var currentParams = grid.getStore().getProxy().extraParams;
        var newParams = {
            vendor_id       : this.vendorFilter.getValue(),
            property_id     : this.propertyFilter.getValue(),
            utilitytype_id  : this.utilitytyperoleFilter.getValue(),
            glaccount_id    : this.glaccountFilter.getValue()
        };

        console.log('params: ', newParams);
        console.log('cparams: ', currentParams);

        Ext.Object.each(newParams, function(key, val) {
            if (currentParams[key] !== newParams[key]) {
                grid.getStore().addExtraParams(newParams);
                grid.reloadFirstPage();

                return false;
            }
        });
    },

    clearFilter: function() {
        var that = this;

        Ext.Array.each(this.filterFields, function(field) {
            that[field].clearValue();
        });

        this.applyFilter();
    }
});