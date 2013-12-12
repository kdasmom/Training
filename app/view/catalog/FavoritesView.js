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
		'NP.view.catalog.JumpToCatalogForm',
		'NP.view.catalog.SearchForm',
		'NP.view.catalog.UserOrder',
		'NP.view.catalog.FavoriteItemsGrid'
	],

	title: NP.Translator.translate('Favorites'),

	initComponent: function() {
		var that = this;
		var bar = [
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
		this.overflowY = 'scroll';

		this.items = [
			{
				xtype: 'panel',
				layout: 'hbox',
				items: [
					{
						xtype: 'catalog.jumptocatalogform',
						flex: 0.8
					},
					{
						xtype: 'catalog.userorder',
						align: 'right',
						flex: 0.2
					}
				],
				padding: '5',
				border: false
			},
			{
				xtype: 'panel',
				items: [
					{
						xtype: 'catalog.searchform'
					}
				],
				padding: '5',
				border: false
			},
			{
				xtype: 'catalog.favoriteitemsgrid',
				overflowY: 'scroll'
			}
		];

		this.callParent(arguments);
	}
});