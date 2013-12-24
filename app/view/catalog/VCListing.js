/**
 * Created by Andrey Baranov
 * date: 11/26/13 4:36 PM
 */

Ext.define('NP.view.catalog.VCListing', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.vclisting',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.JumpToCatalogForm',
		'NP.view.catalog.SearchForm',
		'NP.view.catalog.UserOrder',
		'NP.view.catalog.VCGrid'
	],

	title: NP.Translator.translate('Vendor catalog listing'),
	autoScroll: true,

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
		var categoriesStore1 = Ext.create('NP.store.catalog.LinkVcVcCats', {
			service    	: 'CatalogService',
			action     	: 'getCategoriesList',
			groupField	: 'vccat_name',
			extraParams: {
				userprofile_id: NP.Security.getUser().get('userprofile_id')
			},
			filters: [
				function(item) {
					if (item.index % 2 !== 0) {
						return item;
					}
				}
			],
			autoLoad	: true
		});
		var oddstore = Ext.create('NP.store.catalog.LinkVcVcCats', {
			service    	: 'CatalogService',
			action     	: 'getCategoriesList',
			groupField	: 'vccat_name',
			extraParams: {
				userprofile_id: NP.Security.getUser().get('userprofile_id')
			},
			filters: [
				function(record) {
					if (record.index % 2 == 0) {
						return true;
					}
				}
			],
			autoLoad	: true
		});

		var evenstore = Ext.create('NP.store.catalog.LinkVcVcCats', {
			service    	: 'CatalogService',
			action     	: 'getCategoriesList',
			groupField	: 'vccat_name',
			extraParams: {
				userprofile_id: NP.Security.getUser().get('userprofile_id')
			},
			filters: [
				function(record) {
					if (record.index % 2 !== 0) {
						return true;
					}
				}
			],
			autoLoad	: true
		});


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
				xtype: 'container',
				layout: 'hbox',
				items: [
					{
						xtype: 'catalog.vcgrid',
						name: 'evenitems',
						flex: 0.5,
						store: evenstore
					},
					{
						xtype: 'catalog.vcgrid',
						name: 'odditems',
						flex: 0.5,
						store: oddstore
					}
				]
			}
		];

		this.callParent(arguments);
	}
});
