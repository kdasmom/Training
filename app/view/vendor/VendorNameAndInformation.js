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
				value: '',
                name: 'integration_package_name'
			},
            {
                xtype: 'hidden',
                name: 'integration_package_id'
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
                name: 'vendor_id_alt',
                allowBlank: false
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
                        name: 'address_line1',
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: '',
                        width: 345,
                        name: 'address_line2'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: this.vendorAddressCityInputLabel,
                        width: 345,
                        name: 'address_city',
                        allowBlank: false
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: this.vendorAddressStateInputLabel,
                        width: 345,
                        name: 'address_state',
                        displayField: 'state_code',
                        valueField: 'state_id',
                        store: Ext.create('NP.store.contact.States', {
                            service: 'AddressService',
                            action: 'getStates',
                            autoLoad: true
                        }),
                        allowBlank: false
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
                                name: 'address_zip',
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: '',
                                width: 120,
                                name: 'address_zipext',
                                padding: '0 0 0 10'
                            }
                        ]
                    }
                ]
			}
		];

		this.callParent(arguments);
	}
});