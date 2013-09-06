/**
 * Abstract tile for invoice summary stats
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.AbstractInvoiceTile', {
	extend: 'NP.view.shared.tile.AbstractSummaryStatTile',
	
	requires: [
		'NP.lib.core.Security',
		'NP.store.invoice.Invoices',
		'NP.view.invoice.InvoiceGrid'
	],

    getGrid: function() {
    	return {
            xtype       : 'invoice.invoicegrid',
            cols        : this.getCols(),
            excludedCols: this.getExcludedCols(),
            paging      : true
        };
    },

    getCols: function() {
    	throw 'You must implement this function in your tile. It defines the columns for the invoice grid.';
    },

    getExcludedCols: function() {
        return ['shared.gridcol.RejectedDate','shared.gridcol.RejectedBy','shared.gridcol.RejectedReason',
                'shared.gridcol.LastApprovedDate','shared.gridcol.LastApprovedBy','invoice.gridcol.HoldDate',
                'invoice.gridcol.DaysOnHold','invoice.gridcol.OnHoldBy'];
    },

    getStorePath: function() {
        return 'invoice.Invoices';
    },

    getService: function() {
        return 'InvoiceService';
    }
});