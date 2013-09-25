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
        'NP.lib.ui.AutoComplete'

    ],

    bodyPadding: 8,
    autoScroll : true,

    title: 'New Vendor',
    vendorNameInputLabel: 'Vendor name',
    utilityTypeInputLabel: 'Utility type',
    contactPersonInputLabel: 'Contact person',
    contactPersonFirstnameLabel: 'Firstname',
    contactPersonMiddlenameLabel: 'Middle',
    contactPersonLastnameLabel: 'Last name',
    contactPhoneInputLabel: 'Contact phone',
    contactPhoneBaseLabel: 'Phone',
    contactPhoneExtLabel: 'Ext',
    emptyErrorText: 'cannot be empty',
    lessZeroErrorText: 'cannot be less the zero',

    initComponent: function() {

        var that = this;

        var bar = [
            { xtype: 'shared.button.cancel' },
            { xtype: 'shared.button.save'},
            { xtype: 'shared.button.view', text: 'Accounts', hidden: true}
        ];
        this.tbar = bar;
        this.bbar = bar;

        this.defaults = {
            labelWidth: 125
        };

        this.addEvents('selectvendor');
//        change vendor_id to vendorsite_id
        this.items = [
            {
                xtype           : 'autocomplete',
                fieldLabel      : 'Vendor',
                name            : 'Vendorsite_Id',
                displayField    : 'vendor_name',
                width           : 337,
                valueField      : 'vendorsite_id',
                allowBlank      : false,
                multiSelect     : false,
                store           : Ext.create('NP.store.vendor.Vendors', {
                    service     : 'VendorService',
                    action      : 'getForCatalogDropDown'
                })
            },
            {
                xtype    : 'shared.utilitytypeassigner',
                maxHeight: 150
            },
            {
                xtype           : 'fieldcontainer',
                fieldLabel      : this.contactPersonInputLabel,
                layout          : 'vbox',
                items           : [
                    {
                        xtype: 'textfield',
                        fieldLabel: this.contactPersonFirstnameLabel,
                        name:   'person_firstname',
                        margin: '0 0 5 5',
                        labelWidth: 70
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.contactPersonMiddlenameLabel,
                        name:   'person_middlename',
                        margin: '0 0 5 5',
                        labelWidth: 70
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.contactPersonLastnameLabel,
                        name:   'person_lastname',
                        margin: '0 0 5 5',
                        labelWidth: 70
                    }
                ]
            },
            {
                xtype           : 'fieldcontainer',
                fieldLabel      : this.contactPhoneInputLabel,
                layout          : 'vbox',
                items           : [
                    {
                        xtype: 'textfield',
                        fieldLabel: this.contactPhoneBaseLabel,
                        name:   'phone_number',
                        margin: '0 0 5 5',
                        labelWidth: 70
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.contactPhoneExtLabel,
                        name:   'phone_ext',
                        margin: '0 0 5 5',
                        labelWidth: 70
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }/*,

    isValid: function() {
        var isValid = this.callParent(arguments);

        return isValid;
    }*/

});
