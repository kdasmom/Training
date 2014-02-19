/**
 * Created by Andrey Baranov
 * date: 2/10/14 3:32 PM
 */


Ext.define('NP.view.systemSetup.PrintSettingsTab', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.printsettingstab',

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
					me.up().up().getDockedItems('toolbar[dock="top"]')[0].show();

					me.down('[name="params"]').show();
					me.down('[name="uploadimage"]').hide();
				}
			},
			{
				xtype: 'shared.button.delete',
				name: 'deleteuploadbtn'
			},
			{
				xtype: 'shared.button.upload',
				name: 'uploadattachmentbtn',
				handler: function() {
					me.uploadImage();
				}
			}
		];

		me.items = [
			{
				xtype: 'displayfield',
				name: 'edittemplatename_settings',
				labelWidth: 150,
				fieldLabel: NP.Translator.translate('Editing Template'),
				value: ''
			},
			{
				xtype: 'fieldcontainer',
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				name: 'params',
				title: NP.Translator.translate('Line Item Elements to Include'),
				items: [
					{
						xtype: 'displayfield',
						value: NP.Translator.translate('Any item selected below will automatically be included on the PO Print View'),
						padding: '0 5'
					},
					{
						xtype: 'checkboxfield',
						fieldLabel: NP.Translator.translate('Item Number'),
						labelWidth: '80%',
						name: 'po_lineitems_display_opts_itemnum',
						padding: '0 5'
					},
					{
						xtype: 'checkboxfield',
						fieldLabel: NP.Translator.translate('Unit of Measurement'),
						labelWidth: '80%',
						name: 'po_lineitems_display_opts_uom',
						padding: '0 5'
					},
					{
						xtype: 'checkboxfield',
						fieldLabel: NP.Translator.translate('GL Code'),
						labelWidth: '80%',
						name: 'po_lineitems_display_opts_glcode',
						padding: '0 5'
					},
					{
						xtype: 'checkboxfield',
						fieldLabel: NP.Translator.translate('Building/Department Code'),
						labelWidth: '80%',
						name: 'po_lineitems_display_opts_buildingcode',
						padding: '0 5'
					},
					{
						xtype: 'checkboxfield',
						fieldLabel: NP.Translator.translate('Job Cost Values'),
						labelWidth: '80%',
						name: 'po_lineitems_display_opts_jobcost',
						padding: '0 5'
					},
					{
						xtype: 'checkboxfield',
						fieldLabel: NP.Translator.translate('Line Items Custom Fields'),
						labelWidth: '80%',
						name: 'po_lineitems_display_opts_customfields',
						padding: '0 5'
					},
					{
						xtype: 'checkboxfield',
						fieldLabel: NP.Translator.translate('Include All Attachments'),
						labelWidth: '80%',
						name: 'po_include_attachments',
						padding: '0 5'
					},
					{
						xtype: 'hiddenfield',
						name: 'print_template_additional_image',
						value: 0
					}
				]
			},
			{
				xtype: 'form',
				name: 'uploadimage',
				border: false,
				layout: 'fit',
				items: [
					{
						xtype: 'filefield',
						name: 'jpeg_file',
						fieldLabel: NP.Translator.translate('Additional image'),
						width: 300,
						labelAlign: 'top',
						afterSubTpl: NP.Translator.translate('The Additional Image is the Image that will display on the PO Print/PDF view. This will replace the image that is currently used on other reports in the application. The image must be a .JPG file')
					}
				]
			}
		];

		me.callParent(arguments);
	},

	uploadImage: function() {
		var me = this,
			uploadForm = me.down('[name="uploadimage"]'),
			fileField = uploadForm.query('filefield')[0],
			file = fileField.getValue(),
			formEl = NP.Util.createFormForUpload('#' + me.getItemId() + ' form');

		if (!file) {
			fileField.markInvalid(NP.Translator.translate('Select file, please!'));
			return false;
		}

		NP.lib.core.Net.remoteCall({
			method: 'POST',
			mask  : me,
			isUpload: true,
			form: formEl.id,
			requests: {
				service      : 'PrintTemplateService',
				action       : 'saveAttachmentImage',
				file         : file,
				userprofile_id: NP.Security.getUser().get('userprofile_id'),
				id: me.templateid,
				success      : function(result) {
					if (result.success) {
						me.getDockedItems('toolbar[dock="top"]')[0].hide();
						me.up().up().getDockedItems('toolbar[dock="top"]')[0].show();
						me.down('[name="params"]').show();
						me.down('[name="uploadimage"]').hide();
						me.down('[name="print_template_additional_image"]').setValue(1);
						me.up().up().down('[name="viewImageBtn"]').show();
						me.up().up().down('[name="deleteImageBtn"]').show();
					} else {
						fileField.markInvalid(result.errors);
					}
				}
			}
		});
	}
});