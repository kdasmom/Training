/**
 * Created by Andrey Baranov
 * date: 11/26/13 5:12 PM
 */


Ext.define('NP.view.catalog.UserOrder', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.userorder',

	requires: [
		'Ext.layout.container.Column'
	],

	layout: 'column',

	frame: true,
	bodyPadding: 4,

	initComponent: function() {
		var that = this;

		that.style = 'background-color: #FFF;'
		that.bodyStyle = 'background-color: #FFF;'

		this.items = [
			{
				xtype : 'image',
				src   : 'resources/images/cart.gif',
				margin: '8px 8px 0 0'
			},
			{
				xtype: 'displayfield',
				id: 'order-details',
				value: '',
				padding: '0 15 0 0'
			},
			{
				xtype: 'button',
				text: NP.Translator.translate('View order'),
				margin: '5 0 0 0'
			}
		];

		this.callParent(arguments);
	}
});