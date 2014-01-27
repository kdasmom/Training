/**
 * Created by Andrey Baranov
 * date: 1/20/14 2:16 PM
 */

Ext.define('NP.view.systemSetup.CustomFieldsLineItem', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.systemsetup.customfieldslineitem',

	requires: ['NP.lib.core.Translator'],

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
						flex: 0.5,
						renderer: function(val, meta, rec) {
							return val[21];
						}
					},
					{
						xtype: 'systemsetup.gridcol.label',
						flex: 1
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
					action     	: 'getLineItems',
					autoLoad	: true,
					fields: ['controlpanelitem_name', 'controlpanelitem_value', 'controlpanelitem_required', 'inv_on_off', 'inv_req', 'po_on_off', 'po_req', 'vef_on_off', 'vef_req', 'imgidx_on_off']
				})
			}
		];

		this.callParent(arguments);
	}
});