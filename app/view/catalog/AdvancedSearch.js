/**
 * Created by Andrey Baranov
 * date: 11/29/13 4:48 PM
 */

Ext.define('NP.view.catalog.AdvancedSearch', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.advancedsearch',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Back',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.JumpToCatalogForm',
		'NP.view.catalog.UserOrder',
		'NP.view.catalog.SearchForm',
//		'NP.view.catalog.SearchResultsGrid'
		'NP.view.catalog.FavoriteItemsGrid'
	],

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
						xtype: 'catalog.searchform',
						advancedSearch: true
					}
				],
				padding: '5',
				border: false
			},
			{
				xtype: 'catalog.favoriteitemsgrid',
				isSearch: true
			}
		];

		this.callParent(arguments);
	}
});