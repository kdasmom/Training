/**
 * Created by Andrey Baranov
 * date: 12/18/13 3:26 PM
 */

Ext.define('NP.view.catalog.BrandsDataView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.brandsdataview',

	requires: [
		'NP.lib.core.Config',
		'NP.lib.core.Translator'
	],

	title: 'Shop by brand',

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
					'<span>{vcitem_manufacturer} ({total_items})</span>',
					'</div>',
					'</tpl>'
				),
				store: Ext.create('NP.lib.data.Store', {
					service: 'CatalogService',
					action: 'getBrandsWithItemsCount',
					extraParams: {
						vc_id: that.vc_id
					},
					fields: ['vcitem_manufacturer', 'total_items']
				}),
				itemSelector: 'div.vc-shop-by',
				listeners: {
					itemclick: function( dataview, record, item, index, e, eOpts) {
						that.fireEvent('showbybrand', 'brand', record.get('vcitem_manufacturer'), that.vc_id);
					}
				}
			}
		];

		this.callParent(arguments);
	}
});