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
    phoneNumberBaseMoreSymbolsErrorText: 'incorrect phone format',
    phoneDigitsErrorText: 'use digits only',

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
    },

    isValid: function() {
        var isValid = this.callParent(arguments);

        var vendor = this.findField('Vendorsite_Id');
        var utilitytypes = this.findField('utilitytypes'); //array
        var person_firstname = this.findField('person_firstname');
        var person_middlename = this.findField('person_middlename');
        var person_lastname = this.findField('person_lastname');
        var phone_number = this.findField('phone_number');
        var phone_ext = this.findField('phone_ext');

        if (vendor.getValue() == null) {
            isValid = false;
            vendor.markInvalid(this.vendorNameInputLabel + ' ' + this.emptyErrorText);
        }
        if (utilitytypes.getValue().length == 0) {
            isValid = false;
            utilitytypes.markInvalid(this.utilityTypeInputLabel + ' ' + this.emptyErrorText);
        }
        if (person_firstname.getValue() == '') {
            isValid = false;
            person_firstname.markInvalid(this.contactPersonFirstnameLabel + ' ' + this.emptyErrorText);
        }
        if (person_middlename.getValue() == '') {
            isValid = false;
            person_middlename.markInvalid(this.contactPersonMiddlenameLabel + ' ' + this.emptyErrorText);
        }
        if (person_lastname.getValue() == '') {
            isValid = false;
            person_lastname.markInvalid(this.contactPersonLastnameLabel + ' ' + this.emptyErrorText);
        }
        if (phone_number.getValue() == null) {
            isValid = false;
            phone_number.markInvalid(this.contactPhoneBaseLabel + ' ' + this.emptyErrorText);
        }
        var matchPhone = new RegExp("[0-9]{9}");
        if (!phone_number.getValue().match(matchPhone)) {
            isValid = false;
            phone_number.markInvalid(this.contactPhoneBaseLabel + ' ' + this.phoneNumberBaseMoreSymbolsErrorText);
        }
        if (phone_ext.getValue() == null) {
            isValid = false;
            phone_ext.markInvalid(this.contactPhoneExtLabel + ' ' + this.emptyErrorText);
        }
        var matchPhone = new RegExp("[0-9]{3}");
        if (!phone_ext.getValue().match(matchPhone)) {
            isValid = false;
            phone_ext.markInvalid(this.contactPhoneExtLabel + ' ' + this.phoneNumberBaseMoreSymbolsErrorText);
        }

        return isValid;
    }

});
