/**
 * Created by rnixx on 11/5/13.
 */
Ext.define('NP.view.vendor.VendorRejectWindow', {
	extend: 'Ext.window.Window',
	alias: 'widget.vendor.vendorrejectwindow',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Save',
		'NP.lib.core.Translator'
	],

	layout          : 'fit',
	title					: NP.Translator.translate('Reject vendor'),
	rejectReasonFieldLabel	: NP.Translator.translate('Please provide reason for rejection below'),

	width           : 475,
	height          : 190,

	modal           : true,
	draggable       : false,
	resizable       : false,

	vendor_id: null,

	initComponent: function() {
		var that = this;

		this.tbar = [
			{ xtype: 'shared.button.cancel' },
			{ xtype: 'shared.button.save' }
		];

		this.items = [{
			xtype: 'form',
			autoScroll: true,
			border: false,
			bodyPadding: 8,
			items: [
				{
					xtype: 'hidden',
					name: 'vendor_id',
					value: that.vendor_id
				},{
					xtype     : 'textarea',
					name      : 'reject_note',
					fieldLabel: this.rejectReasonFieldLabel,
					allowBlank: false,
					width: 425
				}
			]
		}];

		this.callParent(arguments);
	}
});