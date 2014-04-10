/**
 * Created by Andrey Baranov
 * date: 12/12/13 4:29 PM
 */

Ext.define('NP.view.catalog.FavoritesView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.favoritesview',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.TopBar',
		'NP.view.catalog.FavoriteItemsGrid'
	],

	title: 'Favorites',
	autoScroll: true,

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
			}
		];

		this.tbar = bar;

		this.items = [
			{
				xtype: 'catalog.topbar'
			},
			{
				xtype: 'catalog.favoriteitemsgrid',
				flex : 1
			}
		];

		this.callParent(arguments);
	}
});