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
		'NP.view.catalog.TopBar',
		'NP.view.catalog.FavoriteItemsGrid'
	],

	title: 'Advanced search',

	layout: {
		type : 'vbox',
		align: 'stretch'
	},

	initComponent: function() {
		var me = this,
			bar = [
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

		me.title = NP.Translator.translate(me.title);

		me.tbar = bar;
		me.autoScroll = true;

		me.items = [
			{
				xtype: 'catalog.topbar',
				advancedSearch: true
			},
			{
				xtype   : 'catalog.favoriteitemsgrid',
				isSearch: true,
				flex    : 1
			}
		];

		me.callParent(arguments);
	}
});