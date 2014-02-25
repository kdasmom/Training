/**
 * Created by Andrey Baranov
 * date: 2/3/14 2:39 PM
 */

Ext.define('NP.view.systemSetup.TemplatesManager', {
//	extend: 'Ext.panel.Panel',
	extend: 'NP.lib.ui.BoundForm',
	alias: 'widget.systemsetup.templatesmanager',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator',
		'NP.view.systemSetup.PrintTemplateTab',
		'NP.view.systemSetup.PrintHeaderTab',
		'NP.view.systemSetup.PrintFooterTab',
		'NP.view.systemSetup.PrintAdditionalTextTab',
		'NP.view.systemSetup.PrintSettingsTab',
		'NP.lib.ui.VerticalTabPanel'
	],

	layout: 'fit',

	defaults: {
		labelWidth: '80%'
	},
	border: false,
	autoScroll: true,


	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(this.title);

		me.tbar = [
			{
				xtype: 'shared.button.cancel'
			},
			{
				xtype: 'shared.button.save',
				handler: function() {
					me.fireEvent('savetemplate');
				}
			},
			{
				xtype: 'shared.button.save',
				text: NP.Translator.translate('Save & Activate'),
				handler: function() {
					me.down('[name="isActive"]').setValue(1);
					me.fireEvent('savetemplate');
				}
			},
			{
				xtype: 'shared.button.save',
				text: NP.Translator.translate('Save & Deactivate'),
				handler: function() {
					me.down('[name="isActive"]').setValue(0);
					me.fireEvent('savetemplate');
				}
			},
			{
				xtype: 'shared.button.delete',
				handler: function() {
					me.fireEvent('deletetemplate', me.id);
				},
				hidden: parseInt(me.id) > 0 ? false : true
			},
			{
				xtype: 'shared.button.upload',
				text: 'Upload attachment',
				name: 'uploadattachment',
				hidden: true,
				handler: function() {
					me.fireEvent('uploadattachment', me.id);
				}
			},
			{
				xtype: 'shared.button.upload',
				text: 'Upload image',
				name: 'uploadimage',
				hidden: true,
				handler: function() {
					me.fireEvent('uploadimage', me.id);
				}
			},
			{
				xtype: 'shared.button.view',
				text: 'View Attachment',
				name: 'viewAttachmentBtn',
				hidden: true,
				handler: function() {
					var win = Ext.create('NP.view.systemSetup.PrintTemplateViewAttachmentWindow', {templateid: me.id});
					win.show();
				}
			},
			{
				xtype: 'shared.button.delete',
				text: 'Delete Attachment',
				name: 'deleteAttachmentBtn',
				hidden: true,
				handler: function() {
					me.deleteAttachment(me.id, false);
				}
			},
			{
				xtype: 'shared.button.view',
				text: 'View Image',
				name: 'viewImageBtn',
				hidden: true,
				handler: function() {
					var win = Ext.create('NP.view.systemSetup.PrintTemplateViewImageWindow', {templateid: me.id});
					win.show();
				}
			},
			{
				xtype: 'shared.button.delete',
				text: 'Delete Image',
				name: 'deleteImageBtn',
				hidden: true,
				handler: function() {
					me.deleteAttachment(me.id, true);
				}
			}
		];

		me.items = [
			{
				xtype: 'verticaltabpanel',
				name: 'templatestab',
				items: [
					{
						xtype: 'systemsetup.printtemplatetab',
						title: 'Template',
						name: 'templatetab',
						autoScroll: true,
						flex: 1,
						data: me.data ? me.data : null
					},
					{
						xtype: 'systemsetup.printheadertab',
						title: 'Header',
						name: 'headertab',
						autoScroll: true,
						flex: 1
					},
					{
						xtype: 'systemsetup.printfootertab',
						title: 'Footer',
						name: 'footertab',
						autoScroll: true,
						flex: 1
					},
					{
						xtype: 'systemsetup.printadditionaltexttab',
						title: 'Additional Text',
						name: 'additionaltexttab',
						autoScroll: true,
						flex: 1,
						templateid: me.id
					},
					{
						xtype: 'systemsetup.printsettingstab',
						title: 'Settings',
						name: 'settings',
						autoScroll: true,
						flex: 1,
						templateid: me.id
					}
				]
			}
		];

		this.callParent(arguments);
	},

	deleteAttachment: function(id, image) {
		var me = this;
		NP.lib.core.Net.remoteCall({
			requests: {
				service    : 'PrintTemplateService',
				action     : 'deleteAttachments',
				id: id,
				image: image,
				success    : function(result) {
					if (result) {
						if (image) {
							me.down('[name="print_template_additional_image"]').setValue(0);
							me.down('[name="viewImageBtn"]').hide();
							me.down('[name="deleteImageBtn"]').hide();
						} else {
							me.down('[name="template_attachment"]').setValue(0);
							me.down('[name="viewAttachmentBtn"]').hide();
							me.down('[name="deleteAttachmentBtn"]').hide();
						}
					}
				}
			}
		});
	}
});