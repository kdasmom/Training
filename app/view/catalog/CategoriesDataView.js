/**
 * Created by Andrey Baranov
 * date: 12/18/13 2:57 AM
 */

Ext.define('NP.view.catalog.CategoriesDataView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.categoriesdataview',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator'
	],

	title: 'Shop by category',

	bodyPadding: 8,

	initComponent: function() {
		var that = this;

		that.title = NP.Translator.translate(that.title);

		this.items = [
			{
				xtype: 'dataview',
				tpl: new Ext.XTemplate(
					'<tpl for=".">',
					'<div class="vc-shop-by">',
					'<span>{category} ({total_items})</span>',
					'</div>',
					'</tpl>'
				),
				store: Ext.create('NP.lib.data.Store', {
					service: 'CatalogService',
					action: 'getCategoriesWithItemsCount',
					extraParams: {
						vc_id: that.vc_id
					},
					fields: ['category', 'total_items', 'commodityid']
				}),
				itemSelector: 'div.vc-shop-by',
				listeners: {
					itemclick: function( dataview, record, item, index, e, eOpts) {
						that.fireEvent('showbycategory', 'category', record.get('category'), that.vc_id);
					}
				}
			}
		];

		this.callParent(arguments);
	}
});