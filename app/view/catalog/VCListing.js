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
	minWidth: 800,

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
		/*var oddstore = Ext.create('NP.store.catalog.LinkVcVcCats', {
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
		});*/


		this.tbar = bar;

		var store = Ext.create('Ext.data.ArrayStore', {
			fields: ['type', 'titles'],
			autoLoad : true,
			data: [
				['category', ['title1', 'title2']]
			]
		});

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
				xtype: 'dataview',
				rtl: false,
				tpl: new Ext.XTemplate(
					'<tpl for=".">',
						'<div style="display: table-cell; float: right; width: 50%; padding: 10px; cursor: pointer;" class="category">',
							'<div style="float: left; position: relative; padding-right: 10px; height: 100%;"><img src="/files/categories/vc_cat_{category:this.formatName}.jpg"/></div>',
							'<div style="color: #72afd8; font-weight: bold; float:left; position: relative;">{category}',
								'<ul>',
									'<tpl for="catalogs">',
									'<li data-vcid="{vc_id}" style="color: black; font-weight: normal; text-decoration: underline;" class="vc">{vc_catalogname}</li>',
									'</tpl>',
								'</ul>',
							'</div>',
						'</div>',
					'</tpl>',
					{
						formatName: function(name) {
							return name.replace(/ /gi,'_');
						}
					}
				),
				store: Ext.create('NP.lib.data.Store', {
					service: 'CatalogService',
					action: 'getCategoriesList',
					extraParams: {
						userprofile_id: NP.Security.getUser().get('userprofile_id')
					},
					fields: ['category', 'catalogs'],
					autoLoad: true
				}),
				itemSelector: 'div.category',
				listeners: {
					itemclick: function( dataview, record, item, index, e, eOpts) {
						var target = Ext.fly(e.target);
						if (target.hasCls('vc')) {
							that.fireEvent('showcatalog', target.getAttribute('data-vcid'));
						}
					}
				}

			}
		];

		this.callParent(arguments);
	}
});
