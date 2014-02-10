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

	padding: '10',
	border: false,

	initComponent: function() {
		var me  = this;

		me.title = NP.Translator.translate(me.title);

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
			}
		];

		me.callParent(arguments);
	}
});