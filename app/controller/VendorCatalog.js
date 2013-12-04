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
			'[xtype="catalog.vcorder"] [xtype="catalog.vcordersgrid"]': {
				cellclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
					if (Ext.get(e.target).hasCls('remove')) {
						this.removeOrder(record.get('vcorder_id'));
					}
				},
				updateorder: this.updateOrders
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

	showOpenOrders: function() {
		this.setView('NP.view.catalog.VcOrder');
		this.showUserOrderSummary(this.userSummaryCallback);
	},

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
	}
});
