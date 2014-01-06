/**
 * Created by Andrey Baranov
 * date: 12/19/13 4:13 PM
 */

Ext.define('NP.view.catalog.ItemsView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.itemsview',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.TopBar',
		'NP.view.catalog.ItemsFilter',
		'NP.view.catalog.FavoriteItemsGrid'
	],

	title: 'Catalog listing',
	autoScroll: true,
	minWidth: 1000,

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
				xtype     : 'panel',
				layout    : {
					type : 'hbox',
					align: 'stretch'
				},
				autoscroll: true,
				border    : false,
				padding   : '15 5 0 5',
				flex      : 1,
				items     : [
					{
						xtype: 'catalog.itemsfilter',
						region: 'west',
						category: me.value,
						filterField: me.field,
						filterValue: me.value,
						vc_id: me.vc_id,
						width: 300,
						border: true,
						margin: '0 8px 0 0'
					},
					{
						xtype: 'catalog.favoriteitemsgrid',
						region: 'center',
						filterField: me.field,
						filterValue: me.value,
						vc_id: me.vc_id,
						border: true,
						flex  : 1
					}
				]
			}
		];

		this.callParent(arguments);
	}
});