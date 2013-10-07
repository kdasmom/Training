/**
 * @author Baranov A.V.
 * @date 10/4/13
 */

Ext.define('NP.view.vendor.VendorNameAndInformation', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.vendornameandinformation',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.ui.ComboBox',
        'NP.view.shared.YesNoField'
	],

	padding: 8,

	// For localization
	title                     : 'Vendor name and information',
	integrationPackageInputLabel: 'Integration Package',
	vendorNameInputLabel: 'Vendor Name',
	taxIDInputLabel: 'Tax ID',
	mriVendorIdInputLabel: 'MRI Vendor Id',
	vendorTypeInputLabel: 'Vendor Type',
	taxPayorTypeInputLabel: 'Tax Payor Type',
	payeeTypeInputLabel: 'Payee Type',
	vendorAddressInputLabel: 'Vendor Address',
	vendorAddressCommonInputLabel: 'Address',
	vendorAddressCityInputLabel: 'City',
	vendorAddressStateInputLabel: 'State',
	vendorAddressZipInputLabel: 'Zip',
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
	taxReportableYesInputLabel: 'Yes',
	taxReportableNoInputLabel: 'No',

	// Custom options

	initComponent: function() {
		var that = this;

		this.defaults = {
			labelWidth: 150,
            width: 500
		};

		this.items = [
			{
				xtype: 'displayfield',
				fieldLabel: this.integrationPackageInputLabel,
				value: ''
			},
			{
				xtype: 'textfield',
				fieldLabel: this.vendorNameInputLabel,
				allowBlank: false,
				name: 'vendor_name'
			},
			{
				xtype: 'textfield',
				fieldLabel: this.taxIDInputLabel,
				name: 'vendor_fedid'
			},
			{
				xtype: 'textfield',
				fieldLabel: this.mriVendorIdInputLabel,
				name: 'vendor_id_alt'
			},
			{
				xtype: 'combo',
				fieldLabel: this.vendorTypeInputLabel,
				name: 'vendor_type_code'
			},
			{
				xtype: 'combo',
				fieldLabel: this.taxPayorTypeInputLabel,
                name: 'taxpayor_type'
			},
			{
				xtype: 'combo',
				fieldLabel: this.payeeTypeInputLabel,
                name: 'payee_type'
			},
			{
				xtype: 'fieldcontainer',
				fieldLabel: this.vendorAddressInputLabel,
                name: 'address',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: this.vendorAddressCommonInputLabel,
                        width: 345,
                        name: 'vendorsite_address_line1'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '',
                        width: 345,
                        name: 'vendorsite_address_line2'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.vendorAddressCityInputLabel,
                        width: 345,
                        name: 'vendorsite_address_city'
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: this.vendorAddressStateInputLabel,
                        width: 345,
                        name: 'vendorsite_address_state'
                    },
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel: this.vendorAddressZipInputLabel,
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: '',
                                width: 110,
                                name: 'vendorsite_address_zip'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '',
                                width: 120,
                                name: 'vendorsite_address_zipext',
                                padding: '0 0 0 10'
                            }
                        ]
                    }
                ]
			},
            {
                xtype: 'textfield',
                fieldLabel: this.emailAddressInputLabel,
                name: 'vendorsite_email'
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
            }
		];

		this.callParent(arguments);
	}
});