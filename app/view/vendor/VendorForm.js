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
		'NP.view.vendor.VendorGeneralInfoAndSettings',
		'NP.view.vendor.VendorDocumentsForm',
		'NP.view.vendor.AlternativeAddresses'
	],

//	localization
	title: 'Vendor',
    emptyErrorText: 'Cannot be empty',
	submitForApprovalTextBtn: 'Submit for approval',
	submitForApprovalAndUploadTextBtn: 'Submit for approval and upload',
	approveTextBtn: 'Approve',
	rejectTextBtn: 'Reject',

	// custom params
	opened: false,
	isReject: false,
	appCount: 0,
	vendorStatus: '',
	customFieldData: [],
	layout: 'fit',
	vendor_id: null,

	initComponent: function() {

		this.defaults = {
			labelWidth: 125
		};

		var bar = [
			{
				xtype: 'shared.button.cancel'
			}
		];

		this.tbar = bar;

		this.items = [{
			xtype : 'tabpanel',
			border: false,
			defaults: { autoScroll: true },
			items : [
				{ xtype: 'vendor.vendornameandinformation', itemId: 'baseinformation'}
			]
		}];

		if (this.opened) {
			if ( NP.Config.getSetting('PN.VendorOptions.AllowAltAddresses') == 1) {
				this.items[0].items.push({
					xtype: 'vendor.alternativeaddresses',
					itemId: 'altaddresses',
					vendor_id: this.vendor_id
				});
			}
		}

		this.items[0].items.push({ xtype: 'vendor.vendorgeneralinfoandsettings', opened: this.opened, itemId: 'settings', customFields: this.customFieldData});
		this.items[0].items.push({ xtype: 'vendor.vendorassignglaccouns', itemId: 'glaccounts'});
		this.items[0].items.push({ xtype: 'vendor.vendorinsurancesetup', itemId: 'insurances', insurances: this.insurances});

		if (this.opened) {
			this.items[0].items.push({
				xtype: 'vendor.vendordocumentsform',
				itemId: 'documents'
			});
		}

		this.callParent(arguments);
	}
});