/**
 * @author Baranov A.V.
 * @date 10/2/13
 */


Ext.define('NP.controller.VendorManager', {
    extend: 'NP.lib.core.AbstractController',

    requires: [
        'NP.lib.core.Config',
        'NP.lib.core.Security',
        'NP.lib.core.Net',
        'NP.lib.core.Util'
    ],
//  for localization

    /**
     * Init
     */
    init: function(){

        var app = this.application;

    },

    showVendorManager: function(activeTab) {
        var that = this;

        // Set the User Manager view
        var tabPanel = that.setView('NP.view.vendor.VendorsManager');

    },

	loadVendorsGrid: function(grid) {

		grid.reloadFirstPage();
	}
});
