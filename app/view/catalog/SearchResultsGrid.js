/**
 * Created by Andrey Baranov
 * date: 11/29/13 5:39 PM
 */


Ext.define('NP.view.catalog.SearchResultsGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.searchresultsgrid',

	requires: [
		'NP.lib.core.Util'
	],

	paging: true,
	overflowY: 'scroll',
	changedRecords: {},

	initComponent: function() {

		var that = this;

		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1,
			listeners: {
				edit: function(editor, e, eOpts) {
					that.changedRecords[e.record.get('vcitem_id')] = e.value;
				}
			}
		});


		this.plugins = [cellEditing];

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
				text: NP.Translator.translate('Item details'),
				flex: 0.2
			},
			{
				dataIndex: 'vcitem_price',
				text: NP.Translator.translate('Item price'),
				renderer: function(val, meta, rec) {
					return NP.Util.currencyRenderer(rec.get('vcitem_price'));
				},
				align: 'center',
				flex: 0.2
			},
			{
				dataIndex: 'vcitem_uom',
				text: NP.Translator.translate('Unit of measurement'),
				align: 'center',
				flex: 0.2
			},
			{
				xtype: 'numbercolumn',
				align: 'center',
				text: NP.Translator.translate('Quantity'),
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
				dataIndex: 'vcitem_id',
				text: NP.Translator.translate('Append to order'),
				flex: 0.2,
				renderer: function(val, meta, rec) {
					if (rec.get('vcitem_status')) {
						return '<div class="addtoorder"><img src="resources/images/buttons/new.gif" title="Add to order" alt="Add to order" class="addtoorder"/>&nbsp; Add to order</div>';
					}

					return '';
				},
				listeners: {
					click: function (grid, rec, item, index, e) {
						that.fireEvent('addtoorder', grid, grid.getStore().getAt(item), that.changedRecords);
						that.changedRecords = {};
					}
				}
			}
		];

		this.store = Ext.create('NP.store.catalog.VcItems', {
			service    	: 'CatalogService',
			action     	: 'searchItems',
			extraParams: {
				catalogs: null,
				field: null,
				property: null,
				keyword: null,
				userprofile_id: NP.Security.getUser().get('userprofile_id')
			},
			paging     	: true,
			autoLoad	: true
		});

		this.callParent(arguments);
	}

});