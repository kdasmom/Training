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
			'[xtype="catalog.jumptocatalogform"] button': {
				click: function() {
					console.log('jump');
				}
			},
			'[xtype="catalog.vclisting"] [xtype="shared.button.search"]': {
				click: function() {
					this.addHistory('VendorCatalog:showAdvancedSearch');
				}
			},
			'[xtype="catalog.advancedsearch"] [xtype="shared.button.back"]': {
				click: function() {
					this.addHistory('VendorCatalog:showVendorCatalogListing');
				}
			}
		});

	},

	showVendorCatalogListing: function() {
		this.setView('NP.view.catalog.VCListing');
	},

	showCatalogView: function(catalog_id) {
		var grid = this.setView('NP.view.catalog.VCCatalogView');

		// Load the store
		grid.reloadFirstPage();
	},

	showAdvancedSearch: function() {
		this.setView('NP.view.catalog.AdvancedSearch');
	}
});
