/**
 * @author Baranov A.V.
 * @date 10/4/13
 */

Ext.define('NP.view.vendor.VendorForm', {
	extend: 'NP.lib.ui.BoundForm',
	alias : 'widget.vendor.vendorform',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Save',
		'NP.view.shared.button.Cancel',
		'NP.view.vendor.VendorNameAndInformation',
		'NP.view.vendor.VendorAssignGlAccouns',
		'NP.view.vendor.VendorInsuranceSetup',
		'NP.view.vendor.VendorGeneralInfoAndSettings'
	],

	title: 'Vendor',
    emptyErrorText: 'Cannot be empty',

	initComponent: function() {
		var bar = [
			{ xtype: 'shared.button.cancel' },
			{ xtype: 'shared.button.save'}
		];
		this.tbar = bar;
		this.bbar = bar;

		this.defaults = {
			labelWidth: 125
		};

		this.items = [{
			xtype : 'tabpanel',
			border: false,
			items : [
				{ xtype: 'vendor.vendornameandinformation'},
				{ xtype: 'vendor.vendorgeneralinfoandsettings'},
				{ xtype: 'vendor.vendorassignglaccouns'},
				{ xtype: 'vendor.vendorinsurancesetup'}
			]
		}];
		this.callParent(arguments);
	},

	isValid: function() {
		var isValid = this.callParent(arguments);

        var vendorNameInput = this.findField('vendor_name');
        var mriInput = this.findField('vendor_id_alt');
        var addressLine1Input = this.findField('address_line1');
        var cityInput = this.findField('address_city');
        var stateInput = this.findField('address_state');
        var zipInput = this.findField('address_zip');
        var vendorTypeInput = this.findField('vendor_type_code');

        if (!vendorNameInput.getValue() || vendorNameInput.getValue() == '') {
            isValid = false;
            vendorNameInput.markInvalid(this.emptyErrorText);
        }
        if (!mriInput.getValue() || mriInput.getValue() == '') {
            isValid = false;
            mriInput.markInvalid(this.emptyErrorText);
        }
        if (!addressLine1Input.getValue() || addressLine1Input.getValue() == '') {
            isValid = false;
            addressLine1Input.markInvalid(this.emptyErrorText);
        }
        if (!cityInput.getValue() || cityInput.getValue() == '') {
            isValid = false;
            cityInput.markInvalid(this.emptyErrorText);
        }
        if (!stateInput.getValue()) {
            isValid = false;
            stateInput.markInvalid(this.emptyErrorText);
        }
        if (!zipInput.getValue() || zipInput.getValue() == '') {
            isValid = false;
            zipInput.markInvalid(this.emptyErrorText);
        }
        if (!vendorTypeInput.getValue()) {
            isValid = false;
            vendorTypeInput.markInvalid(this.emptyErrorText);
        }

		return isValid;
	}
});