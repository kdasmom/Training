/**
 * Created by Andrey Baranov
 * date: 12/18/13 2:57 AM
 */

Ext.define('NP.view.catalog.CategoriesDataView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.categoriesdataview',

	requires: [
		'NP.lib.core.Config'
	],

	title: NP.Translator.translate('Shop by category'),

	initComponent: function() {
		var that = this;


		this.items = [
			{
				xtype: 'dataview',
				tpl: new Ext.XTemplate(
					'<tpl for=".">',
					'<div style="margin-bottom: 10px; float: left; width: 50%; padding: 10px; cursor: pointer;" class="category">',
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
				itemSelector: 'div.category',
				listeners: {
					itemclick: function( dataview, record, item, index, e, eOpts) {
						console.log(record);
						that.fireEvent('showbycategory', 'category', record.get('category'), that.vc_id);
					}
				}
			}
		];

		this.callParent(arguments);
	}
});