/**
 * Created by Andrey Baranov
 * date: 12/17/13 3:17 PM
 */


Ext.define('NP.view.catalog.SimpleSearchView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.simplesearchview',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Back',
		'NP.view.shared.button.Favorite',
		'NP.view.shared.button.Search',
		'NP.view.catalog.TopBar',
		'NP.view.catalog.FavoriteItemsGrid'
	],

	title: 'Search',
	autoScroll: true,

	layout: {
		type : 'vbox',
		align: 'stretch'
	},

	initComponent: function() {
		var me = this;

		me.title = NP.Translator.translate(me.title);

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
				xtype   : 'catalog.favoriteitemsgrid',
				isSearch: true,
				flex    : 1
			}
		];

		this.callParent(arguments);
	}
});