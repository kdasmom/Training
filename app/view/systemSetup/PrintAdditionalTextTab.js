/**
 * Created by Andrey Baranov
 * date: 2/4/14 12:47 PM
 */

Ext.define('NP.view.systemSetup.PrintAdditionalTextTab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.printadditionaltexttab',

	requires: [
		'NP.lib.core.Translator',
		'Ext.form.field.File',
		'Ext.form.field.HtmlEditor'
	],

	layout: 'card',

	border: false,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(me.title);

		me.items = [
			{
				xtype  : 'container',
				name   : 'params',
				layout : 'fit',
				padding: 8,
				items  : [{
					xtype     : 'htmleditor',
					name      : 'poprint_additional_text',
					fieldLabel: NP.Translator.translate('The following text will be included at the end of the Purchase Order and will be included on both the print and forward view of a Purchase Order. This will only display at the end of the Purchase Order. There is no limit to the number of characters allowed.'),
					labelAlign: 'top'
				}]
			},
			{
				xtype      : 'form',
				border     : false,
				layout     : {
					type : 'vbox',
					align: 'stretch'
				},
				name       : 'uploadattachment',
				bodyPadding: 8,
				tbar       : [
					{
						xtype: 'shared.button.cancel',
						name: 'canceluploadbtn',
						handler: function() {
							me.getLayout().setActiveItem(0);
						}
					},
					{
						xtype: 'shared.button.upload',
						name: 'uploadimagebtn',
						handler: function() {
							me.uploadAttachment();
						}
					}
				],
				items : [
					{
						xtype     : 'filefield',
						name      : 'pdf_file',
						fieldLabel: NP.Translator.translate('Select a valid PDF file to upload'),
						labelAlign: 'top',
						afterSubTpl: NP.Translator.translate('The contents of this file will be appended at the end of your purchase orders.')
					},
					{
						xtype: 'hiddenfield',
						name: 'template_attachment',
						value: 0
					}
				]
			}
		];

		me.callParent(arguments);
	},

	uploadAttachment: function() {
		var me = this,
			uploadForm = me.down('[name="uploadattachment"]');

		var fileField = uploadForm.query('filefield')[0];
		var file = fileField.getValue();
		var formEl = NP.Util.createFormForUpload('#' + me.getItemId() + ' form');

		NP.lib.core.Net.remoteCall({
			method: 'POST',
			mask  : me,
			isUpload: true,
			form: formEl.id,
			requests: {
				service      : 'PrintTemplateService',
				action       : 'saveAttachmentPdf',
				file         : file,
				userprofile_id: NP.Security.getUser().get('userprofile_id'),
				id: me.templateid,
				success      : function(result) {
					if (result.success) {
						NP.Util.showFadingWindow({ html: NP.Translator.translate('Attachment was successfully uploaded.') });

						me.getLayout().setActiveItem(0);
						me.down('[name="template_attachment"]').setValue(1);
						me.up().up().down('[name="viewAttachmentBtn"]').show();
						me.up().up().down('[name="deleteAttachmentBtn"]').show();
					} else {
						fileField.markInvalid(result.errors);
					}
				}
			}
		});
	}
});