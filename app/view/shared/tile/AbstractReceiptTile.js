/**
 * Abstract tile for receipt summary stats
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.AbstractReceiptTile', {
    extend: 'NP.view.shared.tile.AbstractSummaryStatTile',
    
    requires: [
        'NP.lib.core.Security',
        'NP.store.po.Receipts',
        'NP.view.receipt.ReceiptGrid'
    ],

    getGrid: function() {
        return {
            xtype       : 'receipt.receiptgrid',
            cols        : this.getCols(),
            excludedCols: this.getExcludedCols(),
            paging      : true
        };
    },

    getCols: function() {
        throw 'You must implement this function in your tile. It defines the columns for the invoice grid.';
    },

    getExcludedCols: function() {
        return [];
    },

    getStorePath: function() {
        return 'po.Receipts';
    },

    getService: function() {
        return 'ReceiptService';
    }
});