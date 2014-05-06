/**
 * Created by Andrey Baranov
 * date: 12/12/13 4:26 PM
 */


Ext.define('NP.view.catalog.FavoriteItemsGrid', {
	extend: 'NP.lib.ui.Grid',
	alias : 'widget.catalog.favoriteitemsgrid',

	requires: [
		'NP.lib.core.Security',
		'NP.lib.core.Util',
		'Ext.grid.feature.GroupingSummary'
	],
	
	border        : false,

	paging        : true,
	changedRecords: {},
	isSearch      : false,

	initComponent: function() {
		var that = this;

		Ext.applyIf(that, {
			userprofile_id: NP.Security.getUser().get('userprofile_id')
		});

		var grouping = Ext.create('Ext.grid.feature.GroupingSummary', {
			groupHeaderTpl: '{name}',
			collapsible: false
		});
		this.features = [grouping];

		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1,
			listeners: {
				edit: function(editor, e, eOpts) {
					that.changedRecords[e.record.get('vcitem_id')] = e.value;
				}
			}
		});


		this.plugins = [cellEditing];

		this.emptyText = NP.Translator.translate('No items found.');

		this.columns = [
			{
				xtype: 'shared.gridcol.buttonimg',
				text: NP.Translator.translate('Favorites'),
				flex: 0.2,
				shrinkWrap: true,
				renderer: function (val, meta, rec) {
					if (rec.raw.vcfav_id) {
						return '<div class="remove" style="cursor: pointer; word-wrap: break-word;"><img src="resources/images/buttons/delete.gif" title="Remove" alt="Remove" class="remove"/>&nbsp; Remove</div>';
					} else {
						return '<div class="add" style="cursor: pointer;"><img src="resources/images/buttons/new.gif" title="Add" alt="Add" class="add"/>&nbsp; Add to</div>';
					}
				},
				listeners: {
					click: function (grid, rec, item, index, e) {
						var record = grid.getStore().getAt(item);
						if (record.raw.vcfav_id) {
							that.fireEvent('removefromfavorites', grid, record, index);
						} else {
							that.fireEvent('addtofavorites', grid, record, index);
						}
					}
				},
				tdCls: '',
				align: 'left'
			},
			{
				dataIndex: 'vcitem_number',
				text: NP.Translator.translate('Item number'),
				flex: 0.2,
				renderer: function (val, meta, record) {
					if (record.raw.vcorder_id) {
						return val + '<div style="font-style: italic;">' + NP.Translator.translate('In Card') + '</div>'
					}
					return val;
				}
			},
			{
				dataIndex: 'vcitem_desc',
				text: NP.Translator.translate('Item description'),
				flex: 0.5,
				renderer: function(val, meta, rec) {
					if (!rec.raw.vcitem_status) {
						val += '<br/><b style="color: red;">' + NP.Translator.translate('This item is no longer available for order') + '</b>';
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
				dataIndex: 'vcitem_upc',
				text: NP.Translator.translate('UPC'),
				align: 'center',
				flex: 0.2
			},
			{
				xtype: 'numbercolumn',
				align: 'center',
				text: NP.Translator.translate('Qty'),
				flex: 0.1,
				format: '0',
				editor: {
					xtype: 'numberfield',
					allowBlank: false,
					minValue: 0,
					maxValue: 100000,
					decimalPrecision: 0
				}
			},
			{
				xtype: 'shared.gridcol.buttonimg',
				dataIndex: 'vcitem_id',
				text: NP.Translator.translate('Append to order'),
				flex: 0.2,
				renderer: function(val, meta, rec) {
					if (rec.get('vcitem_status')) {
						return '<div class="addtoorder" style="cursor: pointer;"><img src="resources/images/buttons/new.gif" title="Add to order" alt="Add to order" class="addtoorder"/>&nbsp; Add to order</div>';
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

		if (!this.isSearch) {
			if (!this.filterField) {
				this.store = Ext.create('NP.store.catalog.VcItems', {
					service    	: 'CatalogService',
					action     	: 'getFavorites',
					groupField	: 'vc_vendorname',
					extraParams: {
						userprofile_id: NP.Security.getUser().get('userprofile_id')
					},
					paging     	: true,
					autoLoad	: true
				});
			} else {
				this.store = Ext.create('NP.store.catalog.VcItems', {
					service    	: 'CatalogService',
					action     	: 'getItemsByCategoryOrBrand',
					groupField	: 'vc_vendorname',
					extraParams: {
						userprofile_id: NP.Security.getUser().get('userprofile_id'),
						vc_id: that.vc_id,
						field: that.filterField,
						value: that.filterValue
					},
					paging     	: true,
					autoLoad	: true
				});
			}
		} else {
			this.store = Ext.create('NP.store.catalog.VcItems', {
				service    	: 'CatalogService',
				action     	: 'searchItems',
				groupField	: 'vc_vendorname',
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
		}

		this.callParent(arguments);
	}
});