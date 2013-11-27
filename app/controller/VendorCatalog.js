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
			'[xtype="catalog.usermanager"]': {
				// Run this whenever the user clicks on a tab on the Property Setup page
				tabchange: function(tabPanel, newCard, oldCard, eOpts) {
					Ext.log('UserManager onTabChange() running');

					var activeTab = Ext.getClassName(newCard).split('.').pop();
					this.addHistory('UserManager:showUserManager:' + activeTab);
				}
			}
		});

	},

	showVendorCatalogListing: function() {
		this.setView('NP.view.catalog.VCListing');
	}
});
