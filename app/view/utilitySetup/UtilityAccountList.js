/**
 * @author Baranov A.V.
 * @date 9/25/13
 */


Ext.define('NP.view.utilitySetup.UtilityAccountList', {
    extend: 'NP.lib.ui.Grid',
    alias: 'widget.utilitysetup.utilityaccountlist',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.New',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.Delete',
        'NP.lib.ui.Grid',
        'NP.lib.ui.ComboBox',
        'NP.view.shared.PropertyCombo',
        'NP.view.shared.GlCombo',
        'NP.view.property.gridcol.PropertyName',
        'NP.view.gl.gridcol.GlAccountName',
        'NP.view.property.gridcol.UnitNumber',
        'NP.store.gl.GlAccounts',
        'NP.store.vendor.UtilityTypes'
    ],

    // For localization
    createNewUserBtnLabel  : 'Create New User',
    nameColText            : 'Name',
    groupColText           : 'Group',
    usernameColText        : 'Username',
    lastUpdatedColText     : 'Last Updated',
    statusColText          : 'Status',
    addNewAccountButtonText: 'Add New Account',
    title                  : 'Utility Accounts',
    vendorColText          : 'Vendor',
    vendorIdColText        : 'Vendor ID',
    utilityTypeColText     : 'Utility',
    accountColText         : 'Account',
    meterColText           :  'Meter',

    initComponent: function() {
        var that = this,
            utilityTypesStore = Ext.create('NP.store.vendor.UtilityTypes', {
                service     : 'UtilityService',
                action      : 'getAllUtilityTypes'
            }),
            glaccountStore = Ext.create('NP.store.gl.GlAccounts', {
                service     : 'GLService',
                action      : 'getAll'
            }),
            filterLabelWidth  = 60,
            filterButtonWidth = 120;

        utilityTypesStore.load();
        glaccountStore.load();

        this.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        xtype: 'shared.button.new',
                        text: this.addNewAccountButtonText
                    },{
                        xtype: 'shared.button.delete'
                    }
                ]
            },{
                xtype: 'toolbar',
                dock: 'top',
                defaults: { margin: '0 4 0 0' },
                items: [
                    {
                        xtype                : 'shared.propertycombo',
                        emptyText            : 'All',
                        loadStoreOnFirstQuery: true,
                        labelWidth           : 50,
                        minChars             : 1,
                        margin               : '0 4 0 4'
                    },{
                        xtype       : 'shared.glcombo',
                        fieldLabel  : 'GL Account',
                        labelWidth  : filterLabelWidth,
                        store       : Ext.create('NP.store.gl.GlAccounts', {
                                            service: 'GLService',
                                            action : 'getByVendorsite',
                                            extraParams: {
                                                vendorsite_id : null,
                                                property_id   : null
                                            }
                                        }),
                        emptyText   : 'All',
                        minChars    : 1
                    },{
                        xtype       : 'customcombo',
                        name        : 'utilitytype_id',
                        fieldLabel  : 'Utility Type',
                        labelWidth  : filterLabelWidth,
                        store       : utilityTypesStore,
                        valueField  : 'UtilityType_Id',
                        displayField: 'UtilityType',
                        emptyText   : 'All',
                        margin      : '0 4 0 4'
                    },{
                        xtype  : 'button',
                        text   : 'Filter',
                        ui     : 'default',
                        handler: Ext.bind(this.applyFilter, this)
                    },{
                        xtype  : 'button',
                        text   : 'Reset',
                        margin : '0 0 0 5',
                        handler: Ext.bind(this.clearFilter, this)
                    }
                ]
            }
        ];

        Ext.apply(this, {
            selModel: Ext.create('Ext.selection.CheckboxModel'),
            stateful: true,
            stateId : 'utility_accounts_grid',
            store   : Ext.create('NP.store.vendor.UtilityAccounts', {
                service    : 'UtilityService',
                action     : 'getAccountsByVendorsite',
                paging     : true,
                extraParams: {
                    property_id     : null,
                    utilitytype_id  : null,
                    glaccount_id    : null
                }
            }),
            columns : [
                {
                    text: this.utilityTypeColText,
                    dataIndex: 'UtilityType',
                    flex: 1
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
                    xtype: 'gl.gridcol.glaccountname',
                    flex : 1
                },
                {
                    xtype: 'property.gridcol.propertyname',
                    flex : 1
                },
                {
                    xtype: 'property.gridcol.unitnumber',
                    flex : 1
                }
            ]
        });

        this.callParent(arguments);

        this.propertyFilter        = this.query('[name="property_id"]')[0];
        this.utilitytyperoleFilter = this.query('[name="utilitytype_id"]')[0];
        this.glaccountFilter       = this.query('[name="glaccount_id"]')[0];

        this.filterFields = ['propertyFilter','utilitytyperoleFilter','glaccountFilter'];
    },

    applyFilter: function() {
        var me = this;

        me.addExtraParams({
            property_id     : this.propertyFilter.getValue(),
            utilitytype_id  : this.utilitytyperoleFilter.getValue(),
            glaccount_id    : this.glaccountFilter.getValue()
        });

        me.getStore().load();
    },

    clearFilter: function() {
        var me = this;

        Ext.Array.each(me.filterFields, function(field) {
            me[field].clearValue();
        });

        me.applyFilter();
    }
});