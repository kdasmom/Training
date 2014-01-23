/**
 * Created by Andrey Baranov
 * date: 1/20/14 2:04 PM
 */

Ext.define('NP.view.systemSetup.CustomFieldsHeader', {
//	extend: 'Ext.panel.Panel',
	extend: 'Ext.container.Container',
	alias: 'widget.systemsetup.customfieldsheader',

	requires: [
		'NP.lib.core.Translator',
		'NP.view.systemSetup.gridcol.FieldNumber',
		'NP.view.systemSetup.gridcol.Label',
		'NP.view.systemSetup.gridcol.FieldType',
		'NP.view.systemSetup.gridcol.Invoice',
		'NP.view.systemSetup.gridcol.PO',
		'NP.view.systemSetup.gridcol.VendorEst',
		'NP.view.systemSetup.HeaderForm'
	],

	border: false,
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	padding: '5',

	initComponent: function() {
		var me  = this;

		this.title = NP.Translator.translate(this.title);

		this.items = [
			{
				xtype: 'customgrid',
				name: 'headerfields',
				border: false,
				flex: 1,
				columns: [
					{
						xtype: 'systemsetup.gridcol.fieldnumber',
						flex: 0.5
					},
					{
						xtype: 'systemsetup.gridcol.label',
						flex: 1
					},
					{
						xtype: 'systemsetup.gridcol.fieldtype',
						flex: 0.2,
						align: 'center'
					},
					{
						xtype: 'systemsetup.gridcol.invoice',
						flex: 0.2,
						align: 'center'
					},
					{
						xtype: 'systemsetup.gridcol.po',
						flex: 0.2,
						align: 'center'
					},
					{
						xtype: 'systemsetup.gridcol.vendorest',
						flex: 0.2,
						align: 'center',
						hidden: !NP.Security.hasPermission(2084),
						hideable: false
					}

				],
				store: Ext.create('NP.lib.data.Store', {
					service    	: 'ConfigService',
					action     	: 'getHeaders',
					autoLoad	: true,
					fields: ['controlpanelitem_name', 'controlpanelitem_value', 'controlpanelitem_required', 'inv_on_off', 'inv_req', 'po_on_off', 'po_req', 'vef_on_off', 'vef_req', 'imgidx_on_off', 'type']
				})
			},
			{
				xtype: 'systemsetup.headerform',
				flex: 1
			}
		];

		this.callParent(arguments);
	}
});