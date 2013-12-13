/**
 * Created by Andrey Baranov
 * date: 12/12/13 4:26 PM
 */


Ext.define('NP.view.catalog.FavoriteItemsGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.favoriteitemsgrid',

	requires: [
		'NP.lib.core.Util'
	],

	paging: true,
	overflowY: 'scroll',

	initComponent: function() {
		var that = this;



		var grouping = Ext.create('Ext.grid.feature.GroupingSummary', {
			groupHeaderTpl: '{name}',
			collapsible: false
		});

		this.columns = [
			{
				text: NP.Translator.translate('Favorites'),
				flex: 0.2
			},
			{
				dataIndex: 'vcitem_number',
				text: NP.Translator.translate('Item number'),
				flex: 0.2
			},
			{
				dataIndex: 'vcitem_desc',
				text: NP.Translator.translate('Item description'),
				flex: 0.5
			},
			{
				xtype: 'actioncolumn',
				getClass: function (v, meta, rec, rowIndex) {
					return 'search-btn';
				},
				handler: function(gridView, rowIndex, colIndex) {
					var grid = gridView.ownerCt;
					grid.fireEvent('showdetails', grid, grid.getStore().getAt(rowIndex), rowIndex, false);
				},
				align: 'center',
				text: NP.Translator.translate('Item detail'),
				flex: 0.2
			},
			{
				dataIndex: 'vcitem_price',
				text: NP.Translator.translate('Item price'),
				renderer: function(val, meta, rec) {
					return NP.Util.currencyRenderer(rec.get('vcitem_price'));
				},
				flex: 0.2
			},
			{
				dataIndex: 'vcitem_uom',
				text: NP.Translator.translate('Unit of Measurement'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Qty'),
				flex: 0.2
			},
			{
				text: NP.Translator.translate('Append to order'),
				flex: 0.2
			}
		];

		this.store = Ext.create('NP.store.catalog.VcItems', {
			service    	: 'CatalogService',
			action     	: 'getFavorites',
			groupField	: 'vcitem_category_name',
			extraParams: {
				userprofile_id: NP.Security.getUser().get('userprofile_id')
			},
			paging     	: true,
			autoLoad	: true
		});

		this.features = [grouping];

		this.callParent(arguments);
	}
});