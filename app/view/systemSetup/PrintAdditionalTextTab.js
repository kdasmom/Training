/**
 * Created by Andrey Baranov
 * date: 2/4/14 12:47 PM
 */

Ext.define('NP.view.systemSetup.PrintAdditionalTextTab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.printadditionaltexttab',

	requires: ['NP.lib.core.Translator'],

	layout: {
		type: 'vbox',
		align: 'stretch'
	},

	defaults: {
		labelWidth: '80%'
	},

	padding: '0 10 10 10',
	border: false,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(me.title);

		me.tbar = [
			{
				xtype: 'shared.button.cancel',
				name: 'canceluploadbtn',
				handler: function() {
					me.getDockedItems('toolbar[dock="top"]')[0].hide();
					me.down('[name="params"]').show();
					me.down('[name="uploadattachment"]').hide();
				}
			},
			{
				xtype: 'shared.button.delete',
				name: 'deleteuploadbtn'
			},
			{
				xtype: 'shared.button.upload',
				name: 'uploadimagebtn',
				handler: function() {
					me.uploadAttachment();
				}
			}
		];

		me.items = [
			{
				xtype: 'fieldcontainer',
				name: 'params',
				layout: 'fit',
				items: [
					{
						xtype: 'displayfield',
						fieldLabel: NP.Translator.translate('Editing Template'),
						value: '',
						labelWidth: '80%'
					},
					{
						xtype: 'htmleditor',
						name: 'poprint_additional_text',
						fieldLabel: NP.Translator.translate('The following text will be included at the end of the Purchase Order and will be included on both the print and forward view of a Purchase Order. This will only display at the end of the Purchase Order. There is no limit to the number of characters allowed.'),
						labelAlign: 'top'
					}
				]
			},
			{
				xtype: 'form',
				border: false,
				layout: 'fit',
				name: 'uploadattachment',
				items: [
					{
						xtype: 'filefield',
						name: 'pdf_file',
						fieldLabel: NP.Translator.translate('Select a valid PDF file to upload. The contents of this file will be appended at the end of your purchase orders'),
						width: 300,
						labelAlign: 'top'
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
						me.getDockedItems('toolbar[dock="top"]')[0].hide();
						me.down('[name="params"]').show();
						me.down('[name="uploadattachment"]').hide();
					} else {
						fileField.markInvalid(result.errors);
					}
				}
			}
		});
	}
});