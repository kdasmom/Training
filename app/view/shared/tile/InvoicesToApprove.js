/**
 * Grid for Invoices to Approve summary stat
 *
 * @author Thomas Messier
 */
Ext.define('NP.view.shared.tile.InvoicesToApprove', {
	extend: 'NP.view.shared.tile.AbstractInvoiceTile',
	
	getCols: function() {
    	return ['invoice.gridcol.Date','property.gridcol.PropertyName','vendor.gridcol.VendorName',
    			'invoice.gridcol.Number','shared.gridcol.Amount','invoice.gridcol.PendingDays',
    			'invoice.gridcol.DueDate'];
    },

    getExcludedCols: function() {
    	return ['shared.gridcol.RejectedDate','shared.gridcol.RejectedBy','shared.gridcol.RejectedReason'];
    }
});