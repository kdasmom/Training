/**
 * @author Baranov A.V.
 * @date 10/4/13
 */

Ext.define('NP.view.vendor.VendorNameAndInformation', {
	extend: 'Ext.container.Container',
	alias: 'widget.vendor.vendornameandinformation',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.ui.ComboBox'
	],

	padding: 8,

	// For localization
	title                     : 'GL Information',
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
			labelWidth: 150
//            width: 500
		};

		this.items = [
			{
				xtype: 'customcombo',
				fieldLabel: this.integrationPackageInputLabel,
                name: 'integration_package_name',
				displayField: 'integration_package_name',
				valueField: 'integration_package_id',
				store: Ext.create('NP.store.system.IntegrationPackages', {
					service           : 'ConfigService',
					action            : 'getIntegrationPackages',
					autoLoad          : true,
					extraParams: {
						pageSize: null,
						paymentType_id: null
					}
				}),
				queryMode: 'local',
				editable: false,
				typeAhead: false

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
				xtype: 'hidden',
				name: 'vendor_action',
				value: ''
			},
			{
				xtype: 'hidden',
				name: 'submit_userprofile_id',
				value: ''
			},
			{
				xtype: 'fieldcontainer',
				fieldLabel: this.vendorAddressInputLabel,
                name: 'address',
                layout: 'vbox',
                items: [
					{
						xtype: 'shared.address',
						required: true,
						showCountry: true
					},
                    {
                        xtype: 'hidden',
                        name: 'address_id'
                    }
                ]
			}
		];

		this.callParent(arguments);
	}
});