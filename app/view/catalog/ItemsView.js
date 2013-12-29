/**
 * Created by Andrey Baranov
 * date: 12/19/13 4:13 PM
 */

Ext.define('NP.view.catalog.ItemsView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.itemsview',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.JumpToCatalogForm',
		'NP.view.catalog.SearchForm',
		'NP.view.catalog.UserOrder',
		'NP.view.catalog.ItemsFilter',
		'NP.view.catalog.FavoriteItemsGrid'
	],

	title: NP.Translator.translate('Catalog listing'),
	autoScroll: true,
	minWidth: 1000,

	initComponent: function() {
		var me = this;

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
				xtype: 'panel',
				border: false,
				layout: 'hbox',
				autoscroll: true,
				padding: '15 5 0 5',
				items: [
					{
						xtype: 'catalog.itemsfilter',
						category: me.value,
						filterField: me.field,
						filterValue: me.value,
						vc_id: me.vc_id,
						minWidth: 300,
						padding: '0 0 20 0'
					},
					{
						xtype: 'panel',
						border: false,
						items: [
							{
								xtype: 'catalog.favoriteitemsgrid',
								name: 'itemsgrid',
								filterField: me.field,
								filterValue: me.value,
								vc_id: me.vc_id,
								height: 500,
								border: false
							}
						],
						flex: 0.8,
						autoScroll: true
					}
				]
			}
		];


		/*if (me.catalog.vc_catalogtype == 'url') {
			me.items.push({
				xtype: 'component',
				autoEl: {
					tag : "iframe",
					src: me.catalog_url
				}
			});
		}
		if (me.catalog.vc_catalogtype == 'pdf') {
			me.items.push({
				xtype: 'component',
				autoEl: {
					tag : "iframe",
					src: me.catalog.vc_url
				}
			});
		}
		if (me.catalog.vc_catalogtype == 'punchout')*/

		this.callParent(arguments);
	}
});