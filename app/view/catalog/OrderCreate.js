/**
 * Created by Andrey Baranov
 * date: 12/5/13 11:07 AM
 */

Ext.define('NP.view.catalog.OrderCreate', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.ordercreate',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.OrderView',
		'NP.view.catalog.TopBar'
	],

	layout: {
		type : 'vbox',
		align: 'stretch'
	},

	initComponent: function() {
		var that = this;
		var bar = [
			{
				xtype: 'shared.button.back',
				text: NP.Translator.translate('Catalog home')
			},
			{
				xtype: 'shared.button.shop',
				text: NP.Translator.translate('Shop by Brand')
			},
			{
				xtype: 'shared.button.search',
				text: NP.Translator.translate('Advanced search')
			},
			{
				xtype: 'shared.button.favorite'
			}
		];

		this.tbar = bar;

		this.items = [
			{
				xtype: 'catalog.topbar'
			},
			{
				xtype   : 'catalog.orderview',
				vc_id   : this.vc_id,
				vcorders: this.vcorders,
				padding : '20 0 0 0',
				flex    : 1
			}
		];

		this.callParent(arguments);
	}
});