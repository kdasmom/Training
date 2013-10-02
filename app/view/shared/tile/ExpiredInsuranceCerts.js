/**
 * Tile for Expired Insurance Certificates summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.ExpiredInsuranceCerts', {
    extend: 'NP.view.shared.tile.AbstractSummaryStatTile',

    requires: [
        'NP.store.vendor.Insurances',
        'NP.lib.ui.Grid',
        'NP.view.vendor.gridcol.VendorName',
        'NP.view.vendor.gridcol.VendorCode',
        'NP.view.vendor.gridcol.InsuranceTypeName',
        'NP.view.shared.gridcol.IntegrationPackageName'
    ],

    getGrid: function() {
        return {
            xtype  : 'customgrid',
            paging : true,
            columns: [
                { xtype: 'vendor.gridcol.vendorname', flex: 1 },
                { xtype: 'vendor.gridcol.vendorcode', flex: 1 },
                { xtype: 'datecolumn', text: 'Expiration Date', dataIndex: 'insurance_expdatetm' },
                { xtype: 'numbercolumn', text: 'Number of Days Until Expiration', dataIndex: 'days_to_expiration', format: '0,000', align: 'right', flex: 1 },
                { xtype: 'vendor.gridcol.insurancetypename', flex: 1 },
                { xtype: 'shared.gridcol.integrationpackagename', flex: 1 }
            ]
        };
    },

    getStorePath: function() {
        return 'vendor.Insurances';
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