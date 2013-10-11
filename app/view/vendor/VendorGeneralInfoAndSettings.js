/**
 * @author Baranov A.V.
 * @date 10/4/13
 */

Ext.define('NP.view.vendor.VendorGeneralInfoAndSettings', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.vendorgeneralinfoandsettings',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.ui.ComboBox',
        'NP.view.shared.YesNoField'
	],

	padding: 8,

	// For localization
	title                     : 'General info and settings',
    vendorTypeInputLabel: 'Vendor Type',
    taxPayorTypeInputLabel: 'Tax Payor Type',
    payeeTypeInputLabel: 'Payee Type',
    emailAddressInputLabel: 'Email Address',
    phoneInputLabel: 'Phone',
    phoneExtInputLabel: 'Ext',
    faxInputLabel: 'Fax',
    contactInputLabel: 'Contact',
    contactFirstnameInputLabel: 'Firstname',
    contactLastnameInputLabel: 'Lastname',
    phoneContactInputLabel: 'Phone',
    phoneContactExtInputLabel: 'Ext',
    accountNumberInputLabel: 'Account Number',
    printViewInputLabel: 'Display on Purchase Order Print View',
    taxReportableInputLabel: '1099 Tax Reportable',

	// Custom options

	initComponent: function() {
		var that = this;

        this.defaults = {
            labelWidth: 150,
            width: 500
        };

        this.items = [
            {
                xtype: 'combo',
                fieldLabel: this.vendorTypeInputLabel,
                name: 'vendortype_id',
                displayField: 'vendortype_code',
                valueField: 'vendortype_id',
                store: Ext.create('NP.store.vendor.VendorTypes', {
                    service: 'VendorService',
                    action: 'findVendorTypes',
                    autoLoad: true
                }),
                allowBlank: false,
                listeners: {
                    change: function(combo, value) {
                        var form = that.up('form');
                        form.findField('vendor_type_code').setValue(combo.getRawValue());
                    }
                }
            },
            {
                xtype: 'hidden',
                name: 'vendor_type_code'
            },
            {
                xtype: 'combo',
                fieldLabel: this.taxPayorTypeInputLabel,
                name: 'taxpayor_type',
                displayField: 'lookupcode_code',
                valueField: 'lookupcode_id',
                store: Ext.create('NP.store.system.TaxPayorTypes', {
                    autoLoad: true
                })
            },
            {
                xtype: 'combo',
                fieldLabel: this.payeeTypeInputLabel,
                name: 'payee_type',
                displayField: 'lookupcode_code',
                valueField: 'lookupcode_id',
                store: Ext.create('NP.store.system.PayeeTypes', {
                    autoLoad: true
                })
            },
            {
                xtype: 'textfield',
                fieldLabel: this.emailAddressInputLabel,
                name: 'email_address'
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: this.phoneInputLabel,
                layout: 'hbox',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '',
                        width: 200,
                        name: 'vendorsite_phone'
                    },
                    {
                        labelWidth: 50,
                        padding: '0 0 0 10',
                        xtype: 'textfield',
                        fieldLabel: this.phoneExtInputLabel,
                        width: 135,
                        name: 'vendorsite_phone_phone_ext'
                    }
                ]
            },
            {
                xtype: 'textfield',
                fieldLabel: this.faxInputLabel,
                name: 'vendorsite_fax'
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: this.contactInputLabel,
                layout: 'vbox',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: this.contactFirstnameInputLabel,
                        width: 345,
                        name: 'attention_first_name'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.contactLastnameInputLabel,
                        width: 345,
                        name: 'attention_middle_name'
                    }
                ]
            },
            {
                xtype: 'fieldcontainer',
                fieldLabel: this.phoneContactInputLabel,
                name: 'contact_phone',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '',
                        width: 200,
                        name: 'attention_phone'
                    },
                    {
                        labelWidth: 50,
                        padding: '0 0 0 10',
                        xtype: 'textfield',
                        fieldLabel: this.phoneContactExtInputLabel,
                        width: 135,
                        name: 'attention_phone_phone_ext'
                    }
                ]
            },
            {
                xtype: 'textfield',
                fieldLabel: this.accountNumberInputLabel,
                name: 'vendorsite_account_number'
            },
            {
                xtype: 'checkbox',
                fieldLabel:this.printViewInputLabel,
                name: 'vendorsite_display_account_number_po'
            },
            {
                xtype: 'shared.yesnofield',
                fieldLabel: this.taxReportableInputLabel,
                name: 'vendor_type1099'
            },
            {
                xtype: 'hidden',
                name: 'term_id',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'paydatebasis_code',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'paymentmethod_code',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'paygroup_code',
                value: 'DEFAULT'
            },
            {
                xtype: 'hidden',
                name: 'vendor_termsdatebasis',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'vendor_paypriority',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'approval_tracking_id',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'vendor_status',
                value: ''
            },
            {
                xtype: 'hidden',
                name: 'vendorsite_favorite',
                value: 'Y'
            },
            {
                xtype: 'hidden',
                name: 'default_paymenttype_id',
                value: '0'
            },
            {
                xtype: 'hidden',
                name: 'default_due_datetm',
                value: '30'
            }

        ];

		this.callParent(arguments);
	}
});