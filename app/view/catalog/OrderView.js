/**
 * Created by Andrey Baranov
 * date: 12/5/13 12:40 PM
 */

Ext.define('NP.view.catalog.OrderView', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.orderview',

	requires: [
		'NP.view.catalog.OrderPropertiesForm',
		'NP.view.catalog.CreateOrderGrid'
	],
	layout: 'fit',
	title: NP.Translator.translate('Order view'),

	initComponent: function() {
		var that = this;

		this.items = [
			{
				xtype: 'catalog.orderpropertiesform',
				flex: 1,
				vc_id: this.vc_id,
				padding: '10 0 0 10',
				vcorders: this.vcorders
			},
			{
				xtype: 'catalog.createordergrid',
				flex: 1,
				padding: '20 0 0 0',
				vc_id: this.vc_id,
				vcorders: this.vcorders,
				autoScroll: true
			}
		];

		this.callParent(arguments);
	}
});