/**
 * Created by Andrey Baranov
 * date: 3/3/14 11:36 AM
 */

Ext.define('NP.view.integration.Settings', {
	extend: 'Ext.form.Panel',
	alias: 'widget.integration.settings',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Security'
	],

	title     : 'Settings',
	autoScroll: true,
	border    : false,
	name      : 'settingsform',
	defaults: {
		labelWidth: 350
	},

	initComponent: function() {
		var me = this;
		me.title = NP.Translator.translate(me.title);

		me.tbar = [
			{
				xtype: 'shared.button.save'
			}
		];

		me.items = [
			{
				xtype       : 'customcombo',
				fieldLabel  : NP.Translator.translate('Integration package'),
				store       : 'system.IntegrationPackages',
				name        : 'integration_package_id',
				displayField: 'integration_package_name',
				valueField  : 'integration_package_id',
				allowBlank  : false,
				editable    : false,
				typeAhead   : false,
				padding     : '5',
				selectFirstRecord: true
			},
			{
				xtype: 'panel',
				title: NP.Translator.translate('SETTINGS'),
				layout: {
					type: 'vbox',
					align: 'left'
				},
				defaults: {
					labelWidth: 350
				},
				border: false,
				items: [
					{
						xtype: 'textfield',
						name: 'invoice_ref_max',
						fieldLabel: NP.Translator.translate('Invoice Number Max Character Count'),
						padding: '5',
						allowBlank: false
					},
					{
						xtype: 'textfield',
						name: 'lineitem_description_max',
						fieldLabel: NP.Translator.translate('Invoice Item Description Max Character Count'),
						padding: '5',
						allowBlank: false
					},
					{
						xtype: 'textfield',
						name: 'vendor_name_max',
						fieldLabel: NP.Translator.translate('Vendor Field Name Max Character Count'),
						padding: '5',
						allowBlank: false
					},
					{
						xtype: 'textfield',
						name: 'vendor_code_max',
						fieldLabel: NP.Translator.translate('Vendor Code Max Character Count'),
						padding: '5',
						allowBlank: false
					},
					{
						xtype: 'textfield',
						name: 'vendor_city_max',
						fieldLabel: NP.Translator.translate('Vendor City Max Max Character Count'),
						padding: '5',
						allowBlank: false
					},
					{
						xtype: 'textfield',
						name: 'receipt_notes_max',
						fieldLabel: NP.Translator.translate('Receipt Note Max Character Count'),
						padding: '5',
						allowBlank: true
					},
					{
						xtype: 'textfield',
						name: 'insurance_policynumber_max',
						fieldLabel: NP.Translator.translate('Insurance Policy Number Max Character Count'),
						padding: '5',
						allowBlank: true
					},
					{
						xtype: 'textfield',
						name: 'vendor_address1_max',
						fieldLabel: NP.Translator.translate('Vendor Address Line 1 Count'),
						padding: '5',
						allowBlank: true
					}
				]
			}
		];


		this.callParent(arguments);
	}
});