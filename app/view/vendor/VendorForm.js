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

		return isValid;
	}
});