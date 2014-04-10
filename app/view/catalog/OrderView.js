/**
 * Created by Andrey Baranov
 * date: 12/5/13 12:40 PM
 */

Ext.define('NP.view.catalog.OrderView', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.orderview',

	requires: [
		'NP.lib.core.Translator',
		'NP.view.catalog.OrderPropertiesForm',
		'NP.view.catalog.CreateOrderGrid'
	],

	title: 'Order view',
	
	layout: {
		type : 'vbox',
		align: 'stretch'
	},

	initComponent: function() {
		var that = this;

		that.title = NP.Translator.translate(that.title);
		
		this.items = [
			{
				xtype   : 'catalog.orderpropertiesform',
				vc_id   : this.vc_id,
				padding : '0 0 0 10',
				vcorders: this.vcorders
			},
			{
				xtype     : 'catalog.createordergrid',
				padding   : '20 0 0 0',
				vc_id     : this.vc_id,
				vcorders  : this.vcorders,
				flex      : 1,
				hidden    : true
			}
		];

		this.callParent(arguments);
	}
});