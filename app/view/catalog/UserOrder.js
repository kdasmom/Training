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
				value: 'User\'s order. Coming soon..'
			}
		];

		this.callParent(arguments);
	}
});