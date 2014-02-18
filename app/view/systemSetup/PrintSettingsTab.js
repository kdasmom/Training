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
				name: 'uploadattachmentbtn'
			}
		];

		me.items = [
			{
				xtype: 'displayfield',
				fieldLabel: NP.Translator.translate('Editing Template'),
				value: ''
			},
			{
				xtype: 'form',
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
					}
				]
			},
			{
				xtype: 'form',
				name: 'uploadimage',
				items: [
					{
						xtype: 'filefield',
						fieldLabel: NP.Translator.translate('Additional image'),
						width: 300,
						labelAlign: 'top',
						afterSubTpl: NP.Translator.translate('The Additional Image is the Image that will display on the PO Print/PDF view. This will replace the image that is currently used on other reports in the application. The image must be a .JPG file')
					}
				]
			}
		];

		me.callParent(arguments);
	}
});