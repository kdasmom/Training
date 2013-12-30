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
		'catalog.ItemsView',
		'catalog.OrderCreate'
	],

	stores: [
		'catalog.VcItems',
		'catalog.VcOrders'
	],
	models: [],

	/**
	 * Init
	 */
	init: function(){
		Ext.log('Vendor Catalog Controller init');
		Ext.String.addCharacterEntities({
			'%20':' '
		});

		this.control({
			'[xtype="catalog.jumptocatalogform"] [xtype="button"]': {
				click: function() {
					var catalog = this.getCmp('catalog.jumptocatalogform').down('[name="vccat_id"]').getValue();
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
			'[xtype="catalog.catalogview"] [xtype="shared.button.search"]': {
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
			'[xtype="catalog.catalogview"] [xtype="shared.button.back"]': {
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
			'[xtype="catalog.vcorder"] [xtype="shared.button.favorite"]': {
				click: function() {
					this.addHistory('VendorCatalog:showFavorites');
				}
			},
			'[xtype="catalog.catalogview"] [xtype="shared.button.favorite"]': {
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
			'[xtype="catalog.vcorder"] [xtype="shared.button.shop"]': {
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
			'[xtype="catalog.catalogview"] [xtype="shared.button.shop"]': {
				click: function() {
					this.addHistory('VendorCatalog:showBrands');
				}
			},
			'[xtype="catalog.brandsview"]': {
				focusonletter: this.focusBrandsGroup
			},
			'[xtype="catalog.brandsdataview"]': {
				showbybrand: function(field, value, vc_id) {
					this.addHistory('VendorCatalog:showItemsListing:' + field + ':' + Ext.util.Format.htmlEncode(value) + ':' + vc_id);
				}
			},
			'[xtype="catalog.alphabeticalbrandsgrid"]': {
				itemclick: function(grid, record, item, index, e, eOpts) {
					this.addHistory('VendorCatalog:showItemsListing:brand:' + Ext.util.Format.htmlEncode(record.get('vcitem_manufacturer')) + ':' + record.get('vc_id'));
				}
			},
			'[xtype="catalog.categoriesdataview"]': {
				showbycategory: function(field, value, vc_id) {
					this.addHistory('VendorCatalog:showItemsListing:' + field + ':' + Ext.util.Format.htmlEncode(value) + ':' + vc_id);
				}
			},
			'[xtype="catalog.itemsfilter"]': {
				removetype: this.removeTypeFilter,
				removeprice: this.removePriceFilter,
				removefilter: this.removeTopFilter
			},
			'[xtype="catalog.vclisting"]': {
				showcatalog: function(vc_id) {
					this.addHistory('VendorCatalog:showCatalogView:' + vc_id);
				}
			}
		});

	},

	showVendorCatalogListing: function() {
		this.setView('NP.view.catalog.VCListing');
		this.showUserOrderSummary(this.userSummaryCallback);
	},

	showCatalogView: function(vc_id) {
		var me = this;
		var catalog, view, brands, iframeUrl, iframePdf, panelPunchout;

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'get',
				vc_id: vc_id,
				success: function(success) {

					catalog = success;
					view = me.setView('NP.view.catalog.CatalogView', {vc_id: vc_id, catalog: catalog});
					me.showUserOrderSummary(me.userSummaryCallback);
					catalogs = view.down('[name="categoriesview"]');
					brands = view.down('[name="brandsview"]');
					iframeUrl = view.down('[name="iframeUrl"]');
					iframePdf = view.down('[name="iframePdf"]');
					panelPunchout = view.down('[name="panelPunchout"]');

					if (catalog.vc_catalogtype == 'excel') {

						brands.show();
						catalogs.show();
						iframePdf.hide();
						iframeUrl.hide();
						panelPunchout.hide();

						Ext.apply(catalogs.down('dataview').getStore().getProxy().extraParams, {
							vc_id: vc_id
						});
						Ext.apply(brands.down('dataview').getStore().getProxy().extraParams, {
							vc_id: vc_id
						});

						catalogs.down('dataview').getStore().reload();
						brands.down('dataview').getStore().reload();
					}
					if ( catalog.vc_catalogtype == 'url') {
						brands.hide();
						catalogs.hide();
						iframePdf.hide();
						iframeUrl.show();
						panelPunchout.hide();
					}
					if ( catalog.vc_catalogtype == 'pdf') {
						brands.hide();
						catalogs.hide();
						iframePdf.show();
						iframeUrl.hide();
						panelPunchout.hide();
					}
					if ( catalog.vc_catalogtype == 'punchout') {
						brands.hide();
						catalogs.hide();
						iframePdf.hide();
						iframeUrl.hide();
						panelPunchout.show();
					}

					view.setTitle(catalog.vc_catalogname);
				}
			}
		});
	},

	/**
	 * Show advanced search
	 *
	 *
	 * @param catalogs
	 * @param type
	 * @param property
	 * @param keyword
	 */
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

	/**
	 * Return users summary
	 *
	 * @param items
	 * @param sum
	 * @param that
	 */
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
		var vendorscombo, store, grid;

		vendorscombo = form.down('[name="vendor_id"]');
		store = vendorscombo.getStore();
		Ext.apply(store.getProxy().extraParams, {
			property_id: value[0].get('property_id')
		});
		store.load();

		grid = this.getCmp('catalog.createordergrid');
		grid.addExtraParams({
			userprofile_id: NP.Security.getUser().get('userprofile_id'),
			vc_id: vc_id,
			property_id: value[0].get('property_id'),
			vcorder_id: vcorders
		});
		grid.getStore().reload();
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
		this.toggleFavorites(grid, record.get('vcitem_id'), false);
	},

	/**
	 * Add to favorites
	 * @param grid
	 * @param record
	 * @param index
	 */
	addToFavorites: function(grid, record, index) {
		this.toggleFavorites(grid, record.get('vcitem_id'), true);
	},

	/**
	 * Toggle Favorites
	 *
	 * @param grid
	 * @param vcitem_id
	 * @param add
	 */
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

	/**
	 * Restore user's shopping cart
	 *
	 */
	restoreShoppingCart: function () {
		this.showUserOrderSummary(this.userSummaryCallback);
	},

	/**
	 * Advanced grid
	 *
	 * @param catalogs
	 * @param type
	 * @param property
	 * @param keyword
	 */
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

	/**
	 * Simple search
	 *
	 * @param catalogs
	 * @param type
	 * @param property
	 * @param keyword
	 */
	showSimpleSearchResults: function(catalogs, type, property, keyword) {
		var view, vccatcombo, propertycombo;

		this.setView('NP.view.catalog.SimpleSearchView', {vc_id: catalogs, type: type, property: property, keyword: keyword});
		this.showUserOrderSummary(this.userSummaryCallback);

		if (arguments.length > 0) {
			view = this.getCmp('catalog.searchform');
			vccatcombo = view.down('[name="vccat_id"]');
			propertycombo = view.down('#property_id');

			vccatcombo.getStore().reload();
			propertycombo.getStore().reload();

			vccatcombo.setValue(parseInt(catalogs));
			view.down('#item_name').setValue(type);
			propertycombo.setValue(parseInt(property));
			view.down('#keyword').setValue(keyword);
		}

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
	 * Show brands
	 *
	 */
	showBrands: function() {
		this.setView('NP.view.catalog.BrandsView');
		this.showUserOrderSummary(this.userSummaryCallback);
	},

	/**
	 * Focus on brands
	 *
	 * @param text
	 */
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

	/**
	 * Show items
	 *
	 * @param field
	 * @param value
	 * @param vc_id
	 */
	showItemsListing: function(field, value, vc_id) {
		var me = this;
		var catalog;
		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'get',
				vc_id: vc_id,
				success: function(success) {
					catalog = success;

					var view = me.setView('NP.view.catalog.ItemsView', {field: field, value: Ext.util.Format.htmlDecode(value), vc_id: vc_id, catalog: catalog});
					view.title = catalog.vc_catalogname;
					me.showUserOrderSummary(me.userSummaryCallback);
				}
			}
		});
	},

	/**
	 * Remove type filter
	 *
	 * @param type
	 */
	removeTypeFilter: function (type) {
		var grid = this.getCmp('catalog.itemsview').down('[name="itemsgrid"]');
		grid.addExtraParams({
			types: type,
			field: null,
			value: null
		});
		grid.reloadFirstPage();
	},

	/**
	 * Remove price filter
	 *
	 * @param price
	 */
	removePriceFilter: function(price) {
		var grid = this.getCmp('catalog.itemsview').down('[name="itemsgrid"]');
		grid.addExtraParams({
			prices: price
		});
		grid.reloadFirstPage();
	},

	/**
	 * Remove all filters
	 *
	 * @param type
	 * @param count
	 * @param vc_id
	 */
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
