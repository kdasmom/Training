/**
 * Created by rnixx on 10/29/13.
 */

Ext.define('NP.view.vendor.InsuranceUploadForm', {
	extend: 'Ext.window.Window',
	alias: 'widget.vendor.insuranceuploadform',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Save'
	],

	layout          : 'fit',

	title           : 'Upload insurance',

	width           : 500,
	height          : 380,

	modal           : true,
	draggable       : false,
	resizable       : false,

	instructionsText: 'File Upload tool enables you to add csv. ' +
		'Click the Browse button to open a Browse window. In the Browse window, ' +
		'locate and select the file(s) to upload. Click the Open button. ' +
		'Press the Save button to upload the files.',

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
					xtype: 'displayfield',
					hideLabel: true,
					value: this.instructionsText
				},{
					xtype     : 'filefield',
					name      : 'csv_file',
					fieldLabel: 'File',
					width     : 400,
					allowBlank: false
				}
			]
		}];

		this.callParent(arguments);
	}
});