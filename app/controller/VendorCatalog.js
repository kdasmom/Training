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
		'catalog.OrderItemWindow'
	],

	/**
	 * Init
	 */
	init: function(){
		Ext.log('Vendor Catalog Controller init');

		this.control({
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
			'[xtype="catalog.advancedsearch"] [xtype="shared.button.back"]': {
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
			}
		});

	},

	showVendorCatalogListing: function() {
		this.setView('NP.view.catalog.VCListing');
		this.showUserOrderSummary(this.userSummaryCallback);
	},

	showCatalogView: function(catalog_id) {
		var grid = this.setView('NP.view.catalog.VCCatalogView');
		this.showUserOrderSummary(this.userSummaryCallback);

		// Load the store
		grid.reloadFirstPage();
	},

	showAdvancedSearch: function() {
		this.setView('NP.view.catalog.AdvancedSearch');
		this.showUserOrderSummary(this.userSummaryCallback);
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

	showOrderItemDetailsWindow: function (grid, record, rowIndex, fromOrder) {
		console.log(record);

		NP.lib.core.Net.remoteCall({
			requests: {
				service: 'CatalogService',
				action : 'getOrderItemInformation',
				userprofile_id : NP.Security.getUser().get('userprofile_id'),
				vcitem_id : record.get('vcitem_id'),
				success: function(data) {
					if (data) {
						Ext.create('NP.view.catalog.OrderItemWindow', { fromOrder: fromOrder, data: data[0] }).show();
					}
				}
			}
		});
	}
});
