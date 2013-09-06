/**
 * Grid for Rejected Invoices summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.InvoicesRejected', {
	extend: 'NP.view.shared.tile.AbstractInvoiceTile',
	
	getCols: function() {
    	return ['invoice.gridcol.Date','property.gridcol.PropertyName','shared.gridcol.PriorityFlag',
    			'invoice.gridcol.NeededByDate','vendor.gridcol.VendorName','invoice.gridcol.Number',
    			'shared.gridcol.Amount','invoice.gridcol.PendingDays','invoice.gridcol.DueDate'];
    },

    getExcludedCols: function() {
        return [];
    },
});