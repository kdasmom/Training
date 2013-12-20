/**
 * Created by Andrey Baranov
 * date: 12/18/13 3:26 PM
 */

Ext.define('NP.view.catalog.BrandsDataView', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.catalog.brandsdataview',

	requires: [
		'NP.lib.core.Config'
	],

	title: NP.Translator.translate('Shop by brand'),

	initComponent: function() {
		var that = this;


		this.items = [
			{
				xtype: 'dataview',
				tpl: new Ext.XTemplate(
					'<tpl for=".">',
					'<div style="margin-bottom: 10px; float: left; width: 50%; padding: 10px; cursor: pointer;" class="brand">',
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
				itemSelector: 'div.brand',
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