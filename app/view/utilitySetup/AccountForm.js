/**
 * @author Baranov A.V.
 * @date 9/25/13
 */

Ext.define('NP.view.utilitySetup.AccountForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias : 'widget.utilitysetup.accountform',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.SaveAndAdd',
        'NP.lib.ui.ComboBox',
        'NP.lib.ui.AutoComplete',
        'NP.view.shared.PropertyCombo',
        'NP.view.shared.GlCombo'
    ],

    // for localization
    title                         : 'Utility Account',
    vendorInputLabel              : 'Vendor',
    utilityTypeInputLabel         : 'Utility type',
    accountNumberInputLabel       : 'Account number',
    propertyInputlabel            : 'Property',
    unitInputLabel                : 'Default' + ' ' + NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit'),
    meterInputLabel               : 'Meter Number',
    glaccountInputLabel           : 'Default GL Account',
    emptyTextForDependedByProperty: 'Choose property first',

    initComponent: function() {
        var that = this,
            bar = [
                { xtype: 'shared.button.cancel' },
                { xtype: 'shared.button.save' },
                { xtype: 'shared.button.saveandadd', hidden: true }
            ];

        this.tbar = bar;
        this.bbar = bar;

        this.defaults = {
            labelWidth: 125,
            padding   : '5',
            width     : 500
        };

        this.items = [
            {
                xtype     : 'displayfield',
                fieldLabel: this.vendorInputLabel,
                name      : 'vendor_name'
            },{
                xtype       : 'customcombo',
                fieldLabel  : this.utilityTypeInputLabel,
                name        : 'UtilityType_Id',
                valueField  : 'UtilityType_Id',
                displayField: 'UtilityType',
                allowBlank  : false,
                store       : Ext.create('NP.store.vendor.UtilityTypes', {
                                service: 'UtilityService',
                                action: 'getUtilTypesByVendorsiteId',
                                extraParams: {
                                    vendorsite_id: null
                                }
                            })
            },{
                xtype     : 'textfield',
                fieldLabel: this.accountNumberInputLabel,
                name      : 'UtilityAccount_AccountNumber',
                allowBlank: false
            },{
                xtype          : 'shared.propertycombo',
                fieldLabel     : this.propertyInputlabel,
                minChars       : 1,
                dependentCombos: ['unitField'],
                allowBlank     : false
            },{
                xtype         : 'customcombo',
                fieldLabel    : this.unitInputLabel,
                emptyText     : this.emptyTextForDependedByProperty,
                name          : 'unit_id',
                itemId        : 'unitField',
                displayField  : 'unit_number',
                valueField    : 'unit_id',
                queryMode     : 'local',
                autoSelect    : true,
                forceselection: true,
                store         : Ext.create('NP.store.property.Units', {
                                    service: 'PropertyService',
                                    action: 'getUnits',
                                    extraParams: {
                                        property_id: null,
                                        unit_status: 'active'
                                    }
                                })
            },{
                xtype     : 'textfield',
                fieldLabel: this.meterInputLabel,
                name      : 'UtilityAccount_MeterSize'
            },{
                xtype    : 'shared.glcombo',
                minChars : 1,
                emptyText: (NP.Config.getSetting('CP.PROPERTYGLACCOUNT_USE', '0') == '1') ? this.emptyTextForDependedByProperty : null,
                store    : Ext.create('NP.store.gl.GlAccounts', {
                            service: 'GLService',
                            action : 'getByVendorsite',
                            extraParams: {
                                vendorsite_id : null,
                                property_id   : null
                            }
                        })
            },{
                xtype: 'hidden',
                name : 'vendorsite_id',
                value: ''
            }
        ];

        this.callParent(arguments);

        this.addEvents('selectproperty');
    }

});
