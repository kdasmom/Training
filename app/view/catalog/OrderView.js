/**
 * Created by Andrey Baranov
 * date: 12/5/13 12:40 PM
 */

Ext.define('NP.view.catalog.OrderView', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.orderview',

	requires: [
		'NP.view.catalog.OrderPropertiesForm'
	],
	layout: 'fit',


	initComponent: function() {
		var that = this;

		this.items = [
			{
				xtype: 'fieldcontainer',
				layout: 'vbox',
				items: [
					{
						xtype: 'catalog.orderpropertiesform',
						flex: 1,
						vc_id: this.vc_id
					}
				],
				padding: '5',
				border: false
			}
		];

		this.callParent(arguments);
	}
});