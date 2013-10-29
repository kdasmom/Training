/**
 * @author Baranov A.V.
 * @date 9/25/13
 */

Ext.define('NP.view.utilitySetup.AccountForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias : 'widget.utilitysetup.accountform',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Translator',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.SaveAndAdd',
        'NP.lib.ui.ComboBox',
        'NP.lib.ui.AutoComplete',
        'NP.view.shared.PropertyCombo',
        'NP.view.shared.GlCombo',
        'NP.store.vendor.UtilityTypes'
    ],

    bodyPadding: 8,

    layout: {
        type : 'vbox',
        align: 'stretch'
    },

    initComponent: function() {
        var that = this,
            bar = [
                { xtype: 'shared.button.cancel' },
                { xtype: 'shared.button.save' },
                { xtype: 'shared.button.saveandadd', hidden: true }
            ];

        that.title = NP.Translator.translate('Utility Account');

        that.translateText();

        this.tbar = bar;
        this.bbar = bar;

        this.defaults = { labelWidth: 125 };

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
                store       : {
                                type   : 'vendor.utilitytypes',
                                service: 'UtilityService',
                                action: 'getUtilTypesByVendorsiteId',
                                extraParams: {
                                    vendorsite_id: null
                                }
                            }
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
    },

    translateText: function() {
        var me = this,
            propertyText = NP.Config.getPropertyLabel(),
            unitText     = NP.Config.getSetting('PN.InvoiceOptions.UnitAttachDisplay', 'Unit');

        me.vendorInputLabel               = NP.Translator.translate('Vendor');
        me.utilityTypeInputLabel          = NP.Translator.translate('Utility Type');
        me.accountNumberInputLabel        = NP.Translator.translate('Account Number');
        me.propertyInputlabel             = propertyText;
        me.unitInputLabel                 = NP.Translator.translate('Default {unit}', { unit: unitText});
        me.meterInputLabel                = NP.Translator.translate('Meter Number');
        me.glaccountInputLabel            = NP.Translator.translate('Default GL Account');
        me.emptyTextForDependedByProperty = NP.Translator.translate('Choose {property} first', { property: propertyText });
    }

});
