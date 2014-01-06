/**
 * Created by Andrey Baranov
 * date: 11/26/13 4:36 PM
 */

Ext.define('NP.view.catalog.VCListing', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.vclisting',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator',
		'NP.view.shared.button.Shop',
		'NP.view.shared.button.Search',
		'NP.view.shared.button.Favorite',
		'NP.view.catalog.TopBar',
		'NP.view.catalog.VCGrid'
	],

	title: 'Vendor catalog listing',
	autoScroll: true,
	minWidth: 800,

	initComponent: function() {
		var that = this;

		that.title = NP.Translator.translate(that.title);

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


		this.items = [
			{
				xtype: 'catalog.topbar'
			},
			{
				xtype: 'dataview',
				margin: '8px 0 0 0',
				rtl: false,
				tpl: new Ext.XTemplate(
					'<tpl for=".">',
						'<div class="vccat-div" style="{[xindex % 2 == 1 ? "clear: both;" : ""]}">',
							'<div class="vccat-icon"><img src="resources/images/catalog/vc_cat_{category:this.formatName}.jpg"/></div>',
							'<div class="vccat-list">{category}',
								'<ul>',
									'<tpl for="catalogs">',
									'<li data-vcid="{vc_id}" class="vccat-item">{vc_catalogname}</li>',
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
				itemSelector: 'div.vccat-div',
				listeners: {
					itemclick: function( dataview, record, item, index, e, eOpts) {
						var target = Ext.fly(e.target);
						if (target.hasCls('vccat-item')) {
							that.fireEvent('showcatalog', target.getAttribute('data-vcid'));
						}
					}
				}

			}
		];

		this.callParent(arguments);
	}
});
