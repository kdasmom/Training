/**
 * Created by Andrey Baranov
 * date: 11/29/13 5:14 PM
 */

Ext.define('NP.view.catalog.CatalogView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.catalogview',

	requires: [
		'NP.lib.core.Config',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Back',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.JumpToCatalogForm',
		'NP.view.catalog.UserOrder',
		'NP.view.catalog.SearchForm',
		'NP.view.catalog.CategoriesDataView',
		'NP.view.catalog.BrandsDataView'
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
				xtype: 'shared.button.search',
				text: NP.Translator.translate('Advanced search')
			},
			{
				xtype: 'shared.button.favorite'
			}
		];

		this.tbar = bar;
		this.autoScroll = true;

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
						advancedSearch: that.advancedSearch
					}
				],
				padding: '5',
				border: false
			}
		];

		if (that.catalog.vc_catalogtype == 'excel') {
			this.items.push({
				xtype: 'catalog.categoriesdataview',
				vc_id: that.vc_id,
				overflowY: 'scroll'
			});
			this.items.push({
				xtype: 'catalog.brandsdataview',
				vc_id: that.vc_id,
				padding: '20 0 0 0',
				overflowY: 'scroll'
			});
		}

		if (that.catalog.vc_catalogtype == 'url') {
			that.items.push({
				xtype: 'component',
				autoEl: {
					tag : "iframe",
					src: that.catalog.vc_url
				}
			});
		}
		if (that.catalog.vc_catalogtype == 'pdf') {
			that.items.push({
				xtype: 'component',
				autoEl: {
					tag : "iframe",
					src: that.catalog.vc_url
				}
			});
		}

		if (that.catalog.vc_catalogtype == 'punchout') {
			that.items.push(
				{
					xtype: 'panel',
					layout: 'fit',
					align: 'center',
					tbar: [
						{
							xtype: 'customcombo',
							name: 'userProperty',
							store: 'user.Properties',
							displayField: 'property_name',
							valueField: 'vc_id',
							queryMode: 'local',
							editable: false,
							typeAhead: false,
							fieldLabel: NP.Translator.translate('Property'),
							listeners: {
								select: function (combo, records, eOpts) {
									that.fireEvent('punchoutshow', records[0].get('property_id'), that.vc_id);
								}
							},
							width: 300
						}
					],
					items: [
						{
							xtype: 'component',
							name: 'punchoutiframe',
							padding: '10',
							width: '100%',
							flex: 1,
							autoEl: {
								tag: 'iframe',
								src: '',
								width: '100%'
							}
						}
					]
				}
			);
		}

		this.callParent(arguments);
	}
});
