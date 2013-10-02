/**
 * Tile for Vendor Connect Authorization Requests summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.VcAuthRequests', {
    extend: 'NP.view.shared.tile.AbstractSummaryStatTile',

    requires: [
        'NP.store.user.VendorAccessUsers',
        'NP.lib.ui.Grid'
    ],

    getGrid: function() {
        return {
            xtype  : 'customgrid',
            paging : true,
            columns: [
                { xtype: 'datecolumn', text: 'Date', dataIndex: 'last_update_datetm' },
                { text: 'Company Name', dataIndex: 'vendor_name', flex: 1 },
                {
                    text     : 'Requested By',
                    dataIndex: 'person_lastname',
                    flex     : 1,
                    renderer : function(val, meta, rec) {
                        return rec.get('person_lastname') + ', ' + rec.get('person_firstname');
                    }
                }
            ]
        };
    },

    getStorePath: function() {
        return 'user.VendorAccessUsers';
    },

    getService: function() {
        return 'VendorConnectService';
    },

    getStoreParams: function() {
        return { countOnly  : false };
    },

    hasContextListener: function() {
        return false;
    }
});