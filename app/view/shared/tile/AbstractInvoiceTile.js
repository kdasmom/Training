/**
 * Grid for Completed Invoices to Approve summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.AbstractInvoiceTile', {
	extend: 'NP.view.shared.tile.AbstractSummaryStatTile',
	
	requires: [
		'NP.lib.core.Security',
		'NP.store.invoice.Invoice',
		'NP.view.invoice.grid.AbstractInvoiceGrid'
	],

    getGrid: function() {
    	return {
			xtype   : 'invoice.grid.abstractinvoicegrid',
			cols    : this.getCols(),
    		paging  : true
        };
    },

    getCols: function() {
    	throw 'You must implement this function in your tile. It defines the columns for the invoice grid.';
    },

    getStorePath: function() {
        return 'invoice.Invoice';
    },

    getService: function() {
        return 'InvoiceService';
    }
});