/**
 * Grid for Completed Invoices to Approve summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.InvoicesCompleted', {
	extend: 'NP.view.shared.tile.AbstractInvoiceTile',
	
	getCols: function() {
    	return ['invoice.gridcol.Date','property.gridcol.PropertyName','shared.gridcol.PriorityFlag',
    			'invoice.gridcol.NeededByDate','vendor.gridcol.VendorName','invoice.gridcol.Number',
    			'shared.gridcol.Amount','invoice.gridcol.PendingDays','invoice.gridcol.DueDate',
    			'invoice.gridcol.Period'];
    },

    getExcludedCols: function() {
    	return ['shared.gridcol.RejectedDate','shared.gridcol.RejectedBy','shared.gridcol.RejectedReason'];
    }
});