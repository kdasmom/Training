/**
 * Created by Andrey Baranov
 * date: 11/26/13 5:12 PM
 */


Ext.define('NP.view.catalog.UserOrder', {
	extend: 'Ext.container.Container',
	alias: 'widget.catalog.userorder',

	requires: [],
	layout: 'hbox',


	initComponent: function() {
		var that = this;

		this.items = [
			{
				xtype: 'displayfield',
				id: 'order-details',
				value: 'User\'s order. Coming soon..',
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