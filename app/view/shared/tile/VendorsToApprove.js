/**
 * Tile for Vendors to Approve summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.VendorsToApprove', {
	extend: 'NP.view.shared.tile.AbstractSummaryStatTile',
	
    requires: [
        'NP.store.vendor.Vendors',
        'NP.view.vendor.VendorGrid'
    ],

    getGrid: function() {
        return {
            xtype       : 'vendor.vendorgrid',
            cols        : ['vendor.gridcol.SentForApprovalDate','vendor.gridcol.VendorName','vendor.gridcol.SentForApprovalBy',
                            'vendor.gridcol.ApprovalType','shared.gridcol.IntegrationPackageName'],
            paging      : true
        };
    },

    getStorePath: function() {
        return 'vendor.Vendors';
    },

    getService: function() {
        return 'VendorService';
    },

    getStoreParams: function() {
        return { countOnly  : false };
    },

    hasContextListener: function() {
        return false;
    }
});