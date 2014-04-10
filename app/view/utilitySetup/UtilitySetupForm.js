/**
 * @author Baranov A.V.
 * @date 9/23/13
 */

Ext.define('NP.view.utilitySetup.UtilitySetupForm', {
    extend: 'NP.lib.ui.BoundForm',
    alias : 'widget.utilitysetup.utilitysetupform',

    requires: [
        'NP.lib.core.Config',
        'NP.view.shared.button.Save',
        'NP.view.shared.button.Cancel',
        'NP.view.shared.button.View',
        'NP.view.shared.UtilityTypeAssigner',
        'NP.lib.ui.AutoComplete',
        'NP.view.shared.Person',
        'NP.view.shared.Phone',
        'NP.view.utilitySetup.UtilityAccountList'
    ],

    bodyPadding: 8,
    layout     : {
        type : 'vbox',
        align: 'stretch'
    },
    autoScroll : true,

    title                              : 'New Vendor',
    vendorNameInputLabel               : 'Vendor name',
    utilityTypeInputLabel              : 'Utility type',
    contactPersonInputLabel            : 'Contact person',
    contactPersonFirstnameLabel        : 'Firstname',
    contactPersonMiddlenameLabel       : 'Middle',
    contactPersonLastnameLabel         : 'Last name',
    contactPhoneInputLabel             : 'Contact phone',
    contactPhoneBaseLabel              : 'Phone',
    contactPhoneExtLabel               : 'Ext',
    emptyErrorText                     : 'cannot be empty',
    lessZeroErrorText                  : 'cannot be less the zero',
    phoneNumberBaseMoreSymbolsErrorText: 'incorrect phone format',
    phoneDigitsErrorText               : 'use digits only',

    initComponent: function() {
        var that = this;

        var bar = [
            { xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.save'}
        ];
        this.tbar = bar;
        this.bbar = bar;

        this.defaults = {
            labelWidth: 125
        };

        this.addEvents('selectvendor');

        // change vendor_id to vendorsite_id
        this.items = [
            {
                xtype       : 'autocomplete',
                fieldLabel  : 'Vendor',
                name        : 'Vendorsite_Id',
                displayField: 'vendor_name',
                valueField  : 'vendorsite_id',
                width       : 500,
                allowBlank  : false,
                multiSelect : false,
                minChars    : 1,
                store       : Ext.create('NP.store.vendor.Vendors', {
                    service: 'VendorService',
                    action : 'getForCatalogDropDown'
                })
            },
            { xtype    : 'shared.utilitytypeassigner', allowBlank: false, maxHeight: 120 },
            {
                xtype     : 'fieldcontainer',
                fieldLabel: this.contactPersonInputLabel,
                items     : [{ xtype: 'shared.person' }]
            },
            {
                xtype     : 'fieldcontainer',
                fieldLabel: this.contactPhoneInputLabel,
                items     : [{
                    xtype                : 'shared.phone',
                    hideCountry          : true,
                    hideExt              : false,
                    hideLabel            : true,
                    showFieldDescriptions: true
                }]
            },
            {
                xtype : 'utilitysetup.utilityaccountlist',
                title : 'Accounts',
                flex  : 1,
                hidden: true
            }
        ];

        this.callParent(arguments);
    }
});
