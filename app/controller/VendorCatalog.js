/**
 * Created by rnixx on 11/26/13.
 */

Ext.define('NP.controller.VendorCatalog', {
	extend: 'NP.lib.core.AbstractController',

	requires: [
		'NP.lib.core.Net',
		'NP.lib.core.Config',
		'NP.lib.core.Util',
		'NP.lib.core.Security'
	],

	views: [
		'catalog.OrderItemWindow',
		'catalog.AdvancedSearch',
		'catalog.BrandsView',
		'catalog.SimpleSearchView',
		'catalog.CatalogView',
		'catalog.BrandsDataView',
		'catalog.ItemsView'
	],

	stores: [
		'catalog.VcItems'
	],
	models: [],

	/**
	 * Init
	 */
	init: function(){
		Ext.log('Vendor Catalog Controller init');

		this.control({
			'[xtype="catalog.jumptocatalogform"] [xtype="button"]': {
				click: function() {
					var catalog = this.getCmp('catalog.jumptocatalogform').getChildByElement('vc_id').getValue();

					this.addHistory('VendorCatalog:showCatalogView:' + catalog);
				}
			},
			'[xtype="catalog.userorder"] [xtype="button"]': {
				click: function() {
					this.addHistory('VendorCatalog:showOpenOrders');
				}
			},
			'[xtype="catalog.vclisting"] [xtype="shared.button.search"]': {
				click: function() {
					this.addHistory('VendorCatalog:showAdvancedSearch');
				}
			},
			'[xtype="catalog.vcorder"] [xtype="shared.button.search"]': {
				click: function() {
					this.addHistory('VendorCatalog:showAdvancedSearch');
				}
			},
			'[xtype="catalog.ordercreate"] [xtype="shared.button.search"]': {
				click: function() {
					this.addHistory('VendorCatalog:showAdvancedSearch');
				}
			},
			'[xtype="catalog.favoritesview"] [xtype="shared.button.search"]': {
				click: function() {
					this.addHistory('VendorCatalog:showAdvancedSearch');
				}
			},
			'[xtype="catalog.simplesearchview"] [xtype="shared.button.search"]': {
				click: function() {
					this.addHistory('VendorCatalog:showAdvancedSearch');
				}
			},
			'[xtype="catalog.brandsview"] [xtype="shared.button.search"]': {
				click: function() {
					this.addHistory('VendorCatalog:showAdvancedSearch');
				}
			},
			'[xtype="catalog.itemsview"] [xtype="shared.button.search"]': {
				click: function() {
					this.addHistory('VendorCatalog:showAdvancedSearch');
				}
			},
			'[xtype="catalog.advancedsearch"] [xtype="shared.button.back"]': {
				click: function() {
					this.addHistory('VendorCatalog:showVendorCatalogListing');
				}
			},
			'[xtype="catalog.simplesearchview"] [xtype="shared.button.back"]': {
				click: function() {
					this.addHistory('VendorCatalog:showVendorCatalogListing');
				}
			},
			'[xtype="catalog.vcorder"] [xtype="shared.button.back"]': {
				click: function() {
					this.addHistory('VendorCatalog:showVendorCatalogListing');
				}
			},
			'[xtype="catalog.ordercreate"] [xtype="shared.button.back"]': {
				click: function() {
					this.addHistory('VendorCatalog:showVendorCatalogListing');
				}
			},
			'[xtype="catalog.favoritesview"] [xtype="shared.button.back"]': {
				click: function() {
					this.addHistory('VendorCatalog:showVendorCatalogListing');
				}
			},
			'[xtype="catalog.brandsview"] [xtype="shared.button.back"]': {
				click: function() {
					this.addHistory('VendorCatalog:showVendorCatalogListing');
				}
			},
			'[xtype="catalog.vclisting"] [xtype="shared.button.back"]': {
				click: function() {
					this.addHistory('VendorCatalog:showVendorCatalogListing');
				}
			},
			'[xtype="catalog.itemsview"] [xtype="shared.button.back"]': {
				click: function() {
					this.addHistory('VendorCatalog:showVendorCatalogListing');
				}
			},
			'[xtype="catalog.vcorder"] [xtype="catalog.vcordersgrid"]': {
				cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
					if (Ext.get(e.target).hasCls('remove')) {
						this.removeOrder(record.get('vcorder_id'));
					}
				},
				updateorder: this.updateOrders,
				createorder: function (vc_id, vcorders) {
					this.addHistory('VendorCatalog:createOrder:' + vc_id + ':' + vcorders);
				},
				showdetails: this.showOrderItemDetailsWindow
			},
			'[xtype="catalog.ordercreate"] [xtype="catalog.orderview"] [xtype="catalog.orderpropertiesform"]': {
				selectProperty: this.getOrderVendors,
				selectVendor: this.getOrderPOs
			},
			'[xtype="catalog.orderitemwindow"] [xtype="shared.button.close"]': {
				click: function() {
					this.getCmp('catalog.orderitemwindow').hide();
				}
			},
			'[xtype="catalog.orderitemwindow"]': {
				restoreshoppingcart: this.restoreShoppingCart
			},
			'[xtype="catalog.favoriteitemsgrid"]': {
				showdetails: this.showOrderItemDetailsWindow,
				removefromfavorites: this.removeFromFavorites,
				addtoorder: this.addItemToOrder,
				addtofavorites: this.addToFavorites
			},
			'[xtype="catalog.searchform"]': {
				searchitems: function (catalogs, type, property, keyword, isAdvanced) {
					this.addHistory('VendorCatalog:showSimpleSearchResults:' + catalogs + ':' + type + ':' + property + ':' + keyword);
				},
				advancedsearch: this.showAdvancedSearchResults
			},
			'[xtype="catalog.simplesearchview"] [xtype="shared.button.favorite"]': {
				click: function() {
					this.addHistory('VendorCatalog:showFavorites');
				}
			},
			'[xtype="catalog.vclisting"] [xtype="shared.button.favorite"]': {
				click: function() {
					this.addHistory('VendorCatalog:showFavorites');
				}
			},
			'[xtype="catalog.advancedsearch"] [xtype="shared.button.favorite"]': {
				click: function() {
					this.addHistory('VendorCatalog:showFavorites');
				}
			},
			'[xtype="catalog.itemsview"] [xtype="shared.button.favorite"]': {
				click: function() {
					this.addHistory('VendorCatalog:showFavorites');
				}
			},
			'[xtype="catalog.brandsview"] [xtype="shared.button.favorite"]': {
				click: function() {
					this.addHistory('VendorCatalog:showFavorites');
				}
			},
			'[xtype="catalog.itemsview"] [xtype="shared.button.shop"]': {
				click: function() {
					this.addHistory('VendorCatalog:showBrands');
				}
			},
			'[xtype="catalog.advancedsearch"] [xtype="shared.button.shop"]': {
				click: function() {
					this.addHistory('VendorCatalog:showBrands');
				}
			},
			'[xtype="catalog.simplesearchview"] [xtype="shared.button.shop"]': {
				click: function() {
					this.addHistory('VendorCatalog:showBrands');
				}
			},
			'[xtype="catalog.favoritesview"] [xtype="shared.button.shop"]': {
				click: function() {
					this.addHistory('VendorCatalog:showBrands');
				}
			},
			'[xtype="catalog.vclisting"] [xtype="shared.button.shop"]': {
				click: function() {
					this.addHistory('VendorCatalog:showBrands');
				}
			},
			'[xtype="catalog.brandsview"]': {
				focusonletter: this.focusBrandsGroup
			},
			'[xtype="catalog.brandsdataview"]': {
				showbybrand: function(field, value, vc_id) {
					this.addHistory('VendorCatalog:showItems:' + field + ':' + value + ':' + vc_id);
				}
			},
			'[xtype="catalog.categoriesdataview"]': {
				showbycategory: function(field, value, vc_id) {
					this.addHistory('VendorCatalog:showItems:' + field + ':' + value + ':' + vc_id);
				}
			},
			'[xtype="catalog.itemsfilter"]': {
				removetype: this.removeTypeFilter,
				removeprice: this.removePriceFilter,
				removefilter: this.removeTopFilter
			},
			'[xtype="catalog.vclisting"] [xtype="catalog.vcgrid"]': {
				itemclick: function ( grid, record, item, index, e, eOpts) {
					this.addHistory('VendorCatalog:showItems:category:' + record.get('vccat_name') + ':' + record.get('vc_id'));
				}
			}
		});

	},

	showVendorCatalogListing: function() {
		var panel = this.setView('NP.view.catalog.VCListing');
		this.showUserOrderSummary(this.userSummaryCallback);
	},

	showCatalogView: function(vc_id) {
		var view = this.setView('NP.view.catalog.CatalogView', {vc_id: vc_id});
		this.showUserOrderSummary(this.userSummaryCallback);

		var catalogs = this.getCmp('catalog.catalogview').down('dataview');
		var brands = this.getCmp('catalog.brandsdataview').down('dataview');

		Ext.apply(catalogs.getStore().getProxy().extraParams, {
			vc_id: vc_id
		});
		Ext.apply(brands.getStore().getProxy().extraParams, {
			vc_id: vc_id
		});

		catalogs.getStore().reload();
		brands.getStore().reload();

	},

	showAdvancedSearch: function(catalogs, type, property, keyword) {
		this.setView('NP.view.catalog.AdvancedSearch');
		this.showUserOrderSummary(this.userSummaryCallback);

		var grid = this.getCmp('catalog.favoriteitemsgrid');

		grid.addExtraParams({
			catalogs: catalogs,
			field: type,
			property: property,
			keyword: keyword,
			userprofile_id: NP.Security.getUser().get('userprofile_id')
		});

		grid.getStore().load();
	},

	/**
	 * Show user's shopping cart
	 *
	 * @param callback
	 */
	showUserOrderSummary: function(callback) {
		callback = callback || Ext.emptyFn;

		var that = this;

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'getUserCartSummary',
				userprofile_id : NP.Security.getUser().get('userprofile_id'),
				success: function(success) {
					callback(success[0].totalItems, success[0].totalPrice, that);
				}
			}
		});
	},

	userSummaryCallback: function(items, sum, that) {
		var form = that.getCmp('catalog.userorder');
		var message = items + ' Items in Your Order<br/>' + NP.Util.currencyRenderer(sum) + ' Current Subtotal';
		var field = form.getChildByElement('order-details');
		field.setValue(message);
	},

	/**
	 * Show user's order
	 *
	 */
	showOpenOrders: function() {
		this.setView('NP.view.catalog.VcOrder');
		this.showUserOrderSummary(this.userSummaryCallback);
	},

	/**
	 * remove item from order
	 *
	 * @param order_id
	 */
	removeOrder: function (order_id) {
		var that = this;

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'removeOrder',
				order_id : order_id,
				userprofile_id: NP.Security.getUser().get('userprofile_id'),
				success: function(success) {
					if (success) {
						var grid = that.getCmp('catalog.vcordersgrid');
						grid.getStore().reload();
						that.showUserOrderSummary(that.userSummaryCallback);
					}
				}
			}
		});
	},

	/**
	 *
	 * Update order
	 *
	 * @param records
	 */
	updateOrders: function(records) {
		var count = 0;

		for (var index in records) {
			count++;
			if (count > 0) {
				break;
			}
		}
		var that = this;

		if (count > 0) {
			NP.lib.core.Net.remoteCall({
				requests: {
					service: 'CatalogService',
					action : 'updateOrders',
					userprofile_id : NP.Security.getUser().get('userprofile_id'),
					vcorders : JSON.stringify(records),
					success: function(success) {
						if (success) {
							var grid = that.getCmp('catalog.vcordersgrid');
							grid.getStore().reload();
							that.showUserOrderSummary(that.userSummaryCallback);
						}
					}
				}
			});
		}
	},

	/**
	 * create order page
	 */
	createOrder: function(vc_id, vcorders) {
		this.setView('NP.view.catalog.OrderCreate', {vc_id: vc_id, vcorders: vcorders});
		this.showUserOrderSummary(this.userSummaryCallback);

	},

	/**
	 * Retrieve order vendors
	 *
	 * @param combo
	 * @param value
	 * @param vc_id
	 * @param vcorders
	 */
	getOrderVendors: function(combo, value, vc_id, vcorders) {
		var that = this;
		var form = this.getCmp('catalog.orderpropertiesform');
		form.getChildByElement('vendor_id').store = Ext.create('NP.store.vendor.Vendors', {
			service: 'CatalogService',
			action: 'getOrderVendors',
			extraParams: {
				vc_id: vc_id,
				property_id: value[0].get('property_id')
			},
			autoLoad: true
		});
		var grid = this.getCmp('catalog.createordergrid');
		grid.addExtraParams({
			userprofile_id: NP.Security.getUser().get('userprofile_id'),
			vc_id: vc_id,
			property_id: combo.getValue(),
			vcorder_id: vcorders
		});
		grid.getStore().load();
	},

	/**
	 * Retrieve orders
	 *
	 * @param combo
	 * @param value
	 * @param property_id
	 */
	getOrderPOs: function(combo, value, property_id) {
		var that = this;
		var form = this.getCmp('catalog.orderpropertiesform');

		form.getChildByElement('purchaseorder_id').store = Ext.create('NP.store.po.Purchaseorders', {
			service: 'PoService',
			action: 'getOrderPOs',
			extraParams: {
				vendorsite_id: combo.getValue(),
				property_id: property_id
			},
			autoLoad: true
		});

		var grid = this.getCmp('catalog.createordergrid');
		grid.setVendorsiteId(combo.getValue());
	},

	/**
	 * Show item info popup window
	 *
	 * @param grid
	 * @param record
	 * @param rowIndex
	 * @param fromOrder
	 */
	showOrderItemDetailsWindow: function (grid, record, rowIndex, fromOrder) {
		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'getOrderItemInformation',
				userprofile_id : NP.Security.getUser().get('userprofile_id'),
				vcitem_id : record.get('vcitem_id'),
				success: function(data) {
					if (data) {
						Ext.create('NP.view.catalog.OrderItemWindow', { fromOrder: fromOrder, data: data[0], grid: grid }).show();
					}
				}
			}
		});
	},

	/**
	 *  show favorites
	 */
	showFavorites: function() {
		this.setView('NP.view.catalog.FavoritesView');
		this.showUserOrderSummary(this.userSummaryCallback);
	},

	/**
	 *
	 * remove from favorites
	 *
	 * @param grid
	 * @param record
	 * @param index
	 */
	removeFromFavorites: function (grid, record, index) {
		console.log('rec2: ', record.get('vcitem_id'));
		this.toggleFavorites(grid, record.get('vcitem_id'), false);
	},

	addToFavorites: function(grid, record, index) {
		this.toggleFavorites(grid, record.get('vcitem_id'), true);
	},

	toggleFavorites: function (grid, vcitem_id, add) {
		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'toggleFavorites',
				userprofile_id : NP.Security.getUser().get('userprofile_id'),
				vcitem_id : vcitem_id,
				add: add,
				success: function(data) {
					if (data) {
						grid.getStore().reload();
					}
				}
			}
		});
	},

	/**
	 * add to order
	 *
	 *
	 * @param grid
	 * @param record
	 * @param changedRecords
	 */
	addItemToOrder: function(grid, record, changedRecords) {
		var that = this;

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'addToOrder',
				userprofile_id : NP.Security.getUser().get('userprofile_id'),
				vcitem_id : record.get('vcitem_id'),
				quantity: !changedRecords[record.get('vcitem_id')] ? 1 : changedRecords[record.get('vcitem_id')],
				success: function(data) {
					if (data) {
						grid.getStore().reload();
						that.showUserOrderSummary(that.userSummaryCallback);
					}
				}
			}
		});
	},

	restoreShoppingCart: function () {
		this.showUserOrderSummary(this.userSummaryCallback);
	},

	showAdvancedSearchResults: function (catalogs, type, property, keyword) {
		var grid = this.getCmp('catalog.favoriteitemsgrid');

		grid.addExtraParams({
			catalogs: catalogs,
			field: type,
			property: property,
			keyword: keyword,
			userprofile_id: NP.Security.getUser().get('userprofile_id')
		});

		grid.getStore().load();
	},

	showSimpleSearchResults: function(catalogs, type, property, keyword) {
		this.setView('NP.view.catalog.SimpleSearchView');
		this.showUserOrderSummary(this.userSummaryCallback);

		var grid = this.getCmp('catalog.favoriteitemsgrid');

		grid.addExtraParams({
			catalogs: catalogs,
			field: type,
			property: property,
			keyword: keyword,
			userprofile_id: NP.Security.getUser().get('userprofile_id')
		});

		grid.getStore().load();
	},

	showBrands: function() {
		this.setView('NP.view.catalog.BrandsView');
		this.showUserOrderSummary(this.userSummaryCallback);
	},

	focusBrandsGroup: function (text) {
		var grid = this.getCmp('catalog.alphabeticalbrandsgrid');
		var groups = grid.getStore().getGroups();
		for (var index in groups) {
			if (groups[index]['name'] == text) {
				grid.getView().focusRow(groups[index].children[0]['index']);
				break;
			}
		}
	},

	showItems: function(field, value, vc_id) {
		var me = this;
		var catalog;
		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'get',
				vc_id: vc_id,
				success: function(success) {
					catalog = success;

					me.setView('NP.view.catalog.ItemsView', {field: field, value: value, vc_id: vc_id, catalog: catalog});
					me.showUserOrderSummary(me.userSummaryCallback);
				}
			}
		});
	},

	removeTypeFilter: function (type) {
		var grid = this.getCmp('catalog.itemsview').down('[name="itemsgrid"]');
		grid.addExtraParams({
			types: type,
			field: null,
			value: null
		});
		grid.reloadFirstPage();
	},

	removePriceFilter: function(price) {
		var grid = this.getCmp('catalog.itemsview').down('[name="itemsgrid"]');
		grid.addExtraParams({
			prices: price
		});
		grid.reloadFirstPage();
	},

	removeTopFilter: function(type, count, vc_id) {
		if (count == 0) {
			this.addHistory('VendorCatalog:showCatalogView:' + vc_id);
		} else {
			var grid = this.getCmp('catalog.itemsview').down('[name="itemsgrid"]');
			if (type == 'category') {
				grid.addExtraParams({
					field: null,
					value: null
				});
			}
			if (type == 'price') {
				grid.addExtraParams({
					prices: null
				});
			}
			if (type == 'type') {
				grid.addExtraParams({
					types: null
				});
			}
			grid.reloadFirstPage();
		}
	}
});
