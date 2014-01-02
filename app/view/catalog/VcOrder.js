/**
 * Created by Andrey Baranov
 * date: 12/2/13 3:10 PM
 */


Ext.define('NP.view.catalog.VcOrder', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.vcorder',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.TopBar',
		'NP.view.catalog.VcOrdersGrid'
	],

	title     : 'Open orders',
	
	autoScroll: true,
	minWidth  : 800,

	layout: {
		type : 'vbox',
		align: 'stretch'
	},

	initComponent: function() {
		var that = this;

		that.title = NP.Translator.translate(that.title);

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
				xtype: 'catalog.vcordersgrid',
				flex : 1
			}
		];

		this.callParent(arguments);
	}
});
