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

		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});


		this.plugins = [cellEditing];
		this.features = [grouping];

		this.columns = [
			{
				xtype: 'shared.gridcol.buttonimg',
				text: NP.Translator.translate('Favorites'),
				flex: 0.2,
				renderer: function (val, meta, rec) {
					return '<div class="remove"><img src="resources/images/buttons/delete.gif" title="Remove" alt="Remove" class="remove"/>&nbsp; Remove from favorites</div>';
				},
				listeners: {
					click: function (grid, rec, item, index, e) {
						that.fireEvent('removefromfavorites', grid, grid.getStore().getAt(index), index);
					}
				}
			},
			{
				dataIndex: 'vcitem_number',
				text: NP.Translator.translate('Item number'),
				flex: 0.2
			},
			{
				dataIndex: 'vcitem_desc',
				text: NP.Translator.translate('Item description'),
				flex: 0.5,
				renderer: function(val, meta, rec) {
					if (!rec.raw.vcitem_status) {
						val += '<br/><b style="color: red;">This item is no longer available for order</b>';
					}

					return val;
				}
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
				align: 'center',
				flex: 0.1
			},
			{
				dataIndex: 'vcitem_uom',
				text: NP.Translator.translate('Unit of Measurement'),
				align: 'center',
				flex: 0.2
			},
			{
				xtype: 'numbercolumn',
				align: 'center',
				text: NP.Translator.translate('Qty'),
				flex: 0.1,
				editor: {
					xtype: 'numberfield',
					allowBlank: false,
					minValue: 0,
					maxValue: 100000
				}
			},
			{
				xtype: 'shared.gridcol.buttonimg',
				text: NP.Translator.translate('Append to order'),
				flex: 0.2,
				renderer: function(val, meta, rec) {
					if (rec.get('vcitem_status')) {
						return '<div class="addtoorder"><img src="resources/images/buttons/new.gif" title="Add to order" alt="Add to order" class="addtoorder"/>&nbsp; Add to order</div>';
					}

					return '';
				}
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


		this.callParent(arguments);
	}
});