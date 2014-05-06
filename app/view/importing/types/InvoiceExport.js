/**
 * Created by Andrey Baranov
 * date: 5/6/2014 3:37 PM
 */

Ext.define('NP.view.importing.types.InvoiceExport', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.importing.types.invoiceexport',

	requires: [
		'NP.view.shared.button.Cancel',
		'NP.view.shared.button.Upload',
		'NP.view.shared.IntegrationPackagesCombo',
		'NP.view.shared.PropertyAssigner'
	],

	tabTitle: 'Invoice Export',

	layout: {
		align: 'left',
		type: 'vbox'
	},
	border: false,

	initComponent: function() {
		var me = this;

		me.tbar = [
			{
				xtype: 'shared.button.cancel'
			},
			{
				xtype: 'shared.button.upload',
				title: 'Create File'
			}
		];

		me.defaults = {
			labelWidth: 150,
			padding: '5 5 0 10'
		};

		me.items = [
			{
				xtype: 'displayfield',
				fieldLabel: NP.Translator.translate('Please Note'),
				labelAlign: 'top',
				value: '<ul><li>' + NP.Translator.translate('Only invoices for the properties selected that are in the status Submitted for Payment will be exported.') + '</li></<ul>'
			},
			{
				xtype: 'shared.integrationpackagescombo',
				store: Ext.create('NP.store.system.IntegrationPackages', {
					service: 'ConfigService',
					action: 'getIntegrationPackagesForTheInvoiceExport',
					extraParams: {
						userprofile_id: NP.Security.getUser().get('userprofile_id')
					},
					autoLoad: true
				}),
				listeners: {
					select: function(combobox, records) {
						var store = me.query('#properties')[0].getStore();
						Ext.apply(store.getProxy().extraParams, {
							integration_package_id: combobox.getValue()
						});
						store.load();
					}
				},
				width: 400
			},
			{
				xtype: 'shared.propertyassigner',
				itemId: 'properties',
				height: 200,
				store: Ext.create('NP.store.property.Properties', {
					service : 'PropertyService',
					action  : 'getByIntegrationPackage',
					extraParams: {
						integration_package_id: null
					}
				}),
				width: 600
			}
		];


		me.callParent(arguments);
	}
});